# Deployment Setup Guide

This guide will help you deploy your portfolio application to free hosting services.

## Free Hosting Options

### 1. Render (Recommended for Backend)
- **Free Tier**: 750 hours/month (enough for 24/7 operation)
- **URL**: https://render.com
- **Setup**: Already configured with `render.yaml`

### 2. Railway (Alternative)
- **Free Tier**: $5 credit/month
- **URL**: https://railway.app

### 3. Fly.io (Alternative)
- **Free Tier**: 3 shared VMs
- **URL**: https://fly.io

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository
4. Render will auto-detect `render.yaml` configuration
5. Or manually configure:
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Plan**: Free

### Step 3: Configure Environment Variables
In Render dashboard, add these environment variables:

```
FLASK_ENV=production
SECRET_KEY=<generate-random-string>
JWT_SECRET_KEY=<generate-random-string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-password>
DATABASE_URL=sqlite:///portfolio.db
PORT=10000
CORS_ORIGINS=https://your-frontend-domain.com
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com
GITHUB_TOKEN=<optional-github-token>
```

### Step 4: Get Service ID and API Key
1. Go to your service settings
2. Copy the **Service ID**
3. Go to Account Settings → API Keys
4. Create a new API key
5. Add these to GitHub Secrets:
   - `RENDER_SERVICE_ID`
   - `RENDER_API_KEY`

## Frontend Deployment

### Option 1: Vercel (Recommended)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

### Option 2: Netlify
1. Go to https://netlify.com
2. Sign up with GitHub
3. Add new site from Git
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

## GitHub Actions Setup

### 1. Add Secrets to GitHub
Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
- `RENDER_SERVICE_ID`: Your Render service ID
- `RENDER_API_KEY`: Your Render API key

### 2. Workflows
The following workflows are configured:
- **backend-ci.yml**: Runs linting and tests on push/PR
- **pr-checks.yml**: Runs checks on pull requests
- **deploy-backend.yml**: Auto-deploys backend on main branch push

## Database Setup

### For Production (Render)
Render provides persistent disk storage. The SQLite database will be stored in:
```
/opt/render/project/src/backend/instance/portfolio.db
```

### For Production (PostgreSQL - Recommended)
For better performance, consider using PostgreSQL:

1. In Render, create a PostgreSQL database
2. Update `DATABASE_URL` environment variable:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
3. Update `backend/config.py` to use PostgreSQL

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is deployed and accessible
- [ ] Frontend can connect to backend API
- [ ] Admin dashboard is accessible
- [ ] Database is initialized
- [ ] Environment variables are set
- [ ] GitHub Actions workflows are working
- [ ] PR checks are passing

## Troubleshooting

### Backend not starting
- Check Render logs
- Verify environment variables
- Check database path

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend is running

### GitHub Actions failing
- Check workflow logs
- Verify secrets are set correctly
- Check file paths in workflows

