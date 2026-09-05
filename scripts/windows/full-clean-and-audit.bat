@echo off
setlocal enabledelayedexpansion
title SGN - Full Project Audit and Maintenance

echo ======================================================
echo    SGN Platform - Full Project Audit and Clean
echo ======================================================
echo.

:: 1. Cleanup temporary logs and junk files
echo [*] Cleaning temporary logs and cache files...
del /q /f "%~dp0..\..\*-log.txt" 2>nul
del /q /f "%~dp0..\..\*-result.txt" 2>nul
del /q /f "%~dp0..\..\temp_*" 2>nul
del /q /f "%~dp0..\..\vercel-*.txt" 2>nul
del /q /f "%~dp0..\..\server.log" 2>nul
del /q /f "%~dp0..\..\video.mp4" 2>nul
echo [OK] Junk and temporary files cleaned.
echo.

:: 2. Typecheck Web App
echo [*] Checking Web App TypeScript (src/)...
cd /d "%~dp0..\.."
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR] Web TypeScript check failed!
    pause
    exit /b %errorlevel%
)
echo [OK] Web TypeScript is 100%% clean!
echo.

:: 3. Typecheck Mobile App
echo [*] Checking Mobile App TypeScript (mobile/)...
cd /d "%~dp0..\..\mobile"
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR] Mobile TypeScript check failed!
    pause
    exit /b %errorlevel%
)
echo [OK] Mobile TypeScript is 100%% clean!
echo.

:: 4. Database Check
echo [*] Verifying Local and Cloud Database integrity...
cd /d "%~dp0..\.."
call npx tsx scripts/06-check-database.ts
echo.

echo ======================================================
echo   [SUCCESS] Full Project Audit & Maintenance Completed!
echo ======================================================
echo.
pause
