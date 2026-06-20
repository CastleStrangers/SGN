@echo off
cd /d "%~dp0..\.."
echo ==============================================
echo   Git Stash Helper for Worktree Merge
echo ==============================================
echo.
echo This script will stash your current uncommitted changes (like the package.json modifications) 
echo so you can successfully apply/checkout the worktree changes.
echo.
echo Running 'git stash'...
call git stash
echo.
echo Done! The main workspace is now clean.
echo You can now retry moving the worktree changes.
echo.
echo After the worktree changes are applied, you can run:
echo   git stash pop
echo to restore your local changes (like package.json).
echo.
pause
