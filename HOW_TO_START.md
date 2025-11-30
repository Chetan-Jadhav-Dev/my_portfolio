# How to Start the Backend Server

## The Problem
You're getting "connection failed" because **the backend server is not running**. You need to start it first.

## Solution: Start the Backend

### Step 1: Open a Terminal
Open Terminal (or your preferred terminal application).

### Step 2: Navigate to Backend Directory
```bash
cd ~/Desktop/Portfolio/backend
```

### Step 3: Start the Server

**Easiest way (Recommended):**
```bash
./run.sh
```

**Or manually:**
```bash
source venv/bin/activate
python app.py
```

### Step 4: Verify It's Running
You should see output like:
```
 * Running on http://0.0.0.0:5001
 * Debug mode: on
```

**Then test in your browser:**
- Open: http://localhost:5001/api/health
- You should see: `{"status":"healthy"}`

## Important Notes

1. **Keep the terminal open** - The server runs in this terminal. Don't close it!
2. **The server must be running** - The frontend needs the backend to be running to work
3. **Use a new terminal** for the frontend - Open a second terminal window for the frontend

## Next Steps

Once the backend is running:
1. Open a **NEW terminal window**
2. Start the frontend:
   ```bash
   cd ~/Desktop/Portfolio/frontend
   npm start
   ```

## Troubleshooting

**If you get "Permission denied" on ./run.sh:**
```bash
chmod +x run.sh
./run.sh
```

**If port 5001 is already in use:**
```bash
lsof -ti:5001 | xargs kill -9
```

**If you see database errors:**
```bash
python init_db.py
```

