#!/bin/bash
# Backend startup script

cd "$(dirname "$0")"

echo "=========================================="
echo "Starting Portfolio Backend Server"
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found!"
    echo "Please run: python3 -m venv venv"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if instance directory exists
if [ ! -d "instance" ]; then
    echo "Creating instance directory..."
    mkdir -p instance
fi

# Check database
if [ ! -f "instance/portfolio.db" ]; then
    echo "Database not found. Initializing..."
    python init_db.py
fi

echo ""
echo "Starting Flask server on http://localhost:5001"
echo "Press Ctrl+C to stop"
echo "=========================================="
echo ""

# Start the server
python app.py

