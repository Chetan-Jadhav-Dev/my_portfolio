# 🔧 Database Persistence Fix

## Problem

The database is being re-initialized on every deployment, overwriting your data with sample data.

## Root Cause

On Render's **free tier**, the filesystem is **ephemeral** - meaning:
- Database files are deleted when the service restarts
- Database files are deleted on every deployment
- Your data doesn't persist between deployments

## Solutions

### Option 1: Disable Auto-Initialization (Recommended for Production)

**Add this environment variable in Render:**

1. Go to Render Dashboard → Your Service → Environment
2. Add new environment variable:
   - **Key:** `AUTO_INIT_DB`
   - **Value:** `false`
3. Save and redeploy

This will **completely disable** automatic database initialization. You'll need to:
- Manually add your data through the admin dashboard
- Or use a database migration script
- Or use an external database

### Option 2: Use Persistent Database (Best for Production)

**Upgrade to Render's paid tier** to get:
- Persistent disk storage
- Database files that survive restarts
- Better reliability

**Or use an external database:**
- PostgreSQL (Render, Railway, Supabase)
- MySQL
- MongoDB

### Option 3: Use Database Backups

Before each deployment:
1. Export your database
2. Store it in a safe place
3. Restore after deployment

## Current Behavior

With the improved check:
- ✅ Checks ALL tables before initializing
- ✅ Only initializes if ALL tables are empty
- ✅ Logs what it finds
- ✅ Can be disabled with `AUTO_INIT_DB=false`

## Environment Variable

```bash
# Disable auto-initialization
AUTO_INIT_DB=false

# Enable auto-initialization (default)
AUTO_INIT_DB=true
```

## Why This Happens

Render's free tier uses **ephemeral storage**:
- Files are stored in memory/temporary disk
- Lost on service restart
- Lost on deployment
- This is a limitation of free hosting

## Recommended Solution

**For production, use one of these:**

1. **Render Paid Tier** - Get persistent disk
2. **External PostgreSQL** - Free tier available on:
   - Supabase (free tier)
   - Railway (free tier)
   - Neon (free tier)
3. **Disable Auto-Init** - Set `AUTO_INIT_DB=false` and manage data manually

## Quick Fix

**To prevent data loss immediately:**

1. Go to Render Dashboard
2. Add environment variable: `AUTO_INIT_DB=false`
3. Save and redeploy
4. Your database will no longer be auto-initialized

**Then manually add your data:**
- Use the admin dashboard to add projects, skills, etc.
- Or export/import your database

## Database File Location

The database is stored at:
```
backend/instance/portfolio.db
```

On Render free tier, this file is **ephemeral** and gets deleted on restart.

