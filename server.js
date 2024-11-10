const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const { spawn } = require('child_process');  // To run the Python script

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files (frontend HTML)
app.use(express.static('public'));

// Route for video stream (redirect to Python MJPEG stream)
app.get('/video-stream', (req, res) => {
    res.redirect('http://127.0.0.1:5000/video');  // Redirect to Flask stream
});

// Route for missed frames API proxy
app.get('/missed-frames', (req, res) => {
    fetch('http://127.0.0.1:5000/missed-frames')
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => console.error('Error fetching missed frames:', error));
});

// Start the Python script automatically when the server starts
function startPythonScript() {
    const python = spawn('python', ['face_detection.py']);  // Run the Python script

    // Log Python output to the console
    python.stdout.on('data', (data) => {
        console.log(`Python script output: ${data}`);
    });

    // Handle Python script errors
    python.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
    });

    // Handle Python script exit
    python.on('close', (code) => {
        console.log(`Python script exited with code ${code}`);
    });
}

// Run the Python script when server starts
startPythonScript();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
