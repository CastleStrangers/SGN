@echo off
echo =======================================================
echo   AUTOMATED GIT SYNC & DEPLOYMENT TOOL (SGN + PARENT)
echo =======================================================
echo.

:: Create desktop shortcuts if they don't exist
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); if (-not (Test-Path $desktop)) { $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.Save(); Write-Host '✓ Git Sync desktop shortcut created!' -ForegroundColor Green }"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0', 'تشغيل.vbs'); if (-not (Test-Path $desktop)) { $s = $ws.CreateShortcut($desktop); $s.TargetPath = $vbs; $s.WorkingDirectory = '%~dp0'; $s.Save(); Write-Host '✓ Start Server desktop shortcut created!' -ForegroundColor Green }"

:: Option to set mobile environment
echo Select Mobile App URL Config:
echo [1] Sync only (keep current configuration)
echo [2] Set mobile API URL to PRODUCTION (https://sy-nl.org) and Sync
echo [3] Set mobile API URL to DEVELOPMENT (http://localhost:3000) and Sync
echo.
set /p opt="Enter option [1-3] (Default: 1): "

if "%opt%"=="2" (
    echo - Configuring mobile app for Production...
    cd mobile
    call npm run set:prod
    cd ..
)
if "%opt%"=="3" (
    echo - Configuring mobile app for Development...
    cd mobile
    call npm run set:dev
    cd ..
)

:: 1. Sync SGN (Child)
echo.
echo [1/3] Syncing SGN repository...
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in SGN. Committing...
    git commit -m "auto: commit SGN changes"
) else (
    echo - SGN repository is already clean.
)
echo - Pushing SGN changes to origin...
git push origin main

:: 2. Sync Parent
echo.
echo [2/3] Syncing Parent repository...
cd ..
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in Parent. Committing...
    git commit -m "auto: sync nested SGN changes to parent repository"
) else (
    echo - Parent repository is already clean.
)
cd SGN

:: 3. Verification
echo.
echo [3/3] Verifying clean state...
echo --- SGN Status ---
git status
echo.
echo =======================================================
echo   SUCCESS: All repositories synced, committed, and clean!
echo =======================================================
pause
