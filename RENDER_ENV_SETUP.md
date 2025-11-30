# 🔐 Render Environment Variables Setup

## Generated Secrets

Your `.env` file has been created with secure random strings. Here's how to add them to Render:

## Step 1: Get Your Generated Secrets

Your `.env` file in `backend/.env` contains:
- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT token secret

**⚠️ Important**: The `.env` file is in `.gitignore` and won't be pushed to GitHub. You need to manually copy these values to Render.

## Step 2: View Your Secrets

To see your generated secrets, run:
```bash
cd backend
cat .env | grep -E "SECRET_KEY|JWT_SECRET_KEY"
```

Or open `backend/.env` in your editor.

## Step 3: Add to Render

1. Go to **Render Dashboard** → Your Service → **Environment**
2. Click **Add Environment Variable** for each:

### Required Variables:

1. **SECRET_KEY**
   - Copy from `backend/.env`
   - Value: `your-generated-secret-key`

2. **JWT_SECRET_KEY**
   - Copy from `backend/.env`
   - Value: `your-generated-jwt-secret-key`

3. **FLASK_ENV**
   - Value: `production`

4. **ADMIN_USERNAME**
   - Value: `admin` (or your choice)

5. **ADMIN_PASSWORD**
   - Value: `your-secure-password` (change from default!)

6. **DATABASE_URL**
   - Value: `sqlite:///portfolio.db`

7. **PORT**
   - Value: `10000` (Render sets this automatically, but good to have)

8. **CORS_ORIGINS**
   - Value: `https://your-frontend.vercel.app` (update after frontend deployment)

### Optional Variables:

9. **MAIL_SERVER** (if using email)
   - Value: `smtp.gmail.com`

10. **MAIL_PORT**
    - Value: `587`

11. **MAIL_USE_TLS**
    - Value: `True`

12. **MAIL_USERNAME**
    - Value: `your-email@gmail.com`

13. **MAIL_PASSWORD**
    - Value: `your-gmail-app-password`

14. **MAIL_DEFAULT_SENDER**
    - Value: `your-email@gmail.com`

15. **ADMIN_EMAIL**
    - Value: `your-email@gmail.com`

16. **GITHUB_TOKEN** (if using GitHub integration)
    - Value: `your-github-personal-access-token`

## Quick Copy Script

Run this to display your secrets for easy copying:

```bash
cd backend
echo "=== Copy these to Render ==="
echo ""
grep "SECRET_KEY" .env
grep "JWT_SECRET_KEY" .env
echo ""
echo "=== End ==="
```

## Security Notes

- ✅ `.env` is in `.gitignore` - won't be committed
- ✅ Secrets are generated using `secrets.token_urlsafe(32)` - cryptographically secure
- ⚠️ Never commit `.env` to GitHub
- ⚠️ Change `ADMIN_PASSWORD` from default
- ⚠️ Keep secrets private

## After Adding to Render

1. Save all environment variables
2. Render will automatically redeploy
3. Check logs to verify database initialization
4. Test your API: `https://your-backend.onrender.com/api/health`

## Troubleshooting

### Secrets not working?
- Verify you copied the entire string (no spaces, no quotes)
- Check for typos
- Ensure variable names match exactly (case-sensitive)

### Need to regenerate?
```bash
cd backend
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

