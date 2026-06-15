@echo off
chcp 65001 > nul
title تشغيل بيئة تطوير SGN المتكاملة
cd /d "%~dp0"

echo ========================================================
echo   جاري تشغيل بيئة تطوير منصة الجالية السورية في هولندا
echo ========================================================
echo.

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

:: Wait 6 seconds for the dev server to initialize, then open the browser
timeout /t 6 > nul
start http://localhost:3000/login

exit
