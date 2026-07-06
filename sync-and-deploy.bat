@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Auto Sync & Deploy
echo ========================================
echo   SGN Auto Sync & Deploy Script
echo ========================================
echo.

echo [*] جاري تشغيل الفحوصات التلقائية للمشروع...
echo.
echo [أ] فحص نصوص الترجمات (i18n)...
call npm run i18n:check
if %errorlevel% neq 0 (
    echo.
    echo ❌ [تنبيه] تم العثور على نصوص عربية مباشرة في الكود!
    echo.
    choice /C YN /N /M "هل تريد الاستمرار رغم ذلك؟ [Y/N]: "
    if !errorlevel! neq 1 (
        echo تم إلغاء عملية الرفع.
        pause
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

echo [1/4] Pulling latest updates from GitHub...
git pull origin main
echo.

echo [2/4] Adding all local changes...
git add .
echo.

echo [3/4] Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=auto: sync latest updates from local
git commit -m "%commit_msg%"
echo.

echo [4/4] Pushing to GitHub (Vercel will auto-deploy)...
git push origin main
echo.

echo ========================================
echo Done! Vercel is now building the live site.
echo Check your Vercel dashboard for deployment status.
echo ========================================
pause
