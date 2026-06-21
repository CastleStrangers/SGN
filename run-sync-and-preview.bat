@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Project Sync, Run and Preview
cd /d "%~dp0."

echo ===================================================
echo   SGN Project Sync, Run and Preview (Super Robust)
echo ===================================================
echo.

:: 1. Auto-Correct Git Remote URLs
echo Checking and correcting SGN repository remote URL...
git remote get-url origin 2>nul | findstr "CastleStrangers1979" >nul
if !errorlevel! equ 0 (
    echo - Correcting SGN origin URL to CastleStrangers...
    git remote set-url origin https://github.com/CastleStrangers/SGN.git
) else (
    echo [OK] SGN origin URL is correct.
)

:: 2. Untrack problematic database, log, and cache files from Child Repository
echo.
echo Untracking database, log, and cache files in SGN...
git rm --cached -f prisma/dev.db prisma/dev.db-journal pm2-error.log pm2-out.log tsconfig.tsbuildinfo git-repair-log.txt status.txt status-parent.txt check-status.bat cmd_output.log dev-server*.log dev-srv*.log verification-report.txt >nul 2>&1
echo [OK] Files untracked locally.

:: 3. Check Next.js Dev Server
echo.
echo Checking if Next.js Dev Server is running on port 3000...
netstat -ano | findstr /c:":3000 " >nul
if !errorlevel! equ 0 (
    echo [OK] Next.js Dev Server is already running.
) else (
    echo [-] Next.js Dev Server is not running. Starting in a new window...
    start "SGN Dev Server" cmd /k "npm run dev"
)

:: 4. Update Mobile Client URL
echo.
echo [1/5] Updating mobile client URL to production...
if exist mobile\ (
    cd mobile
    call npm run set:prod
    cd ..
    echo [OK] Mobile client URL updated.
) else (
    echo [!] Warning: mobile directory not found. Skipping set:prod.
)

:: 5. Git Sync SGN (Child) Repository
echo.
echo [2/5] Syncing SGN child repository with GitHub...
git add .
set dirty=0
git diff-index --quiet HEAD -- || set dirty=1
if "!dirty!"=="1" (
    echo - Changes detected in SGN.
    set "msg="
    set /p msg="Enter Commit Message (press Enter for default): "
    if not defined msg (
        set "msg=Auto-update: Syncing SGN project components and settings"
    )
    git commit -m "!msg!"
) else (
    echo [OK] SGN repository is already clean. No new commits needed.
)

echo - Pulling latest SGN remote changes to prevent conflicts...
git pull origin main --rebase
if !errorlevel! neq 0 (
    echo [!] WARNING: SGN pull/rebase failed. Aborting and trying auto-resolve (theirs)...
    git rebase --abort 2>nul
    git pull origin main --rebase -X theirs
)

echo - Pushing SGN changes to GitHub...
git push origin main
if !errorlevel! neq 0 (
    echo [!] WARNING: Push failed. Remote and local history diverged.
    set /p force_sgn="Do you want to FORCE PUSH the SGN repository to GitHub? (y/n): "
    if /i "!force_sgn!"=="y" (
        echo - Force pushing SGN repository...
        git push origin main --force
    )
) else (
    echo [OK] SGN repository synchronized successfully.
)

:: 6. Git Sync Parent Repository
echo.
echo [3/5] Syncing Parent repository with GitHub...
cd ..
if exist .git\ (
    echo Checking and correcting Parent repository remote URL...
    git remote get-url origin 2>nul | findstr "CastleStrangers1979" >nul
    if !errorlevel! equ 0 (
        echo - Correcting Parent origin URL to CastleStrangers...
        git remote set-url origin https://github.com/CastleStrangers/Syrian-Community-App.git
    )
    
    echo Untracking database, log, and cache files in Parent...
    git rm --cached -f SGN/prisma/dev.db SGN/prisma/dev.db-journal SGN/pm2-error.log SGN/pm2-out.log SGN/tsconfig.tsbuildinfo SGN/git-repair-log.txt SGN/status.txt SGN/status-parent.txt auth.json config.json telemetry-device.json telemetry-session.json >nul 2>&1
    
    git add .
    set parent_dirty=0
    git diff-index --quiet HEAD -- || set parent_dirty=1
    if "!parent_dirty!"=="1" (
        echo - Changes detected in Parent. Committing...
        git commit -m "auto: sync nested SGN changes to parent repository"
    )
    
    echo - Pulling latest Parent remote changes...
    git pull origin main --rebase
    if !errorlevel! neq 0 (
        echo [!] WARNING: Parent pull/rebase failed. Aborting and trying auto-resolve (theirs)...
        git rebase --abort 2>nul
        git pull origin main --rebase -X theirs
    )
    
    echo - Pushing Parent changes to GitHub...
    git push origin main
    if !errorlevel! neq 0 (
        echo [!] WARNING: Parent push failed. Remote and local history diverged.
        set /p force_parent="Do you want to FORCE PUSH the Parent repository to GitHub? (y/n): "
        if /i "!force_parent!"=="y" (
            echo - Force pushing Parent repository...
            git push origin main --force
        )
    ) else (
        echo [OK] Parent repository synchronized successfully.
    )
) else (
    echo [!] Warning: Parent .git directory not found. Skipping Parent sync.
)
cd SGN

:: 7. Deploy to Vercel
echo.
echo [4/5] Deploying SGN to Vercel staging...
call vercel --prod --yes
if !errorlevel! neq 0 (
    echo [!] Warning: Vercel deployment command failed.
) else (
    echo [OK] Deployed to Vercel successfully.
)

:: 8. Open Preview URLs
echo.
echo [5/5] Opening preview URLs in your browser...
start http://localhost:3000
start https://sgn-indol.vercel.app

echo.
echo ===================================================
echo   DONE: Synchronization and startup complete!
echo ===================================================
pause
