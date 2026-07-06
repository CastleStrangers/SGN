@echo off
cd /d "%~dp0"
echo ==================================================
echo   Force Deploy to Vercel
echo ==================================================
echo.
echo [1] Pulling latest changes...
git pull origin main
echo.
echo [2] Adding files...
git add .
echo.
echo [3] Committing changes...
git commit -m "Fix URL encoding for Arabic categories"
echo.
echo [4] Pushing to GitHub (Vercel will deploy automatically)...
git push origin main
echo.
echo ==================================================
echo SUCCESS! 
echo Please wait exactly 1 minute for Vercel to build.
echo ==================================================
pause
