@echo off
title SGN News Re-classification - SGN
echo =======================================================
echo   SGN NEWS RE-CLASSIFICATION WITH LOCAL OLLAMA AI
echo   Running AI re-classification script...
echo =======================================================
echo.
cd /d "%~dp0"
call npm run reclassify
echo.
echo =======================================================
echo   Done!
echo =======================================================
pause
