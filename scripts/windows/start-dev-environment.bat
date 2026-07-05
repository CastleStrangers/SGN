@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title تشغيل بيئة تطوير SGN المتكاملة
cd /d "%~dp0..\.."

echo ========================================================
echo   جاري تشغيل بيئة تطوير منصة الجالية السورية في هولندا
echo ========================================================
echo.

echo [*] جاري تشغيل الفحوصات التلقائية للمشروع...
echo.

echo [أ] فحص نصوص الترجمات (i18n)...
call npm run i18n:check
if %errorlevel% neq 0 (
    echo.
    echo ❌ [تنبيه] تم العثور على نصوص عربية مباشرة في الكود!
    echo يرجى استخدام نظام الترجمة (ar.json / en.json / nl.json).
    echo.
    choice /C YN /N /M "هل تريد الاستمرار في تشغيل بيئة التطوير رغم ذلك؟ [Y/N]: "
    if !errorlevel! neq 1 (
        echo تم إلغاء التشغيل.
        pause
        exit /b 1
    )
) else (
    echo   [✓] فحص i18n سليم 100%%.
)
echo.

echo [ب] فحص حالة اتصال وتوكن فيسبوك (Facebook API)...
call npx tsx scripts/07-diagnose-facebook.ts
findstr /I "error expired invalid" fb_diagnose_result.txt >nul
if %errorlevel% equ 0 (
    echo.
    echo ⚠️ [تحذير] هناك مشكلة في توكن فيسبوك (انتهت صلاحيته أو غير صالح)!
    echo يرجى التحقق من الملف: fb_diagnose_result.txt وتجديد التوكن في الـ .env
    echo.
    timeout /t 5
) else (
    echo   [✓] توكن فيسبوك صالح وسليم.
)
echo.

:: 0. Sync and push any pending local changes to GitHub/Vercel staging first
echo [0/3] جاري رفع ومزامنة أي تعديلات معلقة إلى المستودع...
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    git commit -m "auto: sync pending changes on startup"
)
git push origin main
:: 1. Start the Next.js Web Developer Server in a new window
echo [1/3] جاري تشغيل خادم الويب (Next.js) على المنفذ 3000...
start "خادم الويب SGN Web Server" cmd /k "npm run dev"

:: 2. Start the Expo Mobile Bundler in tunnel mode in a new window
echo [2/3] جاري تشغيل خادم تطبيق الموبايل (Expo Terminal)...
start "خادم الموبايل SGN Mobile Expo" cmd /k "cd mobile && npx expo start --tunnel"

:: 3. Start the Autosync watcher script in a new PowerShell window
echo [3/3] جاري تشغيل نظام المزامنة والرفع الفوري (Autosync)...
start "مراقب المزامنة Git Autosync" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"

echo.
echo ========================================================
echo   تم تشغيل جميع الخوادم بنجاح في نوافذ منفصلة!
echo   جاري فتح صفحة تسجيل الدخول المحلية في المتصفح...
echo ========================================================
echo.

:: Wait 6 seconds for the dev server to initialize, then open the browser tabs
timeout /t 6 > nul
start http://localhost:3000/login
start https://sgn-indol.vercel.app/login

exit
