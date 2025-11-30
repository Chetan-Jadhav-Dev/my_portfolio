# Deployment Guide

This guide will help you deploy your portfolio website for free.

## Overview

- **Frontend**: Deploy to GitHub Pages (free, automatic via GitHub Actions)
- **Backend**: Deploy to Render/Railway/Fly.io (free tier available)

## Frontend Deployment (GitHub Pages)

### Automatic Deployment

1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The workflow in `.github/workflows/deploy-frontend.yml` will automatically deploy on push to main

### Manual Setup

1. Update `frontend/package.json` homepage field if needed
2. Set the `REACT_APP_API_URL` environment variable in GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add a new secret: `API_URL` with your backend URL (e.g., `https://your-backend.onrender.com/api`)

## Backend Deployment Options

### Option 1: Render (Recommended - Easiest)

1. **Sign up** at [render.com](https://render.com) (free tier available)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - **Name**: portfolio-backend
     - **Environment**: Python 3
     - **Build Command**: `cd backend && pip install -r requirements.txt`
     - **Start Command**: `cd backend && python app.py`
     - **Root Directory**: Leave empty (or set to `backend` if Render supports it)

3. **Environment Variables** (in Render dashboard):
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   DATABASE_URL=sqlite:///portfolio.db
   CORS_ORIGINS=https://yourusername.github.io,http://localhost:3000
   PORT=10000
   ```

4. **Deploy**: Render will automatically deploy on every push to main

5. **Update Frontend**: Update the `REACT_APP_API_URL` in GitHub Secrets to point to your Render URL

### Option 2: Railway

1. **Sign up** at [railway.app](https://railway.app)

2. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**:
   - Railway will auto-detect Python
   - Set root directory to `backend`
   - Add environment variables (same as Render)

4. **Deploy**: Railway will automatically deploy

### Option 3: Fly.io

1. **Install flyctl**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Initialize** (in backend directory):
   ```bash
   cd backend
   fly launch
   ```

4. **Configure**:
   - Follow the prompts
   - Set environment variables using `fly secrets set`

5. **Deploy**:
   ```bash
   fly deploy
   ```

## Database Considerations

### SQLite (Current Setup)
- Works for small to medium portfolios
- File-based, no separate database service needed
- **Note**: On free hosting services, the database file may reset on redeploy
- **Solution**: Use a persistent volume or upgrade to PostgreSQL

### PostgreSQL (Recommended for Production)

1. **Render**: Create a PostgreSQL database (free tier available)
2. **Update DATABASE_URL**: `postgresql://user:password@host:port/dbname`
3. **Install psycopg2**: Add to `requirements.txt`
   ```
   psycopg2-binary==2.9.9
   ```

## Complete Deployment Steps

1. **Deploy Backend First**:
   - Choose a hosting service (Render recommended)
   - Deploy and get the URL (e.g., `https://portfolio-backend.onrender.com`)

2. **Update Frontend API URL**:
   - In GitHub Secrets, set `API_URL` to `https://portfolio-backend.onrender.com/api`
   - Or update `frontend/src/components/Home.js` and `Admin.js` directly

3. **Deploy Frontend**:
   - Push to main branch
   - GitHub Actions will automatically deploy to GitHub Pages
   - Your site will be at `https://yourusername.github.io/Portfolio`

4. **Update CORS**:
   - Make sure backend `CORS_ORIGINS` includes your GitHub Pages URL

## Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Frontend**:
   - Visit your GitHub Pages URL
   - Check browser console for API connection errors

3. **Admin Dashboard**:
   - Visit `https://your-username.github.io/Portfolio/admin`
   - Login with your admin credentials
   - Test adding/editing content

## Troubleshooting

### CORS Errors
- Make sure backend `CORS_ORIGINS` includes your frontend URL
- Check that URLs don't have trailing slashes

### Database Issues
- SQLite files may not persist on free hosting
- Consider upgrading to PostgreSQL for production

### Build Failures
- Check GitHub Actions logs
- Verify all environment variables are set
- Ensure `package.json` and `requirements.txt` are correct

## Security Notes

⚠️ **Important**: Before deploying to production:
1. Change default admin credentials
2. Use strong SECRET_KEY and JWT_SECRET_KEY
3. Enable HTTPS (most hosting services do this automatically)
4. Consider rate limiting for API endpoints
5. Add input validation and sanitization

## Free Hosting Limits

- **GitHub Pages**: Unlimited bandwidth, 1GB storage
- **Render Free Tier**: 750 hours/month, spins down after 15 min inactivity
- **Railway Free Tier**: $5 credit/month
- **Fly.io Free Tier**: 3 shared VMs, 3GB persistent storage

Choose based on your needs and traffic expectations!

