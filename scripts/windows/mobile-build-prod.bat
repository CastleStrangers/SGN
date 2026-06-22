@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Mobile Build & Deploy Tool
cd /d "%~dp0..\..\mobile"

echo =======================================================
echo        أداة بناء تطبيق الموبايل ونشره للزبون (SGN)
echo =======================================================
echo.

:: 1. تهيئة بيئة الإنتاج للموبايل
echo [1/3] جاري تهيئة بيئة الإنتاج (Production Environment)...
call npm run set:prod
if %errorlevel% neq 0 (
    echo [!] خطأ: فشل إعداد بيئة الإنتاج. يرجى التأكد من تثبيت التبعيات.
    pause
    exit /b 1
)
echo   [✓] تم ضبط روابط الـ API على: https://sgn-msalimaziza-3522s-projects.vercel.app
echo.

:: 2. اختيار منصة البناء
echo [2/3] الرجاء اختيار المنصة التي ترغب في بنائها:
echo   1. أندرويد (Android APK/Bundle)
echo   2. آيفون (iOS IPA)
echo   3. الويب للموبايل (Mobile Web)
echo.
set /p platform_choice="أدخل رقم الاختيار (1-3): "

if "%platform_choice%"=="1" (
    echo جاري البدء ببناء الأندرويد باستخدام EAS...
    call npm run build:android
) else if "%platform_choice%"=="2" (
    echo جاري البدء ببناء الآيفون باستخدام EAS...
    call npm run build:ios
) else if "%platform_choice%"=="3" (
    echo جاري البدء بتصدير نسخة الويب للموبايل...
    call npm run build:web
) else (
    echo [!] اختيار غير صحيح.
    pause
    exit /b 1
)
echo.

:: 3. مزامنة التغييرات مع المستودع لتوثيق البناء
echo [3/3] جاري مزامنة تعديلات البيئة مع المستودع العام...
cd /d "%~dp0..\.."
git add mobile/constants/config.ts
git commit -m "chore: update mobile config to production and build app"
git push origin main
echo.

echo =======================================================
echo      تمت عملية التهيئة والبناء والمزامنة بنجاح!
echo =======================================================
echo.
pause
