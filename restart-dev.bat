@echo off
echo Stopping dev server on port 3000...
call npx kill-port 3000
echo.
echo Starting dev server on port 3000 in a new window...
start "Next.js Web Server" cmd /k "cd /d "%~dp0" && set NEXTAUTH_URL=http://localhost:3000 && npx next dev --no-turbo -p 3000"
echo.
echo Done! Please refresh the page in your browser.
echo.
pause
