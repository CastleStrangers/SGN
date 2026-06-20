@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Control Panel
cd /d "%~dp0..\.."

:: Handle direct argument from shortcut
if not "%~1"=="" (
    set "choice=%~1"
    goto :%choice% 2>nul
)

:menu
cls
echo ======================================================
echo    SGN Control Panel - Syrian Community NL
echo ======================================================
echo.
echo  [1]  Start Dev Environment
echo  [2]  Deploy to Vercel
echo  [3]  Git Sync + Deploy
echo  [4]  AI Reclassify News
echo  [5]  Create Desktop Shortcuts
echo  [0]  Exit
echo.
set /p choice="Enter number (0-5): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto deploy
if "%choice%"=="3" goto sync
if "%choice%"=="4" goto reclassify
if "%choice%"=="5" goto shortcuts
if "%choice%"=="0" exit /b
goto menu

:dev
cls
echo ======================================================
echo   Starting Full Dev Environment
echo ======================================================
echo.
echo [1/4] Pushing pending changes...
git add .
call :trycommit "auto: sync pending changes on startup"
echo.
echo [2/4] Starting Next.js web server on port 3000...
start "SGN Web Server" cmd /k "npm run dev"
echo.
echo [3/4] Starting Expo mobile bundler...
start "SGN Mobile Expo" cmd /k "cd mobile && npx expo start --tunnel"
echo.
echo [4/4] Starting autosync watcher...
start "SGN Autosync" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"
echo.
timeout /t 6 > nul
start http://localhost:3000/login
start https://sgn-indol.vercel.app/login
echo All servers started successfully!
goto end

:deploy
cls
echo ======================================================
echo   Deploy to Vercel Staging
echo ======================================================
echo.
set /p msg="Commit message (leave empty for default): "
if "!msg!"=="" set "msg=chore: updates to SGN"
git add .
git commit -m "!msg!"
echo - Pulling latest SGN changes...
git pull origin main --rebase
echo - Pushing SGN changes to origin...
git push origin main
echo.
echo Syncing and pushing parent repository...
cd ..
git add .
set pdirty=0
git diff-index --quiet HEAD -- || set pdirty=1
if "!pdirty!"=="1" (
    git commit -m "auto: sync nested SGN changes to parent"
    echo - Pulling latest Parent changes...
    git pull origin main --rebase
    git push origin main
) else ( echo - No parent changes. )
cd SGN
echo.
echo Deploying to Vercel...
call vercel --prod
echo.
echo Done! https://sgn-indol.vercel.app
goto end

:sync
cls
echo ======================================================
echo   Git Sync + Vercel Deploy
echo ======================================================
echo.
echo [1/3] Syncing SGN repo...
git add .
set dirty=0
git diff-index --quiet HEAD -- || set dirty=1
if "!dirty!"=="1" (
    set /p msg="SGN commit message (default: auto): "
    if "!msg!"=="" set "msg=auto: commit SGN changes"
    git commit -m "!msg!"
) else ( echo - No changes. )
echo - Pulling latest SGN changes...
git pull origin main --rebase
git push origin main
echo.
echo [2/3] Syncing parent repo...
cd ..
git add .
set pdirty=0
git diff-index --quiet HEAD -- || set pdirty=1
if "!pdirty!"=="1" (
    git commit -m "auto: sync nested SGN changes to parent"
    echo - Pulling latest Parent changes...
    git pull origin main --rebase
    git push origin main
) else ( echo - No parent changes. )
cd SGN
echo.
echo [3/3] Deploying to Vercel...
call vercel --prod
echo.
start https://sgn-indol.vercel.app
echo Sync + Deploy complete!
goto end

:reclassify
cls
echo ======================================================
echo   AI News Re-classification (Ollama)
echo ======================================================
echo.
call npm run reclassify
echo.
echo Classification complete!
goto end

:shortcuts
cls
echo ======================================================
echo   Creating Desktop Shortcuts
echo ======================================================
echo.
powershell -Command ^
$ws = New-Object -ComObject WScript.Shell; ^
$d = [Environment]::GetFolderPath('Desktop'); ^
$s = $ws.CreateShortcut([IO.Path]::Combine($d, 'SGN - Dev.lnk')); ^
$s.TargetPath = '%~f0'; ^
$s.Arguments = 'dev'; ^
$s.WorkingDirectory = '%~dp0'; ^
$s.Save(); ^
$s = $ws.CreateShortcut([IO.Path]::Combine($d, 'SGN - Deploy.lnk')); ^
$s.TargetPath = '%~f0'; ^
$s.Arguments = 'deploy'; ^
$s.WorkingDirectory = '%~dp0'; ^
$s.Save(); ^
$s = $ws.CreateShortcut([IO.Path]::Combine($d, 'SGN - Sync + Deploy.lnk')); ^
$s.TargetPath = '%~f0'; ^
$s.Arguments = 'sync'; ^
$s.WorkingDirectory = '%~dp0'; ^
$s.Save(); ^
$s = $ws.CreateShortcut([IO.Path]::Combine($d, 'SGN - Reclassify.lnk')); ^
$s.TargetPath = '%~f0'; ^
$s.Arguments = 'reclassify'; ^
$s.WorkingDirectory = '%~dp0'; ^
$s.Save(); ^
Write-Host 'Created 4 desktop shortcuts!'
echo.
echo Done! Shortcuts on your desktop.
goto end

:trycommit
git diff-index --quiet HEAD -- || (git commit -m "%~1" && git push origin main)
goto :eof

:end
echo.
echo ======================================================
echo.
pause
goto menu
