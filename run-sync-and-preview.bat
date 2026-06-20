@echo off
echo ===================================================
echo Starting SGN Project Synchronization...
echo ===================================================

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
