# Fix: Supabase "Duplicate SASL Authentication Request" Error

This error occurs when using Supabase's connection pooler (port 6543) with SQLAlchemy. Here's how to fix it:

## Solution: Use Direct Connection Instead of Pooler

### Step 1: Get Direct Connection String from Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll to **"Connection string"** section
4. Click on **"Connection pooling"** tab
5. Select **"Direct connection"** (NOT "Transaction" or "Session" pooling)
6. Select **"URI"** format
7. Copy the connection string - it should look like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].supabase.co:5432/postgres
   ```
   Note: It uses port **5432** (not 6543) and ends with **`.supabase.co`** (not `.pooler.supabase.com`)

### Step 2: Update Render Environment Variable

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Find the `DATABASE_URL` variable
5. Replace it with the **direct connection string** from Step 1
6. Click **"Save Changes"**
7. Wait for Render to redeploy

### Alternative: If You Want to Use Pooler Connection

If you prefer to use the pooler connection, you need to add SSL parameters:

1. Take your pooler connection string from Supabase
2. Add `?sslmode=require` at the end:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
   ```
3. Update the `DATABASE_URL` in Render with this modified string

## Why This Error Occurs

The "duplicate SASL authentication request" error happens because:
- Supabase's connection pooler can conflict with SQLAlchemy's connection handling
- The pooler expects certain authentication flow that SQLAlchemy doesn't follow by default
- Direct connections are more reliable for persistent applications like Render services

## Recommended Configuration

For Render deployments, use:
- **Direct Connection** (port 5432) - Recommended ✅
- **Pooler Connection** (port 6543) - Can cause issues with SQLAlchemy ❌

## Verify the Fix

After updating the connection string:

1. Check Render logs - should see successful connection
2. Test your API: `https://your-service.onrender.com/api/health`
3. Should return: `{"status":"healthy"}`

If you still see errors, check:
- Connection string format is correct
- No extra spaces in the environment variable
- Password is correctly URL-encoded (if it contains special characters)
- SSL mode is properly set

