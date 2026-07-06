@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Local Dev Environment

cd /d "%~dp0..\.."

echo ========================================================
echo   Starting SGN Local Development Environment
echo   تشغيل بيئة تطوير SGN المحلية
echo ========================================================
echo.

:: 1. Check for hardcoded Arabic strings
echo [1/3] Checking translations (i18n check)...
call npm run i18n:check
if %errorlevel% neq 0 (
    echo.
    echo ❌ [WARNING] Direct Arabic strings found in code!
    echo Please use the translation files (ar.json / en.json / nl.json).
    echo.
    choice /C YN /N /M "Do you want to continue running the dev server anyway? [Y/N]: "
    if !errorlevel! neq 1 (
        echo Cancelled startup.
        pause
        exit /b 1
    )
) else (
    echo   [✓] i18n check passed!
)
echo.

:: 2. Start Next.js Web Dev Server
echo [2/3] Starting Next.js Web Server on port 3000...
start "SGN Web Dev Server" cmd /k "npm run dev"

:: 3. Start Expo Mobile Server
echo [3/3] Starting Expo Mobile Server...
start "SGN Mobile Expo Server" cmd /k "cd mobile && npx expo start --tunnel"

:: 4. Start Git Autosync Watcher
echo.
echo [*] Starting Git Autosync watcher...
if exist "%~dp0autosync.ps1" (
    start "SGN Git Autosync Watcher" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"
)

echo.
echo ========================================================
echo   All servers started successfully in separate windows!
echo   Opening local login page in browser...
echo ========================================================
echo.

:: Wait 5 seconds for Next.js to compile, then open browser
timeout /t 5 > nul
start http://localhost:3000/login

exit /b 0
