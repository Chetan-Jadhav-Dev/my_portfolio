# 🚀 Vercel Environment Variables Setup

## Required Environment Variable

Your frontend needs to know where your backend API is located.

### Step 1: Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Click on your project: **my-portfolio-three-psi-82**
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variable

Click **Add New** and add:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `REACT_APP_API_URL` | `https://my-portfolio-os52.onrender.com/api` | Production, Preview, Development |

**Important:** 
- ✅ Add it to **all environments** (Production, Preview, Development)
- ✅ The value should be: `https://my-portfolio-os52.onrender.com/api` (no trailing slash)
- ✅ After adding, **redeploy** your frontend

### Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger auto-deploy

## Verification

After redeployment, your frontend should:
- ✅ Load data from backend
- ✅ Display projects, skills, about section
- ✅ Allow admin login at `/admin`

## Troubleshooting

### Still not working?
1. Check browser console (F12) for errors
2. Verify the environment variable is set correctly
3. Make sure you redeployed after adding the variable
4. Check that backend is accessible: `https://my-portfolio-os52.onrender.com/api/health`

### Need to update backend URL?
Just change the `REACT_APP_API_URL` value in Vercel and redeploy.

