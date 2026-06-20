@echo off\r
chcp 65001 > nul\r
cd /d "%~dp0..\.."\r
\r
echo =======================================================\r
echo   AUTOMATED GIT SYNC and VERCEL DEPLOY (SGN + PARENT)\r
echo =======================================================\r
echo.\r
\r
:: Create and update desktop shortcuts\r
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.Save()"\r
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0', 'تشغيل.vbs'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $vbs; $s.WorkingDirectory = '%~dp0'; $s.Save()"\r
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'AI Reclassify News.lnk'); $bat = [System.IO.Path]::Combine('%~dp0', 'run-reclassify.bat'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $bat; $s.WorkingDirectory = '%~dp0'; $s.Save()"\r
\r
:: 1. Sync SGN (Child)\r
echo [1/3] Syncing SGN repository...\r
git add .\r
git diff-index --quiet HEAD --\r
if %errorlevel% neq 0 (\r
    echo - Changes detected in SGN. Committing...\r
    git commit -m "auto: commit SGN changes"\r
) else (\r
    echo - SGN repository is already clean.\r
)\r
echo - Pulling latest SGN changes from origin...\r
git pull origin main --rebase\r
echo - Pushing SGN changes to origin...\r
git push origin main\r
\r
:: 2. Sync Parent\r
echo.\r
echo [2/3] Syncing Parent repository...\r
cd ..\r
git add .\r
git diff-index --quiet HEAD --\r
if %errorlevel% neq 0 (\r
    echo - Changes detected in Parent. Committing...\r
    git commit -m "auto: sync nested SGN changes to parent repository"\r
    echo - Pulling latest Parent changes from origin...\r
    git pull origin main --rebase\r
    echo - Pushing Parent changes to origin...\r
    git push origin main\r
) else (\r
    echo - Parent repository is already clean.\r
)\r
cd SGN\r
\r
:: 3. Deploy to Vercel\r
echo.\r
echo [3/3] Deploying directly to Vercel staging...\r
call vercel --prod\r
\r
:: 4. Open Staging Site Preview\r
echo.\r
echo - Opening Staging/Preview website in your browser...\r
start https://sgn-indol.vercel.app\r
\r
:: 5. Verification & Auto Exit\r
echo.\r
echo =======================================================\r
echo   Sync process finished. Please review any errors above.\r
echo =======================================================\r
pause\r
