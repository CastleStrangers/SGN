@echo off
echo ===================================================
echo Restarting Next.js Dev Server (Port 3000)
echo ===================================================

echo 1. Finding and stopping any process on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
  echo Killing process with PID %%a...
  taskkill /f /pid %%a
)

echo 2. Cleaning Next.js compilation cache...
if exist .next (
  echo Cleaning .next cache folder...
  rmdir /s /q .next
)

echo 3. Starting Next.js Dev Server...
npm run dev
