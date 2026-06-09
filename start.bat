@echo off
cd /d "%~dp0"
echo ============================================
echo   Syrian Community Netherlands - Dev Server
echo ============================================
echo.
start http://localhost:3000/join
echo Starting server on http://localhost:3000
echo.
call npm run dev
pause
