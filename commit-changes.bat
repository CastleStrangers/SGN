@echo off
cd /d "%~dp0"
echo Committing SGN script changes to clear workspace...
git add .
git commit -m "chore: remove parent repository sync blocks and update scripts"
echo.
echo SGN Workspace is now clean! You can now retry moving the worktree changes.
echo.
pause
