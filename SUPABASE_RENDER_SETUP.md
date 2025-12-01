# Supabase Database Setup for Render Deployment

This guide will walk you through setting up Supabase PostgreSQL database and connecting it to your Render backend service.

## Step 1: Create a Supabase Project

1. **Sign up/Login to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account (if you don't have one)
   - Login to your dashboard

2. **Create a New Project**
   - Click the **"New Project"** button
   - Fill in the project details:
     - **Name**: `portfolio-backend` (or your preferred name)
     - **Database Password**: Create a strong password (⚠️ **Save this password!** You'll need it)
     - **Region**: Choose the closest region to your users
     - **Pricing Plan**: Select "Free" plan (sufficient for most portfolios)
   - Click **"Create new project"**
   - Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your Database Connection String

1. **Navigate to Database Settings**
   - In your Supabase project dashboard, go to **Settings** (gear icon) → **Database**

2. **Find Connection String**
   - Scroll down to **"Connection string"** section
   - Select **"URI"** tab
   - You'll see a connection string that looks like:
     ```
     postgresql://postgres.[project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - **Copy this entire string** (you'll need it in the next step)

3. **Alternative: Get Individual Connection Details**
   - If you prefer to construct it manually, you can find:
     - **Host**: Under "Connection pooling" or "Connection parameters"
     - **Port**: Usually `5432` (direct) or `6543` (pooler)
     - **Database**: `postgres`
     - **User**: `postgres.[project-ref]`
     - **Password**: The password you set during project creation

## Step 3: Set Up Database Tables in Supabase

### Option A: Automatic Migration (Recommended)

Your Flask app will automatically create tables on first run if they don't exist. However, you may need to create the `CommentLike` table manually if it wasn't created yet.

1. **Go to SQL Editor**
   - In Supabase dashboard, click **SQL Editor** in the left sidebar
   - Click **"New query"**

2. **Run this SQL to create CommentLike table** (if needed):
   ```sql
   CREATE TABLE IF NOT EXISTS comment_like (
       id SERIAL PRIMARY KEY,
       comment_id INTEGER NOT NULL,
       user_ip VARCHAR(100),
       user_agent VARCHAR(500),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE
   );

   CREATE INDEX IF NOT EXISTS idx_comment_like_comment_id ON comment_like(comment_id);
   CREATE INDEX IF NOT EXISTS idx_comment_like_user_ip ON comment_like(user_ip);
   ```

3. **Click "Run"** to execute the query

### Option B: Let Flask Auto-Create Tables

- The Flask app automatically creates tables using SQLAlchemy when it starts
- Make sure your `app.py` has `db.create_all()` which is already included
- Tables will be created automatically on first deployment

## Step 4: Configure Render Environment Variables

1. **Go to Your Render Dashboard**
   - Login to [https://dashboard.render.com](https://dashboard.render.com)
   - Navigate to your backend service (or create a new one)

2. **Open Environment Variables**
   - Click on your backend service
   - Go to **"Environment"** tab in the left sidebar
   - Scroll down to **"Environment Variables"** section

3. **Add/Update These Variables**:

   ```
   DATABASE_URL=postgresql://postgres.[project-ref]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

   **Important Notes:**
   - Replace `[project-ref]`, `[your-password]`, and `[region]` with your actual values from Supabase
   - If the connection string from Supabase starts with `postgres://`, your backend will automatically convert it to `postgresql://` (already handled in `config.py`)
   - Make sure there are **NO spaces** before or after the `=` sign
   - Do **NOT** wrap the value in quotes

4. **Verify Other Environment Variables**:

   Make sure you also have these set:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here-generate-random-string
   JWT_SECRET_KEY=your-jwt-secret-key-here-generate-random-string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   PORT=10000
   CORS_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
   AUTO_INIT_DB=false
   ```

   **About AUTO_INIT_DB:**
   - Set to `false` to prevent database initialization on every deployment
   - Only set to `true` if you want to initialize with sample data (not recommended for production)

5. **Save Changes**
   - Click **"Save Changes"** button
   - Render will automatically restart your service with the new environment variables

## Step 5: Verify Database Connection

1. **Check Render Logs**
   - Go to your service → **"Logs"** tab
   - Look for any database connection errors
   - You should see successful connection messages

2. **Test Your API**
   - Go to your backend URL: `https://your-service.onrender.com/api/health`
   - Should return: `{"status":"healthy"}`

3. **Verify Tables Were Created**
   - Go back to Supabase dashboard → **Table Editor**
   - You should see tables like:
     - `project`
     - `about`
     - `skill`
     - `experience`
     - `blog`
     - `blog_like`
     - `blog_comments`
     - `comment_like`
     - etc.

## Step 6: Handle Database Migrations

If you already have data in your database and need to add the new `CommentLike` table:

1. **Check if table exists**:
   ```sql
   SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'comment_like'
   );
   ```

2. **If it doesn't exist, create it** (see Step 3, Option A)

## Troubleshooting

### Connection Issues

**Error: "connection refused" or "timeout"**
- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active (not paused)
- Free tier projects pause after 1 week of inactivity - you may need to wake it up

**Error: "password authentication failed"**
- Double-check your database password
- Make sure there are no extra spaces in the connection string
- Verify you're using the correct user format: `postgres.[project-ref]`

**Error: "database does not exist"**
- The database name should be `postgres` (not your project name)
- Verify the connection string format

### Table Creation Issues

**Tables not being created automatically:**
- Check Render logs for errors
- Make sure `db.create_all()` is being called in your `app.py`
- Verify your models are imported correctly
- You may need to manually run the SQL from Step 3

**Foreign key errors:**
- Make sure parent tables exist before creating child tables
- Check the order of table creation in your models

### Performance Issues

**Slow queries:**
- Consider using connection pooling (port 6543) instead of direct connection (port 5432)
- Supabase free tier has connection limits - optimize your queries
- Add indexes for frequently queried columns

## Additional Tips

1. **Backup Your Database**
   - Supabase free tier includes automatic backups
   - Go to Settings → Database → Backups to view/manage

2. **Monitor Usage**
   - Check your database usage in Supabase dashboard
   - Free tier limits:
     - 500 MB database size
     - 2 GB bandwidth
     - 2 million monthly active users

3. **Connection Pooling**
   - Use port `6543` for connection pooling (better for serverless)
   - Use port `5432` for direct connections (better for persistent connections)
   - Your connection string from Supabase should already use the pooler

4. **SSL Connection**
   - Supabase requires SSL connections
   - Your SQLAlchemy connection string should handle this automatically
   - If you see SSL errors, add `?sslmode=require` to your connection string

## Quick Reference: Environment Variables Template

Copy this template and fill in your values:

```bash
# Database
DATABASE_URL=postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Flask
FLASK_ENV=production
SECRET_KEY=generate-with-python-secrets-token_urlsafe-32
JWT_SECRET_KEY=generate-with-python-secrets-token_urlsafe-32
PORT=10000

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# CORS (update with your frontend URL)
CORS_ORIGINS=https://your-portfolio.vercel.app,http://localhost:3000

# Database Auto-Init (set to false for production)
AUTO_INIT_DB=false
```

## Security Best Practices

1. **Never commit passwords to Git**
   - All sensitive values should be in Render environment variables only
   - Use strong, randomly generated passwords

2. **Rotate secrets regularly**
   - Update `SECRET_KEY` and `JWT_SECRET_KEY` periodically
   - Change admin password regularly

3. **Use Supabase Row Level Security (RLS)**
   - For additional security, enable RLS in Supabase
   - Configure policies as needed for your use case

4. **Limit database access**
   - Only connect from your Render service
   - Use connection pooling to manage connections efficiently

## Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Render Docs**: [https://render.com/docs](https://render.com/docs)
- **SQLAlchemy Docs**: [https://docs.sqlalchemy.org](https://docs.sqlalchemy.org)

---

**Last Updated**: Based on current codebase with Supabase PostgreSQL support

