@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title لوحة التحكم الموحدة - SGN Control Panel

:: Reset choice variable on startup
set "choice="

:: Detect workspace folder based on script location and change to it
if exist "%~dp0scripts\windows" (
    cd /d "%~dp0."
) else (
    cd /d "%~dp0..\.."
)

:: Get clean, canonical absolute paths
set "WORKSPACE_DIR=%cd%"
set "SCRIPTS_DIR=%WORKSPACE_DIR%\scripts\windows"

cd /d "%WORKSPACE_DIR%"

:menu
cls
set "choice="
echo ======================================================
echo    SGN Control Panel - Syrian Community NL
echo    لوحة التحكم الموحدة للجالية السورية في هولندا
echo ======================================================
echo.
echo  [1]  Start Dev Environment (Next.js, Expo, Autosync)
echo       تشغيل بيئة التطوير (الويب، الجوال، والمزامنة التلقائية)
echo.
echo  [2]  Git Sync + Vercel Deploy (Auto Sync Changes)
echo       مزامنة المستودع التلقائي ونشر التحديثات على السيرفر
echo.
echo  [3]  Mobile App Build (Android APK, iOS, Web)
echo       بناء تطبيق الجوال ونشره للزبون (EAS)
echo.
echo  [4]  Database Update & Sync (Turso Cloud & Local DB)
echo       تحديث قاعدة البيانات السحابية والمحلية (Prisma & Turso)
echo.
echo  [5]  Emergency Git Repair (Nested Repo Conflict)
echo       إصلاح تعارض مستودعات Git المتداخلة (إصلاح مشكلة المزامنة)
echo.
echo  [6]  AI News Re-classification (Ollama)
echo       إعادة تصنيف الأخبار بالذكاء الاصطناعي محلياً
echo.
echo  [7]  Generate Project Specifications PDF
echo       توليد وثيقة المواصفات الفنية للمشروع
echo.
echo  [8]  Create Unified Control Panel Desktop Shortcut
echo       إنشاء اختصار لوحة التحكم الموحدة على سطح المكتب
echo.
echo  [0]  Exit / خروج
echo.
echo ======================================================
set /p choice="Enter option (0-8): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto sync
if "%choice%"=="3" goto mobile
if "%choice%"=="4" goto db
if "%choice%"=="5" goto repair
if "%choice%"=="6" goto reclassify
if "%choice%"=="7" goto specs
if "%choice%"=="8" goto shortcuts
if "%choice%"=="0" exit /b
goto menu

:dev
cls
echo ======================================================
echo   Starting Full Dev Environment
echo ======================================================
echo.
call "%SCRIPTS_DIR%\start-dev-environment.bat"
goto end

:sync
cls
echo ======================================================
echo   Git Sync + Vercel Deploy
echo ======================================================
echo.
call "%WORKSPACE_DIR%\sync-and-deploy.bat"
goto end

:mobile
cls
echo ======================================================
echo   Mobile App Build & Deploy
echo ======================================================
echo.
call "%SCRIPTS_DIR%\mobile-build-prod.bat"
goto end

:db
cls
echo ======================================================
echo   Database Update & Sync (Local & Turso Cloud)
echo ======================================================
echo.
echo [1/3] Running local Prisma db push...
call npx prisma db push
echo.
echo [2/3] Downloading production variables from Vercel...
call npx vercel env pull --environment=production .env.production
echo.
echo [3/3] Running Turso Cloud schema update...
call "%SCRIPTS_DIR%\run-turso-update.bat"
goto end

:repair
cls
echo ======================================================
echo   Emergency Git Repair - Nested Repo Conflict
echo ======================================================
echo.
if exist "%WORKSPACE_DIR%\..\.git" (
    echo [!] Found accidental .git folder in the parent directory:
    echo     %WORKSPACE_DIR%\..\.git
    echo.
    echo [*] Removing the accidental parent .git folder...
    rmdir /s /q "%WORKSPACE_DIR%\..\.git"
    if exist "%WORKSPACE_DIR%\..\.git" (
        echo ❌ Failed to remove parent .git folder. Please delete it manually.
    ) else (
        echo [✓] Success! Accidental parent .git folder deleted.
        echo Please restart VS Code to refresh source control view.
    )
) else (
    echo [✓] No parent .git folder found.
)
goto end

:reclassify
cls
echo ======================================================
echo   AI News Re-classification (Ollama)
echo ======================================================
echo.
call "%SCRIPTS_DIR%\run-reclassify.bat"
goto end

:specs
cls
echo ======================================================
echo   Generate Project Specifications PDF
echo ======================================================
echo.
call "%SCRIPTS_DIR%\generate-specs-pdf.bat"
goto end

:shortcuts
cls
echo ======================================================
echo   Creating Unified Desktop Shortcut
echo ======================================================
echo.
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Control Panel.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%WORKSPACE_DIR%\sgn.bat'; $s.WorkingDirectory = '%WORKSPACE_DIR%'; $s.IconLocation = 'shell32.dll,24'; $s.Save(); Write-Host 'Created unified SGN Control Panel desktop shortcut!'"
echo.
echo [✓] Done! You now have a single 'SGN Control Panel' shortcut on your desktop.
echo You can safely delete all other old shortcuts.
goto end

:end
echo.
echo ======================================================
echo.
pause
goto menu
