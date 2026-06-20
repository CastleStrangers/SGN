@echo off\r
cd /d "%~dp0..\.."\r
echo ==============================================\r
echo   Deploying SGN to Vercel Staging & Pushing Git\r
echo ==============================================\r
echo.\r
echo 1. Staging, committing, and pushing SGN changes...\r
call git add .\r
call git commit -m "chore: updates to footer and layout"\r
echo - Pulling latest SGN changes...\r
call git pull origin main --rebase\r
call git push origin main\r
echo.\r
echo 2. Syncing and pushing parent repository...\r
cd ..\r
call git add .\r
call git commit -m "auto: sync SGN updates to parent repository"\r
echo - Pulling latest Parent changes...\r
call git pull origin main --rebase\r
call git push origin main\r
cd SGN\r
echo.\r
echo 3. Deploying to Vercel...\r
call vercel --prod\r
echo.\r
echo Done! Please check https://sgn-indol.vercel.app to view your updates.\r
echo.\r
pause\r
