import React, { useState } from 'react';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [apiKey, setApiKey] = useState('');
    // The 'model' state is no longer needed
    const [script, setScript] = useState('');
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const generateScript = async () => {
        if (!file || !apiKey) {
            setError('Please provide a requirements file and an anthropic API key.');
            return;
        }
        setError('');
        setIsLoading(true);
        setScript('');
        setReport(null);

        const formData = new FormData();
        formData.append('file', file);
        // We no longer need to send the model, just the API key
        formData.append('apiKey', apiKey);

        try {
            const response = await fetch('http://localhost:3001/generate-script', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Something went wrong');
            }

            const data = await response.json();
            setScript(data.script);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const runScript = async () => {
        setIsLoading(true);
        setReport(null);
        try {
            const response = await fetch('http://localhost:3001/run-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ script }),
            });
            const data = await response.json();
            setReport(data);
        } catch (err) {
            setError('Failed to run script.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>RHEL 9 Script Generator & Tester - Claude 3.7 Sonnet 🚀</h1>
                <div className="card">
                    <h2>1. Configure & Provide Requirements</h2>
                    
                    {/* This entire section for the model dropdown is deleted */}

                    <label htmlFor="api-key-input">Enter Anthropic AI API Key:</label>
                    <input
                        id="api-key-input"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Your API key"
                    />

                    <label htmlFor="file-upload">Upload Requirements File:</label>
                    <input id="file-upload" type="file" onChange={handleFileChange} />
                    
                    <button onClick={generateScript} disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Script'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>

                {script && (
                    <div className="card">
                        <h2>2. Review & Run Generated Script</h2>
                        <pre className="script-box">{script}</pre>
                        <button onClick={runScript} disabled={isLoading}>
                            {isLoading ? 'Running...' : 'Run Script'}
                        </button>
                    </div>
                )}

                {report && (
                    <div className="card">
                        <h2>3. Results</h2>
                        <div dangerouslySetInnerHTML={{ __html: report.html }} />
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;