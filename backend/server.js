const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = 3001;

const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
}

app.use(cors());
app.use(express.json());
app.use('/reports', express.static(reportsDir));

const upload = multer({ dest: 'uploads/' });

app.post('/generate-script', upload.single('file'), async (req, res) => {
    const { apiKey } = req.body;
    const requirements = fs.readFileSync(req.file.path, 'utf8');
    fs.unlinkSync(req.file.path);

    // Final prompt: Forces the AI to save the report to a specific, known directory.
    const systemPrompt = "You are an expert in Red Hat Enterprise Linux 9. Generate a single, complete, and executable RHEL 9 bash script based on the provided requirements. IMPORTANT: This script will be executed inside a privileged Docker container. The script must first create the '/etc/modprobe.d' directory if it doesn't exist. At the end of the script, it MUST save its final HTML report to the path '/reports/security_report.html'. Do not save it anywhere else. The script should be robust and self-contained. Do not include any explanatory text, markdown formatting, or anything other than the raw script code itself. Start the script with `#!/bin/bash`.";

    try {
        const anthropic = new Anthropic({ apiKey: apiKey });
        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 8192,
            system: systemPrompt,
            messages: [{ role: "user", content: requirements }],
        });
        const generatedScript = response.content[0].text;
        res.json({ script: generatedScript.trim() });
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: 'Failed to generate script from AI model.' });
    }
});

app.post('/run-script', (req, res) => {
    const { script } = req.body;
    const scriptContent = script.replace(/\r\n/g, '\n');
    const tempScriptPath = path.join(__dirname, 'temp_script.sh');
    fs.writeFileSync(tempScriptPath, scriptContent);

    const projectRoot = path.resolve(__dirname, '..');
    const finalScriptPath = path.join(projectRoot, 'test-scripts', 'test_script.sh');
    fs.renameSync(tempScriptPath, finalScriptPath);

    // This command now includes 'docker builder prune -f' at the end to clean the cache
    const command = `docker build -t rhel9-script-runner "${projectRoot}" && docker run --privileged --rm -v "${finalScriptPath}:/app/test_script.sh" -v "${path.resolve(reportsDir)}:/reports" rhel9-script-runner bash /app/test_script.sh 2>&1; docker builder prune -f`;

    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
        fs.unlinkSync(finalScriptPath);

        const reportFileName = 'security_report.html';
        const hostReportPath = path.join(reportsDir, reportFileName);

        if (fs.existsSync(hostReportPath)) {
            const htmlContent = fs.readFileSync(hostReportPath, 'utf8');
            const newFileName = `report-${Date.now()}.html`;
            const newFilePath = path.join(reportsDir, newFileName);
            fs.renameSync(hostReportPath, newFilePath);
            const downloadUrl = `http://localhost:3001/reports/${newFileName}`;

            res.json({
                status: 'Report Generated',
                output: htmlContent,
                html: htmlContent,
                downloadUrl: downloadUrl
            });
        } else {
            const output = stdout || stderr;
            res.status(500).json({
                status: 'Failed',
                output: output,
                html: `<h1>Script Failed to Generate Report ❌</h1><pre class="script-box">${output}</pre>`,
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:3001`);
});