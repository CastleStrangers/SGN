@echo off
echo ==============================================
echo   Syncing SGN changes to Parent Repository
echo ==============================================
echo.
echo Moving up to the parent directory...
cd /d "%~dp0..\..\.."
echo Current Git repository info:
git status
echo.
echo 1. Adding all SGN changes to parent Git...
git add SGN
echo.
echo 2. Committing changes in parent repository...
git commit -m "sync: commit latest SGN changes in parent repository"
echo.
echo 3. Parent Git status check:
git status
echo.
echo Done! The parent repository's main branch should now be clean.
echo You can now retry moving the worktree changes.
echo.
pause
