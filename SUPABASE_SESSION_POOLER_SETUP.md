# Supabase Session Pooler Setup for Render (IPv4 Networks)

Since Render free tier uses IPv4 network, you need to use Supabase's **Session Pooler** connection instead of direct connection.

## Step 1: Get Session Pooler Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** (gear icon) → **Database**
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Under **"Connection pooling"**, select **"Session"** (NOT "Direct")
6. Copy the connection string - it should look like:
   ```
   postgresql://postgres.yqmhscbgywfodifkjzku:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
   ```
   - Uses port **6543** (Session Pooler)
   - Host ends with **`.pooler.supabase.com`**
   - This works with IPv4 networks!

## Step 2: Update Render Environment Variable

1. Go to Render dashboard → Your backend service
2. Navigate to **Environment** tab
3. Find or add `DATABASE_URL` variable
4. Paste your **Session Pooler** connection string
5. Make sure to replace `[YOUR-PASSWORD]` with your actual password
6. Click **"Save Changes"**

## Step 3: Your Connection String Format

Based on your project, it should be:

```
postgresql://postgres.yqmhscbgywfodifkjzku:JpmacMBYfYQcCz1Y@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
```

**Key differences from Direct Connection:**
- Port: `6543` (not 5432)
- Host: `aws-0-ap-southeast-2.pooler.supabase.com` (not `db.xxx.supabase.co`)
- Username: `postgres.yqmhscbgywfodifkjzku` (includes project ref)

## Step 4: Verify Connection

After updating, Render will redeploy. Check the logs:

✅ **Success:**
- `✅ Database tables created/verified successfully`
- No connection errors

❌ **If you still see errors:**
- Make sure you're using **Session** pooler (not Transaction or Direct)
- Verify the connection string format is correct
- Check Supabase project is active (not paused)

## Why Session Pooler?

- ✅ Works with IPv4 networks (Render free tier)
- ✅ Better for serverless/serverless-like deployments
- ✅ Handles connection pooling automatically
- ✅ Avoids IPv6 connectivity issues

## Important Notes

- **Always use Session Pooler** for Render free tier
- The code will automatically add SSL requirements
- Don't use Direct connection (port 5432) if you see IPv4/IPv6 errors
- Session Pooler connection string format is different from Direct connection

## Connection String Comparison

**Direct Connection (IPv6, doesn't work on Render free tier):**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

**Session Pooler (IPv4, works on Render free tier):** ✅
```
postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres
```

Use the **Session Pooler** connection string!

