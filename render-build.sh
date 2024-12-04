#!/bin/bash

# Update the package list and install required system libraries
apt-get update && apt-get install -y libsm6 libxext6 libxrender-dev libgl1

# Install Python dependencies
pip install -r requirements.txt
