@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Git Push & Deploy Tool
cd /d "%~dp0..\.."

echo =======================================================
echo         أداة رفع المشروع وتحديث رابط العميل (SGN)
echo =======================================================
echo.

:: 1. إنشاء اختصار على سطح المكتب تلقائياً عند تشغيل السكريبت
echo [1/5] جاري التحقق من اختصار سطح المكتب...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Push & Deploy.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,147'; $s.Save()" 2>nul
if %errorlevel% equ 0 (
    echo   [✓] تم إنشاء/تحديث اختصار "SGN Push & Deploy" على سطح المكتب.
) else (
    echo   [!] لم نتمكن من إنشاء الاختصار، يرجى تشغيل السكريبت كمسؤول.
)
echo.

:: 2. التحقق من مسار المستودع البعيد
echo [2/5] التحقق من رابط المستودع (Remote URL)...
git remote set-url origin https://github.com/CastleStrangers/SGN.git
echo   [✓] تم توجيه المستودع لـ: https://github.com/CastleStrangers/SGN.git
echo.

:: 3. طلب رسالة الالتزام (Commit Message)
echo [3/5] تجهيز التعديلات للرفع...
git status -s
echo.
set "commit_msg="
set /p commit_msg="الرجاء إدخال وصف للتعديل (Commit Message) [أو اضغط Enter للرسالة التلقائية]: "

if "%commit_msg%"=="" (
    set commit_msg=chore: update project features and styling
)

echo.
echo جاري إضافة الملفات وعمل Commit...
git add -A
git commit -m "%commit_msg%"
echo.

:: 4. سحب التعديلات الأخيرة ورفع الكود
echo [4/5] جاري سحب التعديلات الأخيرة ومزامنتها (Pull & Push)...
echo - جاري سحب التعديلات...
git pull origin main --rebase
if %errorlevel% neq 0 (
    echo [!] تحذير: فشلت عملية الـ Pull العادية، جاري محاولة حل التعارض تلقائياً...
    git rebase --abort 2>nul
    git pull origin main --rebase -X theirs
)

echo - جاري رفع التعديلات للمستودع العام...
git push origin main
if %errorlevel% neq 0 (
    echo [!] خطأ: فشل الرفع. هل ترغب في فرض الرفع (Force Push)؟ (y/n)
    set /p force_push=""
    if /i "!force_push!"=="y" (
        git push origin main --force
    )
)
echo.

:: 5. نشر المشروع وتحديث رابط العميل
echo [5/5] جاري نشر التحديثات على Vercel وتحديث الرابط...
call vercel --prod --yes
if %errorlevel% equ 0 (
    echo   [✓] تم النشر بنجاح على Vercel!
) else (
    echo   [!] حدثت مشكلة أثناء النشر على Vercel. يرجى التحقق من تسجيل الدخول.
)

echo.
echo - جاري فتح رابط العميل للمعاينة...
start https://sgn-msalimaziza-3522s-projects.vercel.app

echo.
echo =======================================================
echo      تمت العملية بنجاح! تم مزامنة المشروع ونشره.
echo =======================================================
echo.
pause
