@echo off
chcp 65001 > nul
cd /d "%~dp0..\..\."

echo =======================================================
echo   AUTOMATED GIT SYNC and VERCEL DEPLOY (SGN + PARENT)
echo =======================================================
echo.

:: Create and update desktop shortcuts
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0.'; $s.Save()"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0.', 'تشغيل.vbs'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $vbs; $s.WorkingDirectory = '%~dp0.'; $s.Save()"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'AI Reclassify News.lnk'); $bat = [System.IO.Path]::Combine('%~dp0.', 'run-reclassify.bat'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $bat; $s.WorkingDirectory = '%~dp0.'; $s.Save()"

:: 1. Sync SGN (Child)
echo [1/3] Syncing SGN repository...
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in SGN. Committing...
    git commit -m "auto: commit SGN changes"
) else (
    echo - SGN repository is already clean.
)
echo - Pulling latest SGN changes from origin...
git pull origin main --rebase
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
    echo - Pulling latest Parent changes from origin...
    git pull origin main --rebase
    echo - Pushing Parent changes to origin...
    git push origin main
) else (
    echo - Parent repository is already clean.
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
echo   Sync process finished. Please review any errors above.
echo =======================================================
pause
