# Quick Supabase Connection Setup for Render

## ✅ Use Session Pooler Connection String

Since Render free tier uses IPv4, you **MUST** use Supabase **Session Pooler**, not Direct connection.

## Step 1: Get Session Pooler Connection String

1. Go to Supabase Dashboard → Your Project
2. Settings → Database
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Under **"Connection pooling"**, select **"Session"** (NOT Direct)
6. Copy the connection string

## Step 2: Format for Render

Your connection string should look like:
```
postgresql://postgres.yqmhscbgywfodifkjzku:JpmacMBYfYQcCz1Y@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
```

**Key points:**
- ✅ Port: **6543** (Session Pooler)
- ✅ Host: **`.pooler.supabase.com`** (not `.supabase.co`)
- ✅ Username: **`postgres.yqmhscbgywfodifkjzku`** (includes project ref)
- ✅ Works with IPv4 networks (Render free tier)

## Step 3: Add to Render

1. Render Dashboard → Your Service → **Environment** tab
2. Add/Update `DATABASE_URL` variable
3. Paste your **Session Pooler** connection string
4. Save and redeploy

## What Changed in Code

- ✅ Switched to **psycopg3** (better pgBouncer support)
- ✅ Automatically uses `postgresql+psycopg://` driver for pooler connections
- ✅ Removes invalid parameters from connection string
- ✅ Adds SSL requirement automatically

## Important Notes

- ⚠️ **Don't use Direct connection** (port 5432) - requires IPv6
- ✅ **Use Session Pooler** (port 6543) - works with IPv4
- ✅ Connection string will be automatically optimized by the code

## After Deploying

Check Render logs - you should see:
- ✅ `Database connection successful!`
- ✅ `Database tables created/verified successfully`

If you see errors, make sure:
1. Supabase project is **active** (not paused)
2. Using **Session Pooler** connection string
3. Connection string has no extra spaces

