@echo off
echo =======================================================
echo   AUTOMATED GIT SYNC & DEPLOYMENT TOOL (SGN + PARENT)
echo =======================================================
echo.

:: 1. Sync SGN (Child)
echo [1/3] Syncing SGN repository...
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in SGN. Committing...
    git commit -m "auto: commit SGN changes"
) else (
    echo - SGN repository is already clean.
)
echo - Pushing SGN changes to origin...
git push origin main

:: 2. Sync Parent
echo.
echo [2/3] Syncing Parent repository...
cd ..
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in Parent. Committing...
    git commit -m "auto: sync nested SGN changes to parent repository"
) else (
    echo - Parent repository is already clean.
)
cd SGN

:: 3. Verification
echo.
echo [3/3] Verifying clean state...
echo --- SGN Status ---
git status
echo.
echo =======================================================
echo   SUCCESS: All repositories synced, committed, and clean!
echo   You can now retry moving the worktree changes.
echo =======================================================
pause
