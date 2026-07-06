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

:: 1. Start Next.js Web Dev Server
echo [1/2] Starting Next.js Web Server on port 3000...
start "SGN Web Dev Server" cmd /k "npm run dev"

:: 2. Start Expo Mobile Server (Standard LAN mode for stability)
echo [2/2] Starting Expo Mobile Server...
start "SGN Mobile Expo Server" cmd /k "cd mobile && npx expo start"

:: 3. Start Git Autosync Watcher
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
