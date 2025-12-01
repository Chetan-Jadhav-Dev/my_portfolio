# Supabase Connection Troubleshooting: "Network is unreachable" Error

If you're seeing "Network is unreachable" or connection errors when deploying to Render, follow these steps:

## Quick Fix Checklist

### 1. Check if Your Supabase Project is Active

**Free tier projects pause after 1 week of inactivity!**

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Check your project status
3. If it says "Paused", click **"Restore"** or **"Resume"** to wake it up
4. Wait 1-2 minutes for the database to fully wake up

### 2. Verify Your Connection String Format

Your `DATABASE_URL` in Render should look like this:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**Important points:**
- Must start with `postgresql://` (not `postgres://`)
- Host should be `db.xxx.supabase.co` (direct connection)
- Port should be `5432` (not 6543)
- Should include `?sslmode=require` at the end

### 3. Get the Correct Connection String from Supabase

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) → **Database**
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Under **"Connection pooling"**, select **"Direct connection"**
6. Copy the connection string (it should use port 5432)
7. Make sure to replace `[YOUR-PASSWORD]` with your actual database password

### 4. Update Render Environment Variable

1. Go to Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Find `DATABASE_URL` variable
5. Update with the direct connection string from Supabase
6. Make sure:
   - No extra spaces
   - Password is URL-encoded (if it contains special characters)
   - Connection string is on a single line
7. Click **"Save Changes"**
8. Wait for redeploy

### 5. Special Characters in Password

If your database password contains special characters, they need to be URL-encoded:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`
- `+` becomes `%2B`
- `=` becomes `%3D`
- `/` becomes `%2F`
- `?` becomes `%3F`
- Space becomes `%20` or `+`

**Example:**
- Password: `MyP@ssw0rd#123`
- URL-encoded: `MyP%40ssw0rd%23123`

### 6. Test Connection String Locally (Optional)

You can test your connection string locally:

```bash
# Using psql (if installed)
psql "postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres?sslmode=require"

# Or using Python
python3 -c "
from sqlalchemy import create_engine
import os
url = os.environ['DATABASE_URL']
engine = create_engine(url)
conn = engine.connect()
print('✅ Connection successful!')
conn.close()
"
```

## Common Issues and Solutions

### Issue: "Network is unreachable"

**Causes:**
- Database is paused (most common on free tier)
- Wrong hostname in connection string
- Firewall/network blocking connection

**Solution:**
1. Wake up your Supabase project
2. Verify connection string uses direct connection (`db.xxx.supabase.co:5432`)
3. Check Supabase project status in dashboard

### Issue: "Connection refused"

**Causes:**
- Database is paused
- Wrong port number
- Database doesn't exist

**Solution:**
1. Check Supabase project is active
2. Verify port is 5432 (not 6543)
3. Verify database name is `postgres`

### Issue: "Password authentication failed"

**Causes:**
- Wrong password
- Password not URL-encoded
- Password contains unencoded special characters

**Solution:**
1. Verify password in Supabase dashboard
2. URL-encode special characters
3. Make sure password matches exactly

### Issue: "SSL connection required"

**Causes:**
- Missing SSL parameter in connection string

**Solution:**
- Add `?sslmode=require` to end of connection string
- The code should do this automatically, but verify

## Step-by-Step: Setting Up Direct Connection

1. **Get Direct Connection String:**
   ```
   Supabase Dashboard → Settings → Database → Connection string → URI → Direct connection
   ```

2. **Format Should Be:**
   ```
   postgresql://postgres.xxxxx:your-password@db.xxxxx.supabase.co:5432/postgres
   ```

3. **Add SSL Parameter:**
   ```
   postgresql://postgres.xxxxx:your-password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
   ```

4. **Update in Render:**
   - Environment → `DATABASE_URL` → Paste connection string
   - Save and redeploy

## Verify Connection Works

After updating, check Render logs for:

✅ **Success messages:**
- `✅ Database connection successful!`
- `✅ Database tables created/verified successfully`

❌ **Error messages:**
- `⚠️ WARNING: Database connection failed during startup`
- Connection errors

## Still Having Issues?

1. **Double-check connection string format** - One typo breaks everything
2. **Verify Supabase project is active** - Free tier pauses after inactivity
3. **Check Render logs** - Look for specific error messages
4. **Test connection string locally** - Use psql or Python to test
5. **Contact Supabase support** - If project won't wake up or other issues

## Pro Tips

- **Always use direct connection** for Render deployments (port 5432)
- **Keep your project active** - Make a request to your API every few days to prevent pausing
- **Use strong passwords** - But remember to URL-encode special characters
- **Save connection string securely** - Don't commit it to Git

---

**Remember:** The app will now start even if the database connection fails initially. Check the logs for specific error messages to diagnose the issue.

