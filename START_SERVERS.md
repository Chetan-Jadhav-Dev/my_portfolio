# Starting the Portfolio Application

## Quick Start

### 1. Start the Backend Server

Open a terminal and run:

**Option 1 - Using the run script (Recommended):**
```bash
cd backend
./run.sh
```

**Option 2 - Manual start:**
```bash
cd backend
source venv/bin/activate
python app.py
```

**Option 3 - Using start_backend.sh:**
```bash
cd backend
./start_backend.sh
```

The backend will start on: **http://localhost:5001**

**Verify it's running:**
- Open http://localhost:5001/api/health in your browser
- You should see: `{"status":"healthy"}`

### 2. Start the Frontend Server

Open a **NEW terminal window** and run:

```bash
cd frontend
npm start
```

The frontend will start on: **http://localhost:3000**

## Troubleshooting

### Backend Issues

**Port 5001 already in use:**
```bash
# Find what's using the port
lsof -ti:5001

# Kill the process (replace PID with actual process ID)
kill -9 PID
```

**Database errors:**
```bash
cd backend
source venv/bin/activate
# Reinitialize the database
python init_db.py
```

**Connection refused errors:**
- Make sure the backend is running on port 5001
- Check that no firewall is blocking the port
- Verify CORS settings in `backend/config.py`

### Frontend Issues

**API connection failed:**
- Make sure backend is running on http://localhost:5001
- Check browser console for CORS errors
- Verify `API_URL` in frontend components points to `http://localhost:5001/api`

**Port 3000 already in use:**
```bash
# The frontend will ask to use a different port, or:
lsof -ti:3000 | xargs kill -9
```

## Verification Checklist

- [ ] Backend is running on http://localhost:5001
- [ ] Health check works: http://localhost:5001/api/health
- [ ] Frontend is running on http://localhost:3000
- [ ] Frontend can connect to backend API
- [ ] Admin dashboard accessible at http://localhost:3000/admin
- [ ] Login works (admin/admin123)

## Default Credentials

- **Username:** admin
- **Password:** admin123

