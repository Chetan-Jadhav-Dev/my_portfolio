# Troubleshooting Guide

## Port Configuration

**Important**: The backend and frontend run on different ports:

- **Backend (Flask)**: `http://localhost:5000`
- **Frontend (React)**: `http://localhost:3000`

The backend API is accessible at: `http://localhost:5000/api`

## Admin Login Credentials

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

These are set in `backend/config.py` and can be overridden with environment variables.

## Common Issues

### 1. Cannot Login to Admin Dashboard

**Symptoms**: "Invalid credentials" error when trying to login

**Solutions**:
1. **Verify credentials are correct**:
   - Username: `admin` (case-sensitive)
   - Password: `admin123` (case-sensitive)

2. **Check if backend is running**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"healthy"}`

3. **Check backend logs** for errors

4. **Verify no .env file is overriding credentials**:
   ```bash
   cd backend
   ls -la .env  # Should not exist or check its contents
   ```

5. **Test login directly**:
   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

### 2. Backend Not Working

**Symptoms**: Cannot connect to backend, API calls fail

**Solutions**:

1. **Check if backend is running**:
   ```bash
   lsof -ti:5000
   # Should return a process ID
   ```

2. **Restart the backend**:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

3. **Check for port conflicts**:
   ```bash
   lsof -i:5000
   # Kill any conflicting processes
   ```

4. **Verify database exists**:
   ```bash
   cd backend
   ls -la portfolio.db
   # If missing, run: python init_db.py
   ```

### 3. CORS Errors

**Symptoms**: Browser console shows CORS errors

**Solutions**:

1. **Verify CORS origins in config**:
   - Check `backend/config.py` - should include `http://localhost:3000`

2. **Check backend is running on correct port** (5000, not 3000)

3. **Clear browser cache** and try again

### 4. Frontend Cannot Connect to Backend

**Symptoms**: Frontend shows connection errors

**Solutions**:

1. **Verify API URL**:
   - Frontend should use: `http://localhost:5000/api`
   - Check `frontend/src/components/Admin.js` line 6

2. **Check both servers are running**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

3. **Test backend directly**:
   ```bash
   curl http://localhost:5000/api/health
   ```

## Quick Start Commands

### Start Backend
```bash
cd backend
source venv/bin/activate
python app.py
```
Backend will run on: `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

### Access Admin Dashboard
1. Open browser: `http://localhost:3000/admin`
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## Changing Admin Password

To change the admin password, you have two options:

### Option 1: Environment Variable (Recommended)
Create a `.env` file in the `backend` directory:
```bash
cd backend
cat > .env << EOF
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-new-password
EOF
```

### Option 2: Direct Config
Edit `backend/config.py`:
```python
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD') or 'your-new-password'
```

**Important**: After changing password, restart the backend server.

## Verifying Everything Works

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected: `{"status":"healthy"}`

2. **Test Login**:
   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
   Expected: JSON with `access_token`

3. **Frontend Access**:
   - Open: `http://localhost:3000`
   - Should see your portfolio

4. **Admin Dashboard**:
   - Open: `http://localhost:3000/admin`
   - Login with admin/admin123
   - Should see analytics dashboard

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for JavaScript errors
3. Verify all dependencies are installed:
   ```bash
   # Backend
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```

4. Try restarting both servers
5. Clear browser cache and cookies

