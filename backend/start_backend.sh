#!/bin/bash
cd "$(dirname "$0")"

# Activate virtual environment if it exists (for local development)
if [ -d "venv/bin" ]; then
    source venv/bin/activate
fi

export FLASK_APP=app.py
export FLASK_ENV=${FLASK_ENV:-development}
export PORT=${PORT:-5001}

# Run the app
python app.py

