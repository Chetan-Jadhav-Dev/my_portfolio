#!/bin/bash

# Script to push Portfolio to GitHub
# Usage: ./push_to_github.sh <your-github-username> <repository-name>

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./push_to_github.sh <github-username> <repository-name>"
    echo "Example: ./push_to_github.sh johndoe portfolio-website"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🚀 Setting up GitHub repository..."
echo "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
else
    echo "➕ Adding remote repository..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "📝 Renaming branch to 'main'..."
    git branch -M main
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📦 Staging all changes..."
    git add -A
    
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Portfolio website with admin dashboard, blog, analytics, and CI/CD"
fi

echo "📤 Pushing to GitHub..."
echo ""
echo "⚠️  Make sure you've created the repository on GitHub first!"
echo "   Go to: https://github.com/new"
echo "   Repository name: $REPO_NAME"
echo "   DO NOT initialize with README, .gitignore, or license"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Set up GitHub Secrets (see SETUP_GITHUB.md)"
    echo "2. Deploy backend to Render (see DEPLOYMENT_SETUP.md)"
    echo "3. Deploy frontend to Vercel (see DEPLOYMENT_SETUP.md)"
else
    echo ""
    echo "❌ Failed to push. Make sure:"
    echo "   1. Repository exists on GitHub"
    echo "   2. You have push access"
    echo "   3. You're authenticated (use GitHub CLI or SSH keys)"
fi

