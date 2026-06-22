@echo off
title SGN Auto Sync & Deploy
echo ========================================
echo   SGN Auto Sync & Deploy Script
echo ========================================
echo.

echo [1/4] Pulling latest updates from GitHub...
git pull origin main
echo.

echo [2/4] Adding all local changes...
git add .
echo.

echo [3/4] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=auto: sync latest updates from local
git commit -m "%commit_msg%"
echo.

echo [4/4] Pushing to GitHub (Vercel will auto-deploy)...
git push origin main
echo.

echo ========================================
echo Done! Vercel is now building the live site.
echo Check your Vercel dashboard for deployment status.
echo ========================================
pause
