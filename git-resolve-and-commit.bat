@echo off
echo ==============================================
echo   Resolving Git Conflict and Committing
echo ==============================================
echo.
echo 1. Removing log files from Git index...
call git rm pm2-error.log pm2-out.log
echo.
echo 2. Staging all changes...
call git add .
echo.
echo 3. Committing changes...
call git commit -m "chore: add footer flags, ignore log files, and update dependencies"
echo.
echo ==============================================
echo   Workspace is now clean!
echo   You can now retry moving the worktree changes.
echo ==============================================
pause
