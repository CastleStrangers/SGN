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
call :run_checks
if %errorlevel% neq 0 goto end
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
call :run_checks
if %errorlevel% neq 0 goto end
echo.
set /p msg="Commit message (leave empty for default): "
if "!msg!"=="" set "msg=chore: updates to SGN"
git add .
git commit -m "!msg!"
echo - Pushing SGN changes to origin...
git push origin main
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
call :run_checks
if %errorlevel% neq 0 goto end
echo.
echo [1/2] Syncing SGN repo...
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
if %errorlevel% neq 0 (
    echo [!] WARNING: SGN pull/rebase failed. Aborting rebase...
    git rebase --abort
)
echo - Pushing SGN changes to origin...
git push origin main
if %errorlevel% neq 0 (
    echo [!] ERROR: Failed to push SGN changes.
)

echo.
echo [2/2] Deploying to Vercel...
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

:run_checks
echo ======================================================
echo   [*] جاري تشغيل الفحوصات التلقائية للمشروع...
echo ======================================================
echo.
echo [أ] فحص نصوص الترجمات (i18n)...
call npm run i18n:check
if %errorlevel% neq 0 (
    echo.
    echo ❌ [تنبيه] تم العثور على نصوص عربية مباشرة في الكود!
    echo.
    choice /C YN /N /M "هل تريد الاستمرار رغم ذلك؟ [Y/N]: "
    if !errorlevel! neq 1 (
        echo تم إلغاء العملية.
        exit /b 1
    )
) else (
    echo   [✓] فحص i18n سليم 100%%.
)
echo.
echo [ب] فحص توكن فيسبوك (Facebook API)...
call npx tsx scripts/07-diagnose-facebook.ts
findstr /I "error expired invalid" fb_diagnose_result.txt >nul
if %errorlevel% equ 0 (
    echo.
    echo ⚠️ [تحذير] توكن فيسبوك منتهي الصلاحية أو غير صالح!
    echo يرجى مراجعة: fb_diagnose_result.txt وتجديد التوكن.
    echo.
    timeout /t 4
) else (
    echo   [✓] توكن فيسبوك صالح وسليم.
)
echo.
exit /b 0

:end
echo.
echo ======================================================
echo.
pause
goto menu
