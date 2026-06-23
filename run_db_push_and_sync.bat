@echo off
set "PATH=C:\Program Files\Git\bin;%PATH%"
title SGN Database Update & Sync
echo ===================================================
echo 1. Running Prisma Database Push (prisma db push)
echo ===================================================
call npx prisma db push
echo.
echo ===================================================
echo 2. Launching Git Commit & Push (Vercel Auto-deploy)
echo ===================================================
call sync-and-deploy.bat
