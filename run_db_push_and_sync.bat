@echo off
title SGN Database Update & Sync
echo ===================================================
1. Running Prisma Database Push (prisma db push)
echo ===================================================
call npx prisma db push
echo.
echo ===================================================
2. Launching Git Commit & Push (Vercel Auto-deploy)
echo ===================================================
call sync-and-deploy.bat
