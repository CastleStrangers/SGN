@echo off
echo ==================================================
echo   Fix Local and Live Databases
echo ==================================================
echo.
call npx tsx fix-all-dbs.ts
echo.
pause
