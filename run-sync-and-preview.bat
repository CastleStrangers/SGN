@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Project Sync, Run and Preview
cd /d "%~dp0."

echo ===================================================
echo   SGN Project Sync, Run and Preview
echo ===================================================
echo.

:: 1. Check Dev Server
echo Checking if Next.js Dev Server is running on port 3000...
netstat -ano | findstr /c:":3000 " >nul
if !errorlevel! equ 0 (
    echo [OK] Next.js Dev Server is already running.
) else (
    echo [-] Next.js Dev Server is not running. Starting in a new window...
    start "SGN Dev Server" cmd /k "npm run dev"
)

:: 2. Update Mobile Client URL
echo.
echo [1/4] Updating mobile client URL to production...
if exist mobile\ (
    cd mobile
    call npm run set:prod
    cd ..
    echo [OK] Mobile client URL updated.
) else (
    echo [!] Warning: mobile directory not found. Skipping set:prod.
)

:: 3. Git Sync SGN Repository
echo.
echo [2/4] Syncing SGN repository with GitHub...
git add .
set dirty=0
git diff-index --quiet HEAD -- || set dirty=1
if "!dirty!"=="1" (
    echo - Changes detected.
    set "msg="
    set /p msg="Enter Commit Message (press Enter for default): "
    if not defined msg (
        set "msg=Auto-update: Syncing project components and settings"
    )
    git commit -m "!msg!"
) else (
    echo [OK] SGN repository is already clean. No new commits.
)

echo - Pulling latest remote changes to prevent conflicts...
git pull origin main --rebase
if !errorlevel! neq 0 (
    echo [!] WARNING: Pull failed or there are conflicts. Aborting rebase...
    git rebase --abort
)

echo - Pushing SGN changes to GitHub...
git push origin main
if !errorlevel! neq 0 (
    echo [!] ERROR: Failed to push SGN changes to GitHub.
) else (
    echo [OK] Repository synchronized successfully.
)

:: 4. Deploy to Vercel
echo.
echo [3/4] Deploying to Vercel staging...
call vercel --prod
if !errorlevel! neq 0 (
    echo [!] Warning: Vercel deployment command skipped or failed.
)

:: 5. Open Preview URLs
echo.
echo [4/4] Opening preview URLs in your browser...
start http://localhost:3000
start https://sgn-indol.vercel.app

echo.
echo ===================================================
echo   DONE: Synchronization and startup complete!
echo ===================================================
pause
