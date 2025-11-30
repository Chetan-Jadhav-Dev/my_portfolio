# Starting the Backend Server

## Quick Start

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

3. **Start the server:**
   ```bash
   python app.py
   ```

   Or use the startup script:
   ```bash
   ./start_backend.sh
   ```

## The backend will start on:
- **URL:** http://localhost:5001
- **API Base:** http://localhost:5001/api

## Verify it's running:
- Open http://localhost:5001/api/health in your browser
- You should see: `{"status":"healthy"}`

## Troubleshooting

### Port 5001 already in use:
```bash
# Find what's using the port
lsof -ti:5001

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

### Database errors:
```bash
# Reinitialize the database
python init_db.py
```

### CORS errors:
- Make sure frontend is running on http://localhost:3000 or http://localhost:5173
- Check that CORS_ORIGINS in config.py includes your frontend URL

