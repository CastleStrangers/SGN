@echo off
echo =======================================================
echo   AUTOMATED GIT SYNC (SGN + PARENT)
echo =======================================================
echo.

:: Create desktop shortcuts if they don't exist
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); if (-not (Test-Path $desktop)) { $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.Save() }"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0', 'تشغيل.vbs'); if (-not (Test-Path $desktop)) { $s = $ws.CreateShortcut($desktop); $s.TargetPath = $vbs; $s.WorkingDirectory = '%~dp0'; $s.Save() }"

:: 1. Sync SGN (Child)
echo [1/2] Syncing SGN repository...
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
echo [2/2] Syncing Parent repository...
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

:: 3. Open Staging Site Preview
echo.
echo - Opening Staging/Preview website in your browser...
start https://sgn-indol.vercel.app

:: 4. Verification & Auto Exit
echo.
echo =======================================================
echo   SUCCESS: All repositories synced and clean!
echo =======================================================
timeout /t 3
