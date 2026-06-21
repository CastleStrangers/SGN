@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Project Sync, Run and Preview
cd /d "%~dp0."

echo ===================================================
echo   SGN Project Sync, Run and Preview (Flat & Robust)
echo ===================================================
echo.

:: 1. Auto-Correct Git Remote URLs
echo Checking and correcting SGN repository remote URL...
git remote get-url origin 2>nul | findstr "CastleStrangers1979" >nul
if errorlevel 1 goto sgn_remote_ok
echo - Correcting SGN origin URL to CastleStrangers...
git remote set-url origin https://github.com/CastleStrangers/SGN.git
:sgn_remote_ok

:: 2. Untrack problematic database, log, and cache files from Child Repository
echo.
echo Untracking database, log, and cache files in SGN...
git rm --cached -f prisma/dev.db prisma/dev.db-journal pm2-error.log pm2-out.log tsconfig.tsbuildinfo git-repair-log.txt status.txt status-parent.txt check-status.bat cmd_output.log dev-server*.log dev-srv*.log verification-report.txt >nul 2>&1
echo [OK] Files untracked locally.

:: 3. Check Next.js Dev Server
echo.
echo Checking if Next.js Dev Server is running on port 3000...
netstat -ano | findstr /c:":3000 " >nul
if not errorlevel 1 (
    echo [OK] Next.js Dev Server is already running.
    goto dev_server_ok
)
echo [-] Next.js Dev Server is not running. Starting in a new window...
start "SGN Dev Server" cmd /k "npm run dev"
:dev_server_ok

:: 4. Update Mobile Client URL
echo.
echo [1/5] Updating mobile client URL to production...
if not exist mobile\ (
    echo [!] Warning: mobile directory not found. Skipping set:prod.
    goto skip_mobile
)
cd mobile
call npm run set:prod
cd ..
echo [OK] Mobile client URL updated.
:skip_mobile

:: 5. Git Sync SGN (Child) Repository
echo.
echo [2/5] Syncing SGN child repository with GitHub...
git add .
git diff-index --quiet HEAD --
if not errorlevel 1 (
    echo [OK] SGN repository is already clean. No new commits needed.
    goto sgn_clean
)
echo - Changes detected in SGN.
set "msg="
set /p msg="Enter Commit Message (press Enter for default): "
if not defined msg (
    set "msg=Auto-update: Syncing SGN project components and settings"
)
git commit -m "%msg%"
:sgn_clean

echo - Pulling latest SGN remote changes to prevent conflicts...
git pull origin main --rebase
if not errorlevel 1 goto sgn_pull_ok
echo [!] WARNING: SGN pull/rebase failed. Aborting and trying auto-resolve (theirs)...
git rebase --abort 2>nul
git pull origin main --rebase -X theirs
:sgn_pull_ok

echo - Pushing SGN changes to GitHub...
git push origin main
if not errorlevel 1 (
    echo [OK] SGN repository synchronized successfully.
    goto sgn_push_ok
)
echo [!] WARNING: Push failed. Remote and local history diverged.
set "force_sgn=n"
set /p force_sgn="Do you want to FORCE PUSH the SGN repository to GitHub? (y/n): "
if /i "%force_sgn%"=="y" (
    echo - Force pushing SGN repository...
    git push origin main --force
)
:sgn_push_ok

:: 6. Git Sync Parent Repository
echo.
echo [3/5] Syncing Parent repository with GitHub...
cd ..
if not exist .git\ (
    echo [!] Warning: Parent .git directory not found. Skipping Parent sync.
    goto skip_parent
)

echo Checking and correcting Parent repository remote URL...
git remote get-url origin 2>nul | findstr "CastleStrangers1979" >nul
if errorlevel 1 goto parent_remote_ok
echo - Correcting Parent origin URL to CastleStrangers...
git remote set-url origin https://github.com/CastleStrangers/Syrian-Community-App.git
:parent_remote_ok

echo Untracking database, log, and cache files in Parent...
git rm --cached -f SGN/prisma/dev.db SGN/prisma/dev.db-journal SGN/pm2-error.log SGN/pm2-out.log SGN/tsconfig.tsbuildinfo SGN/git-repair-log.txt SGN/status.txt SGN/status-parent.txt auth.json config.json telemetry-device.json telemetry-session.json >nul 2>&1

git add .
git diff-index --quiet HEAD --
if not errorlevel 1 (
    echo [OK] Parent repository is already clean.
    goto parent_clean
)
echo - Changes detected in Parent. Committing...
git commit -m "auto: sync nested SGN changes to parent repository"
:parent_clean

echo - Pulling latest Parent remote changes...
git pull origin main --rebase
if not errorlevel 1 goto parent_pull_ok
echo [!] WARNING: Parent pull/rebase failed. Aborting and trying auto-resolve (theirs)...
git rebase --abort 2>nul
git pull origin main --rebase -X theirs
:parent_pull_ok

echo - Pushing Parent changes to GitHub...
git push origin main
if not errorlevel 1 (
    echo [OK] Parent repository synchronized successfully.
    goto parent_push_ok
)
echo [!] WARNING: Parent push failed. Remote and local history diverged.
set "force_parent=n"
set /p force_parent="Do you want to FORCE PUSH the local Parent repository to GitHub? (y/n): "
if /i "%force_parent%"=="y" (
    echo - Force pushing Parent repository...
    git push origin main --force
)
:parent_push_ok

:skip_parent
cd SGN

:: 7. Deploy to Vercel
echo.
echo [4/5] Deploying SGN to Vercel staging...
call vercel --prod --yes
if not errorlevel 1 (
    echo [OK] Deployed to Vercel successfully.
    goto vercel_ok
)
echo [!] Warning: Vercel deployment command failed.
:vercel_ok

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
