@echo off
echo ==============================================
echo   Git Workspace Prep & Cleanup
echo ==============================================
echo.
echo 1. Unstaging pm2 log files...
call git restore --staged pm2-error.log pm2-out.log >nul 2>&1
echo.
echo 2. Discarding local changes to pm2 log files...
call git restore pm2-error.log pm2-out.log >nul 2>&1
echo.
echo 3. Untracking pm2 log files completely...
call git rm --cached -f pm2-error.log pm2-out.log >nul 2>&1
echo.
echo 4. Staging the service worker fix (sw.js)...
call git add public/sw.js
echo.
echo 5. Committing changes...
call git commit -m "fix: ignore non-http schemes in service worker and untrack log files"
echo.
echo 6. Verifying git status...
call git status
echo.
echo ==============================================
echo   Workspace prep complete!
echo   If status shows 'nothing to commit, working tree clean',
echo   you can now retry moving the worktree changes.
echo ==============================================
pause
