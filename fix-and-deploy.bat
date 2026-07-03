@echo off
title SGN Emergency Fix - Schema & Deploy
echo ==========================================
echo   SGN Fix: DB Schema + Images + Deploy
echo ==========================================
echo.

echo [1/3] Fixing Turso schema (adding missing columns)...
node scripts/fix-turso-schema.mjs
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
