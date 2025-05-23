#!/bin/bash

# Update package list and install required system libraries
apt-get update && apt-get install -y libsm6 libxext6 libxrender-dev libgl1

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Start the application (assuming 'npm start' runs your Node.js server)
npm start
