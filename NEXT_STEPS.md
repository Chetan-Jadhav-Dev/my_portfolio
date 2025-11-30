# 🚀 Next Steps After GitHub Push

Great! Your code is now on GitHub. Follow these steps to complete the setup.

## ✅ Step 1: Verify GitHub Repository

1. Go to your GitHub repository
2. Check that all files are there
3. Go to **Actions** tab - you should see workflows (they may show as "skipped" until secrets are configured)

## 🔐 Step 2: Set Up GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Click **New repository secret** and add:

### Required Secrets:

1. **RENDER_API_KEY**
   - Get it from: https://dashboard.render.com → Account Settings → API Keys
   - Create a new API key if you don't have one
   - Copy and paste it here

2. **REACT_APP_API_URL**
   - This will be your backend URL after deployment
   - For now, use: `https://your-backend-name.onrender.com/api`
   - You'll update this after deploying backend

3. **RENDER_SERVICE_ID** (Add after Step 3)
   - Get this from Render dashboard after creating the service
   - Go to your service → Settings → Copy Service ID

## 🌐 Step 3: Deploy Backend to Render (Free)

### 3.1 Create Render Account
1. Go to https://render.com
2. Click **Get Started for Free**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### 3.2 Create Web Service
1. Click **New +** → **Web Service**
2. Click **Connect account** if prompted
3. Select your GitHub repository
4. Click **Connect**

### 3.3 Configure Service
Render should auto-detect `render.yaml`, but verify these settings:

- **Name**: `portfolio-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Plan**: **Free**

### 3.4 Add Environment Variables
Click **Advanced** → **Add Environment Variable** and add:

```
FLASK_ENV=production
SECRET_KEY=<generate-random-string-here>
JWT_SECRET_KEY=<generate-another-random-string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-password>
DATABASE_URL=sqlite:///portfolio.db
PORT=10000
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

**Generate random strings:**
```bash
# Run this in terminal to generate secure keys:
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Email Configuration (Optional but recommended):**
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
ADMIN_EMAIL=your-email@gmail.com
```

**Note**: For Gmail, you need to create an "App Password":
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create password for "Mail"

### 3.5 Deploy
1. Click **Create Web Service**
2. Wait 5-10 minutes for first deployment
3. Copy your service URL (e.g., `https://portfolio-backend.onrender.com`)

### 3.6 Get Service ID
1. Go to your service dashboard
2. Click **Settings**
3. Scroll down to find **Service ID**
4. Copy it
5. Add to GitHub Secrets as `RENDER_SERVICE_ID`

### 3.7 Initialize Database
After deployment, your database needs to be initialized. You can:

**Option A: Use Render Shell**
1. Go to your service → **Shell**
2. Run:
   ```bash
   cd backend
   python init_db.py
   ```

**Option B: Add to startup (temporary)**
Modify `app.py` temporarily to auto-initialize, then remove it.

## 🎨 Step 4: Deploy Frontend to Vercel (Free)

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Click **Sign Up**
3. Sign up with **GitHub**
4. Authorize Vercel

### 4.2 Import Project
1. Click **Add New** → **Project**
2. Find your repository
3. Click **Import**

### 4.3 Configure Project
- **Framework Preset**: Create React App
- **Root Directory**: `frontend` (click **Edit** to set this)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `build` (should auto-detect)

### 4.4 Add Environment Variable
Click **Environment Variables** → **Add**:
- **Name**: `REACT_APP_API_URL`
- **Value**: `https://your-backend-name.onrender.com/api`
  (Replace with your actual Render backend URL)

### 4.5 Deploy
1. Click **Deploy**
2. Wait 2-3 minutes
3. Copy your frontend URL (e.g., `https://portfolio-website.vercel.app`)

### 4.6 Update CORS
1. Go back to Render dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.vercel.app
   ```
3. Redeploy backend (or it will auto-redeploy)

## ✅ Step 5: Verify Everything Works

### 5.1 Test Backend
```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Should return: {"status":"healthy"}
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Check browser console for errors
3. Try accessing admin dashboard: `https://your-frontend.vercel.app/admin`
4. Login with admin credentials

### 5.3 Test GitHub Actions
1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see workflows running
4. Make a small change and push to test:
   ```bash
   git checkout -b test-ci
   # Make a small change
   git add .
   git commit -m "Test CI/CD"
   git push -u origin test-ci
   ```
5. Create a Pull Request
6. Check that PR checks run

## 🔧 Troubleshooting

### Backend not starting
- Check Render logs
- Verify all environment variables are set
- Check database path

### Frontend can't connect
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

### GitHub Actions failing
- Check workflow logs
- Verify secrets are set correctly
- Check file paths in workflows

### Database not initialized
- Use Render Shell to run `init_db.py`
- Or add initialization to startup temporarily

## 📋 Checklist

- [ ] GitHub repository created and code pushed
- [ ] GitHub Secrets configured (RENDER_API_KEY, REACT_APP_API_URL)
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] RENDER_SERVICE_ID added to GitHub Secrets
- [ ] Database initialized on Render
- [ ] Frontend deployed to Vercel
- [ ] REACT_APP_API_URL set in Vercel
- [ ] CORS_ORIGINS updated in Render
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] Admin dashboard accessible
- [ ] GitHub Actions workflows running

## 🎉 You're Done!

Your portfolio is now:
- ✅ On GitHub
- ✅ Deployed to free hosting
- ✅ Running CI/CD
- ✅ Automatically deploying on changes

## 📚 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: `https://github.com/YOUR_USERNAME/REPO_NAME/actions`
- **Render Logs**: Service → Logs tab
- **Vercel Logs**: Project → Deployments → Click deployment → View Function Logs

## 🔄 Future Updates

When you push to `main` branch:
1. GitHub Actions run automatically
2. Backend auto-deploys to Render (if secrets configured)
3. Frontend auto-deploys to Vercel

No manual deployment needed! 🚀

