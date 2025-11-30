# 🔧 Update Render CORS Settings

## Current Issue

Your backend needs to allow requests from your Vercel frontend domain.

## Step 1: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Click on **portfolio-backend** service
3. Go to **Environment** tab

## Step 2: Update CORS_ORIGINS

Find the `CORS_ORIGINS` environment variable and update it to:

```
https://my-portfolio-three-psi-82.vercel.app,http://localhost:3000,http://localhost:5173
```

**Or if you want to allow all Vercel previews:**

```
https://my-portfolio-three-psi-82.vercel.app,https://*.vercel.app,http://localhost:3000,http://localhost:5173
```

## Step 3: Save and Redeploy

1. Click **Save Changes**
2. Render will automatically redeploy
3. Wait 2-3 minutes for deployment

## Verification

After deployment, test CORS:
```bash
curl -H "Origin: https://my-portfolio-three-psi-82.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://my-portfolio-os52.onrender.com/api/about
```

Should return CORS headers without errors.

## Current Admin Credentials

✅ **Username:** `admin`  
✅ **Password:** `Chet@786`

(Your backend is already configured with this password)

