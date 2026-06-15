@echo off
echo ==============================================
echo   Final Git Log Cleanup
echo ==============================================
echo.
echo 1. Unstaging log files...
call git restore --staged pm2-error.log pm2-out.log
echo.
echo 2. Discarding log file changes...
call git restore pm2-error.log pm2-out.log
echo.
echo 3. Force-untracking log files...
call git rm --cached -f pm2-error.log pm2-out.log
echo.
echo 4. Committing the untracking...
call git commit -m "chore: untrack log files completely"
echo.
echo ==============================================
echo   Workspace is clean!
echo ==============================================
pause
