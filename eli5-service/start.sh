#!/bin/bash

echo "Setting up ELI5 Financial Explanation Microservice..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Start the service
echo "Starting ELI5 Financial Explanation Service on port 8000..."
echo "Open http://localhost:8000/docs to see API documentation"
python main.py