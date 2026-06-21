@echo off
cd /d "%~dp0..\.."
echo ==============================================
echo   Deploying SGN to Vercel Staging & Pushing Git
echo ==============================================
echo.
echo 1. Staging, committing, and pushing SGN changes...
call git add .
call git commit -m "chore: updates to footer and layout"
call git push origin main
echo.
echo 2. Syncing and pushing parent repository...
cd ..
call git add .
call git commit -m "auto: sync SGN updates to parent repository"
call git push origin main
cd SGN
echo.
echo 3. Deploying to Vercel...
call vercel --prod
echo.
echo Done! Please check https://sgn-msalimaziza-3522s-projects.vercel.app to view your updates.
echo.
pause
