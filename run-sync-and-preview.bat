@echo off
echo ===================================================
echo Starting SGN Project Synchronization...
echo ===================================================

echo.
echo Checking if Next.js Dev Server is running on port 3000...
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% equ 0 (
    echo Next.js Dev Server is already running.
) else (
    echo Next.js Dev Server is not running. Starting in a new PowerShell window...
    start powershell -NoExit -Command "cd '%~dp0'; Write-Host 'Starting Next.js Dev Server on port 3000...' -ForegroundColor Green; npx next dev -p 3000 --webpack"
)

echo.
echo 1. Updating mobile client URL (set:prod)...
cd mobile
call npm run set:prod
cd ..

echo.
echo 2. Staging changes in Git...
git add .

echo.
set /p msg="Enter Commit Message (press Enter for default): "
if "%msg%"=="" (
    set msg="Auto-update: Syncing project components and settings"
)

git commit -m "%msg%"
echo.
echo Uploading changes to repository (Git Push)...
git push

echo.
echo 3. Opening preview URLs...
start http://localhost:3000
start https://sgn-indol.vercel.app
start https://sy-nl.org

echo.
echo Done successfully!
echo ===================================================
pause
