@echo off
echo Stopping dev server on port 3005...
call npx kill-port 3005
echo.
echo Starting dev server on port 3005 in a new window...
start "Next.js Web Server" cmd /k "cd /d "%~dp0" && npx next dev -p 3005"
echo.
echo Done! Please refresh the page in your browser.
echo.
pause
