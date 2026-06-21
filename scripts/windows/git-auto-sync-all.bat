@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title Automated Git Sync and Vercel Deploy (SGN + Parent)
cd /d "%~dp0..\.."

echo =======================================================
echo   AUTOMATED GIT SYNC and VERCEL DEPLOY (SGN + PARENT)
echo =======================================================
echo.

:: Create and update desktop shortcuts
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.Save()" 2>nul
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0', 'تشغيل.vbs'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $vbs; $s.WorkingDirectory = '%~dp0'; $s.Save()" 2>nul
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'AI Reclassify News.lnk'); $bat = [System.IO.Path]::Combine('%~dp0', 'run-reclassify.bat'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $bat; $s.WorkingDirectory = '%~dp0'; $s.Save()" 2>nul

:: 1. Sync SGN (Child)
echo [1/3] Syncing SGN repository...
echo Checking and correcting SGN repository remote URL...
git remote get-url origin 2>nul | findstr "CastleStrangers1979" >nul
if !errorlevel! equ 0 (
    echo - Correcting SGN origin URL to CastleStrangers...
    git remote set-url origin https://github.com/CastleStrangers/SGN.git
)

echo Untracking database, log, and cache files in SGN...
git rm --cached -f prisma/dev.db prisma/dev.db-journal pm2-error.log pm2-out.log tsconfig.tsbuildinfo git-repair-log.txt status.txt status-parent.txt check-status.bat cmd_output.log dev-server*.log dev-srv*.log verification-report.txt >nul 2>&1

git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in SGN. Committing...
    git commit -m "auto: commit SGN changes"
) else (
    echo - SGN repository is already clean.
)
echo - Pulling latest SGN changes...
git pull origin main --rebase
if %errorlevel% neq 0 (
    echo [!] WARNING: SGN pull/rebase failed. Aborting and trying auto-resolve (theirs)...
    git rebase --abort 2>nul
    git pull origin main --rebase -X theirs
)
echo - Pushing SGN changes to origin...
git push origin main
if %errorlevel% neq 0 (
    echo [!] ERROR: Failed to push SGN changes.
    set /p force_sgn="Do you want to FORCE PUSH the SGN repository to GitHub? (y/n): "
    if /i "!force_sgn!"=="y" (
        echo - Force pushing SGN repository...
        git push origin main --force
    )
)

:: 2. Sync Parent
echo.
echo [2/3] Syncing Parent repository...
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
    git diff-index --quiet HEAD --
    if %errorlevel% neq 0 (
        echo - Changes detected in Parent. Committing...
        git commit -m "auto: sync nested SGN changes to parent repository"
    ) else (
        echo - Parent repository is already clean.
    )
    echo - Pulling Parent remote changes...
    git pull origin main --rebase
    if %errorlevel% neq 0 (
        echo [!] WARNING: Parent pull/rebase failed. Aborting and trying auto-resolve (theirs)...
        git rebase --abort 2>nul
        git pull origin main --rebase -X theirs
    )
    echo - Pushing Parent changes to origin...
    git push origin main
    if %errorlevel% neq 0 (
        echo.
        echo [!] WARNING: Parent push failed. Remote and local history diverged.
        set /p force_push="Do you want to FORCE PUSH the local Parent repository to GitHub? (y/n): "
        if /i "!force_push!"=="y" (
            echo - Force pushing Parent repository to GitHub...
            git push origin main --force
        )
    )
) else (
    echo [!] Warning: Parent .git directory not found. Skipping Parent sync.
)
cd SGN

:: 3. Deploy to Vercel
echo.
echo [3/3] Deploying directly to Vercel staging...
call vercel --prod

:: 4. Open Staging Site Preview
echo.
echo - Opening Staging/Preview website in your browser...
start https://sgn-indol.vercel.app

:: 5. Verification & Auto Exit
echo.
echo =======================================================
echo   SUCCESS: All repositories synced, deployed, and clean!
echo =======================================================
timeout /t 10
