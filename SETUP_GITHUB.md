# GitHub Repository Setup Guide

Follow these steps to push your code to GitHub and set up CI/CD.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `portfolio-website` (or your preferred name)
3. Description: "Modern portfolio website with admin dashboard and blog"
4. Visibility: Public (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/chetan/Desktop/Portfolio

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio website with admin dashboard, blog, and analytics"

# Rename branch to main (if needed)
git branch -M main

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git push -u origin main
```

## Step 3: Set Up GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   - **Name**: `RENDER_SERVICE_ID`
     - **Value**: (Get this after deploying to Render - see Step 4)
   
   - **Name**: `RENDER_API_KEY`
     - **Value**: (Get this from Render Account Settings → API Keys)
   
   - **Name**: `REACT_APP_API_URL`
     - **Value**: `https://your-backend-url.onrender.com/api`

## Step 4: Deploy Backend to Render

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Select your repository
6. Configure:
   - **Name**: `portfolio-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Plan**: Free

7. Add Environment Variables (click **Advanced**):
   ```
   FLASK_ENV=production
   SECRET_KEY=<generate-random-string>
   JWT_SECRET_KEY=<generate-random-string>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<your-secure-password>
   DATABASE_URL=sqlite:///portfolio.db
   PORT=10000
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_DEFAULT_SENDER=your-email@gmail.com
   ADMIN_EMAIL=your-email@gmail.com
   ```

8. Click **Create Web Service**
9. Wait for deployment (5-10 minutes)
10. Copy your service URL (e.g., `https://portfolio-backend.onrender.com`)
11. Go to Service Settings → Copy the **Service ID**
12. Add `RENDER_SERVICE_ID` to GitHub Secrets (Step 3)

## Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
7. Click **Deploy**
8. Wait for deployment
9. Update `CORS_ORIGINS` in Render with your Vercel URL

## Step 6: Verify CI/CD

1. Make a small change to any file
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test CI/CD"
   git push
   ```
3. Go to **Actions** tab in GitHub
4. You should see workflows running:
   - Backend CI (linting, tests)
   - Frontend CI (build check)
   - PR Checks (if you create a PR)

## Step 7: Test PR Checks

1. Create a new branch:
   ```bash
   git checkout -b test-pr
   ```
2. Make a small change
3. Commit and push:
   ```bash
   git add .
   git commit -m "Test PR checks"
   git push -u origin test-pr
   ```
4. Go to GitHub → Create Pull Request
5. PR checks should run automatically

## Troubleshooting

### GitHub Actions not running
- Check if workflows are in `.github/workflows/` directory
- Verify YAML syntax is correct
- Check Actions tab for error messages

### Render deployment fails
- Check Render logs
- Verify environment variables are set
- Ensure `requirements.txt` is correct

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running

## Next Steps

- [ ] Repository created and code pushed
- [ ] GitHub Secrets configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CI/CD workflows working
- [ ] PR checks passing

## Security Notes

⚠️ **Important**: 
- Change default admin credentials in production
- Use strong, randomly generated secrets
- Never commit `.env` files
- Review GitHub Actions permissions

