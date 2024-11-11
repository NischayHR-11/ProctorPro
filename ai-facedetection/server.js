const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Start the Python script
const pythonProcess = spawn('python', ['face_detection.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
});

app.listen(PORT, () => {
    console.log(`Node server running at http://localhost:${PORT}`);
});
