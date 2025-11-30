# Quick Start Guide

Get your portfolio website up and running in minutes!

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ and npm installed
- Git installed

## Local Development Setup

### 1. Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py

# Make sure instance directory exists
mkdir -p instance

# Run the Flask server
python app.py
```

The backend will be running at `http://localhost:5001`

**Verify it's working:**
- Open http://localhost:5001/api/health in your browser
- You should see: `{"status":"healthy"}`

### 2. Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be running at `http://localhost:3000`

### 3. Access Your Portfolio

- **Portfolio**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
  - Username: `admin`
  - Password: `admin123`

## First Steps

1. **Login to Admin Dashboard**
   - Go to http://localhost:3000/admin
   - Login with default credentials

2. **Update About Information**
   - Click on "About" tab
   - Fill in your name, bio, social links, etc.
   - Click "Update About"

3. **Add Your Projects**
   - Click on "Projects" tab
   - Fill in project details
   - Add technologies (comma-separated)
   - Click "Create Project"

4. **Add Your Skills**
   - Click on "Skills" tab
   - Add skills with proficiency levels (0-100)
   - Organize by categories

5. **Customize**
   - Edit the CSS files to match your style
   - Update colors, fonts, layouts in `frontend/src/App.css`

## Testing the API

You can test the API endpoints directly:

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Get about information
curl http://localhost:5000/api/about

# Health check
curl http://localhost:5000/api/health
```

## Next Steps

1. **Change Admin Password**: Update `ADMIN_PASSWORD` in `backend/config.py` or `.env` file
2. **Add Your Content**: Use the admin dashboard to add your projects and skills
3. **Customize Design**: Edit CSS files to match your brand
4. **Deploy**: Follow the `DEPLOYMENT.md` guide to deploy for free

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version: `python --version` (should be 3.11+)

### Frontend won't start
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for port conflicts (3000 might be in use)

### Database issues
- Delete `portfolio.db` and run `python init_db.py` again
- Make sure you're in the `backend` directory when running commands

### CORS errors
- Make sure backend is running on port 5000
- Check `backend/config.py` CORS_ORIGINS includes `http://localhost:3000`

## Need Help?

- Check the main `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment instructions
- Review the code comments for implementation details

Happy coding! 🚀

