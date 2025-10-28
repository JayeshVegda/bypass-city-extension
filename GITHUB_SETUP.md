# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `bypass-city-extension`
3. Description: "Chrome extension for bypass.city - Instantly bypass link shorteners and ad link services"
4. Make it **Public** (recommended) or Private
5. **DO NOT** check any boxes (README, .gitignore, license) - we already have them
6. Click "Create repository"

## Step 2: Connect and Push

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/bypass-city-extension.git
git push -u origin main
```

Or if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/bypass-city-extension.git
git push -u origin main
```

## Step 3: Create Release

After pushing, create a GitHub Release:

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag: `v1.1.0`
4. Title: `v1.1.0 - Initial Release`
5. Description: Copy from `CHANGELOG.md`
6. Click "Publish release"

## Done! 🎉

Your extension is now public on GitHub!

Repository URL: `https://github.com/YOUR_USERNAME/bypass-city-extension`

