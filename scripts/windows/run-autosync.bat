@echo off
cd /d "%~dp0"
title SGN Git Auto Sync
echo Starting SGN Git Auto Sync...
powershell -ExecutionPolicy Bypass -File autosync.ps1
pause
