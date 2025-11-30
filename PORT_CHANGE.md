# Important: Port Change Notice

## Backend Port Changed

Due to macOS AirPlay Receiver using port 5000, the backend has been moved to **port 5001**.

### Updated Ports:
- **Backend (Flask API)**: `http://localhost:5001` (changed from 5000)
- **Frontend (React)**: `http://localhost:3000` (unchanged)

### Admin Login Credentials:
- **Username**: `admin`
- **Password**: `admin123`

## What Was Changed:

1. **Backend** (`backend/app.py`): Port changed from 5000 to 5001
2. **Frontend API URLs**: All components updated to use port 5001
   - `Admin.js`
   - `Home.js`
   - `Analytics.js`
   - `analytics.js` (utils)

## How to Access:

1. **Backend API**: `http://localhost:5001/api`
2. **Admin Dashboard**: `http://localhost:3000/admin`
3. **Portfolio**: `http://localhost:3000`

## If You Want to Use Port 5000:

If you prefer to use port 5000, you need to disable macOS AirPlay Receiver:

1. Open **System Preferences** (or **System Settings** on newer macOS)
2. Go to **General** → **AirDrop & Handoff**
3. Disable **AirPlay Receiver**

Then change the port back to 5000 in `backend/app.py`:
```python
port = int(os.environ.get('PORT', 5000))
```

And update all frontend API URLs back to port 5000.

## Testing:

Test the backend:
```bash
curl http://localhost:5001/api/health
```

Test login:
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

