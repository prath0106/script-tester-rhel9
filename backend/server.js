const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk'); // Import the Anthropic library

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/generate-script', upload.single('file'), async (req, res) => {
    const { apiKey } = req.body;
    const requirements = fs.readFileSync(req.file.path, 'utf8');

    fs.unlinkSync(req.file.path); 

    const systemPrompt = "You are an expert in Red Hat Enterprise Linux 9. Generate a single, complete, and executable RHEL 9 bash script based on the provided 3 requirements. The script should be robust and well-commented. Do not include any explanatory text, markdown formatting, or anything other than the raw script code itself. Start the script with `#!/bin/bash`. and include a part of the script where at the end it generates a summary report for each of the 3 requirements on whether they PASSED or FAILED. GREEN for PASS and RED for FAIL";

    try {
        const anthropic = new Anthropic({ apiKey: apiKey }); // Authenticate with the API key

        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-20250219", // The latest Sonnet model
            max_tokens: 2048,
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
    const scriptPath = path.join(__dirname, 'temp_script.sh');
    fs.writeFileSync(scriptPath, script);

    exec(`"C:\\Program Files\\Git\\bin\\bash.exe" ${scriptPath}`, (error, stdout, stderr) => {
        fs.unlinkSync(scriptPath);

        if (error) {
            console.error(`exec error: ${error}`);
            return res.json({
                status: 'Failed',
                output: stderr,
                html: `<h1>Script Failed ❌</h1><pre class="script-box">${stderr}</pre>`,
                csv: 'status,output\nFailed,"' + stderr.replace(/"/g, '""') + '"'
            });
        }
        res.json({
            status: 'Passed',
            output: stdout,
            html: `<h1>Script Passed ✅</h1><pre class="script-box">${stdout}</pre>`,
            csv: 'status,output\nPassed,"' + stdout.replace(/"/g, '""') + '"'
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});