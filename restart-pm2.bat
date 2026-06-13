@echo off
echo ==============================================
echo   Cleaning up port 3001 and resetting PM2
echo ==============================================
echo.

echo 1. Finding and killing any process on port 3001...
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue"
echo Done.

echo.
echo 2. Installing new dependencies (including tsx)...
call npm install
echo Done.

echo.
echo 3. Deleting old PM2 configuration...
call pm2 delete all
echo Done.

echo.
echo 4. Starting PM2 using ecosystem.config.js...
call pm2 start ecosystem.config.js
echo Done.

echo.
echo 5. Saving new PM2 configuration...
call pm2 save
echo Done.

echo.
echo ==============================================
echo   PM2 successfully reset!
echo   Web app: http://localhost:3001
echo   Sync cron: Every hour
echo ==============================================
pause
