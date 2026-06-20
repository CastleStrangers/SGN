@echo off
cd /d "%~dp0..\.."
echo ==============================================
echo   Deploying SGN to Vercel Staging
echo ==============================================
echo.
echo 1. Staging and committing any local SGN changes...
call git add .
call git commit -m "chore: updates to footer and layout"
echo.
echo 2. Deploying to Vercel...
call vercel --prod
echo.
echo Done! Please check https://sgn-indol.vercel.app to view your updates.
echo.
pause
