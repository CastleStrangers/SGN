@echo off\r
chcp 65001 > nul\r
setlocal enabledelayedexpansion\r
title تشغيل بيئة تطوير SGN المتكاملة\r
cd /d "%~dp0..\.."\r
\r
echo ========================================================\r
echo   جاري تشغيل بيئة تطوير منصة الجالية السورية في هولندا\r
echo ========================================================\r
echo.\r
:: 0. Sync and push any pending local changes to GitHub/Vercel staging first\r
echo [0/3] جاري رفع ومزامنة أي تعديلات معلقة إلى المستودع...\r
git add .\r
git diff-index --quiet HEAD --\r
if %errorlevel% neq 0 (\r
    git commit -m "auto: sync pending changes on startup"\r
)\r
echo - Pulling latest SGN changes...\r
git pull origin main --rebase\r
git push origin main\r
\r
echo Syncing and pushing parent repository...\r
cd ..\r
git add .\r
set pdirty=0\r
git diff-index --quiet HEAD -- || set pdirty=1\r
if "!pdirty!"=="1" (\r
    git commit -m "auto: sync nested SGN changes on startup"\r
    echo - Pulling latest Parent changes...\r
    git pull origin main --rebase\r
    git push origin main\r
) else ( echo - Parent repository is clean. )\r
cd SGN\r
echo.\r
:: 1. Start the Next.js Web Developer Server in a new window\r
echo [1/3] جاري تشغيل خادم الويب (Next.js) على المنفذ 3000...\r
start "خادم الويب SGN Web Server" cmd /k "npm run dev"\r
\r
:: 2. Start the Expo Mobile Bundler in tunnel mode in a new window\r
echo [2/3] جاري تشغيل خادم تطبيق الموبايل (Expo Terminal)...\r
start "خادم الموبايل SGN Mobile Expo" cmd /k "cd mobile && npx expo start --tunnel"\r
\r
:: 3. Start the Autosync watcher script in a new PowerShell window\r
echo [3/3] جاري تشغيل نظام المزامنة والرفع الفوري (Autosync)...\r
start "مراقب المزامنة Git Autosync" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0autosync.ps1"\r
\r
echo.\r
echo ========================================================\r
echo   تم تشغيل جميع الخوادم بنجاح في نوافذ منفصلة!\r
echo   جاري فتح صفحة تسجيل الدخول المحلية في المتصفح...\r
echo ========================================================\r
echo.\r
\r
:: Wait 6 seconds for the dev server to initialize, then open the browser tabs\r
timeout /t 6 > nul\r
start http://localhost:3000/login\r
start https://sgn-indol.vercel.app/login\r
\r
exit\r
