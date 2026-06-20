@echo off
cd /d "%~dp0"
echo Starting SGN server...
echo Open http://localhost:3000 in your browser after 30 seconds
echo.
npx next dev -p 3000 --webpack
pause
