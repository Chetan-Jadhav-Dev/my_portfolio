# ⚡ Quick Render Environment Variables Setup

## Your Generated Secrets

Your `.env` file has been created with secure random strings. Here are your secrets:

```
SECRET_KEY=mQBH0yBUoCH1lfldofkaTVm5GDTnhbcSsgpWKacOdvo
JWT_SECRET_KEY=_ak0UOiIagNJ8q8oV51qIyRDOqCgKdGXXOaBLrshg_E
```

## 📋 Add to Render (Step-by-Step)

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your **portfolio-backend** service
3. Go to **Environment** tab (left sidebar)

### Step 2: Add Each Variable

Click **Add Environment Variable** and add these one by one:

#### 🔐 Required Secrets:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `SECRET_KEY` | `mQBH0yBUoCH1lfldofkaTVm5GDTnhbcSsgpWKacOdvo` | Copy from above |
| `JWT_SECRET_KEY` | `_ak0UOiIagNJ8q8oV51qIyRDOqCgKdGXXOaBLrshg_E` | Copy from above |
| `FLASK_ENV` | `production` | |
| `ADMIN_USERNAME` | `admin` | Or your choice |
| `ADMIN_PASSWORD` | `your-secure-password` | ⚠️ Change from default! |
| `DATABASE_URL` | `sqlite:///portfolio.db` | |
| `PORT` | `10000` | Render may set this automatically |

#### 🌐 After Frontend Deployment:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `CORS_ORIGINS` | `https://your-frontend.vercel.app` | Update with your actual frontend URL |

#### 📧 Optional (Email):

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MAIL_SERVER` | `smtp.gmail.com` | |
| `MAIL_PORT` | `587` | |
| `MAIL_USE_TLS` | `True` | |
| `MAIL_USERNAME` | `your-email@gmail.com` | Your Gmail |
| `MAIL_PASSWORD` | `your-app-password` | Gmail App Password |
| `MAIL_DEFAULT_SENDER` | `your-email@gmail.com` | |
| `ADMIN_EMAIL` | `your-email@gmail.com` | |

#### 🐙 Optional (GitHub):

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `GITHUB_TOKEN` | `your-token` | GitHub Personal Access Token |

### Step 3: Save and Redeploy

1. After adding all variables, click **Save Changes**
2. Render will automatically redeploy
3. Wait 5-10 minutes for deployment
4. Check **Logs** tab for: `✅ Database initialized successfully`

## 🔍 View Your Secrets Again

To see your secrets again:
```bash
cd backend
cat .env | grep -E "SECRET_KEY|JWT_SECRET_KEY"
```

## ✅ Verification

After deployment, test:
```bash
curl https://your-backend.onrender.com/api/health
```

Should return: `{"status":"healthy"}`

## 🆘 Troubleshooting

### Variables not working?
- ✅ Check for typos (case-sensitive)
- ✅ No quotes around values
- ✅ No extra spaces
- ✅ Copy entire string

### Need new secrets?
```bash
cd backend
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

