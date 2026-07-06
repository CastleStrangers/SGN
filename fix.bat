@echo off
chcp 65001 > nul
echo ==================================================
echo   إصلاح قاعدة البيانات الحية (Turso) 
echo ==================================================
echo.
call npx tsx fix-live-db.ts
echo.
pause
