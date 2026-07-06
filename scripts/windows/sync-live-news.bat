@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Live News Sync

cd /d "%~dp0..\.."

echo ======================================================
echo   Push Live News (Update Client Site)
echo ======================================================
echo.
echo This tool will send a direct command to the live client
echo website to fetch and update its own database instantly.
echo No dashboard login or database keys required.
echo.

call npx tsx scripts/09-sync-live.ts

echo.
echo ======================================================
echo Done! The client can now refresh the website to see it.
echo ======================================================
pause
