# 🔧 Quick Fix: Frontend-Backend Connection

## Issues Found

1. ✅ **Backend is working** - Password `Chet@786` works
2. ❌ **Frontend API URL not set** - Needs environment variable in Vercel
3. ❌ **CORS not configured** - Backend needs to allow Vercel domain

## Fix Steps

### 1. Add Frontend Environment Variable (Vercel)

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Add:**
- **Name:** `REACT_APP_API_URL`
- **Value:** `https://my-portfolio-os52.onrender.com/api`
- **Environments:** Production, Preview, Development

**Then:** Redeploy your frontend (Deployments → ⋯ → Redeploy)

---

### 2. Update Backend CORS (Render)

**Go to:** https://dashboard.render.com → portfolio-backend → Environment

**Update `CORS_ORIGINS` to:**
```
https://my-portfolio-three-psi-82.vercel.app,http://localhost:3000,http://localhost:5173
```

**Then:** Save changes (auto-redeploys)

---

### 3. Admin Login Credentials

✅ **Username:** `admin`  
✅ **Password:** `Chet@786`

---

## After Fixes

1. ✅ Frontend will load data from backend
2. ✅ Admin dashboard will work at `/admin`
3. ✅ All API calls will succeed

## Test

After both fixes:
- Visit: https://my-portfolio-three-psi-82.vercel.app
- Should see portfolio content
- Visit: https://my-portfolio-three-psi-82.vercel.app/admin
- Login with: `admin` / `Chet@786`

