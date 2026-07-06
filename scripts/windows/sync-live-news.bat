@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Live News Sync

cd /d "%~dp0..\.."

echo ======================================================
echo   Push Live News (Update Client Site)
echo ======================================================
echo.
echo This tool will fetch the latest news from Facebook/Web
echo and push them DIRECTLY to the live client website.
echo No dashboard login required.
echo.

if not exist ".env.production" (
    echo [1/2] Fetching live database keys from Vercel...
    call npx vercel env pull --environment=production .env.production
    echo.
)

echo [2/2] Connecting to Live Database and Syncing News...
echo.
call npx tsx scripts/09-sync-live.ts

echo.
echo ======================================================
echo Done! The client can now refresh the website to see it.
echo ======================================================
pause
