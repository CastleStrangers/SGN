@echo off
title SGN Emergency Fix - Schema & Deploy
echo ==========================================
echo   SGN Fix: DB Schema + Images + Deploy
echo ==========================================
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

echo [1/3] Fixing Turso schema (adding missing columns)...
node scripts/fix-turso-schema.cjs
echo.

echo [2/3] Committing all fixes to Git...
git add -A
git commit -m "fix: اصلاح API الاخبار لمعالجة locale بشكل امن + تحديث schema Turso + اصلاح مشكلة الصور"
echo.

echo [3/3] Pushing to GitHub (Vercel will auto-deploy)...
git push origin main
echo.

echo ==========================================
echo Done! Check https://sgn-indol.vercel.app
echo ==========================================
pause
