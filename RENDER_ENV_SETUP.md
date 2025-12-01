# Render Environment Variable Setup for Supabase

## ⚠️ IMPORTANT: Use Session Pooler (Not Direct Connection)

Render free tier uses **IPv4 network**, so you **MUST use Session Pooler** connection, not Direct connection.

## Get Session Pooler Connection String

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click **Settings** (gear icon) → **Database**

2. **Get Session Pooler Connection String**
   - Scroll to **"Connection string"** section
   - Select **"URI"** tab
   - Under **"Connection pooling"**, select **"Session"** (NOT "Direct")
   - Copy the connection string

3. **It should look like this:**
   ```
   postgresql://postgres.yqmhscbgywfodifkjzku:JpmacMBYfYQcCz1Y@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
   ```

   **Key points:**
   - Port: **6543** (not 5432)
   - Host: **`.pooler.supabase.com`** (not `.supabase.co`)
   - Username: **`postgres.yqmhscbgywfodifkjzku`** (includes project ref)

## For Render Environment Variable

**Use your Session Pooler connection string (port 6543, pooler hostname)**

**Example format:**
```
postgresql://postgres.yqmhscbgywfodifkjzku:JpmacMBYfYQcCz1Y@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
```

**Note:** The code will automatically add `?sslmode=require` to your connection string, so you don't need to add it manually.

## Steps to Add in Render

1. **Go to Render Dashboard**
   - Navigate to your backend service

2. **Open Environment Tab**
   - Click on your service
   - Go to **"Environment"** tab in the left sidebar

3. **Add/Update DATABASE_URL**
   - Scroll to **"Environment Variables"** section
   - Find `DATABASE_URL` or click **"Add Environment Variable"**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:JpmacMBYfYQcCz1Y@db.yqmhscbgywfodifkjzku.supabase.co:5432/postgres`
   - **IMPORTANT:** 
     - No spaces before or after the `=`
     - No quotes around the value
     - Copy exactly as shown above

4. **Save Changes**
   - Click **"Save Changes"** button
   - Render will automatically redeploy your service

## Important Notes

✅ **What's Correct for Session Pooler:**
- Protocol: `postgresql://` (not `postgres://`)
- Host: `aws-0-region.pooler.supabase.com` (Session Pooler - works with IPv4)
- Port: `6543` (Session Pooler port)
- Username: `postgres.yqmhscbgywfodifkjzku` (includes project reference)
- Database: `postgres`

❌ **Don't use Direct Connection:**
- Direct connection uses IPv6 which doesn't work on Render free tier
- Use Session Pooler instead

✅ **The code will automatically:**
- Add SSL requirement (`?sslmode=require`)
- Handle the connection properly

⚠️ **Before Setting Up:**
1. Make sure your Supabase project is **ACTIVE** (not paused)
2. Go to Supabase dashboard and check project status
3. If paused, click "Restore" and wait 1-2 minutes

## Verify Connection String

After saving, check Render logs. You should see:
- ✅ `Database connection successful!` 
- ✅ `Database tables created/verified successfully`

If you see errors, check:
1. Supabase project is active (not paused)
2. Connection string has no extra spaces
3. Password is correct

## Security Note

⚠️ **Never commit this connection string to Git!**
- It contains your database password
- Keep it only in Render environment variables
- The `.env` file is in `.gitignore` for local development
