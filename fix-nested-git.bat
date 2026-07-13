@echo off
title SGN - Fix Nested Repositories
echo ====================================================
echo   Fixing Nested Git Repositories
echo ====================================================
echo.

set "AWESOME_GIT=awesome-freellm-apis\.git"
set "OMNIROUTE_GIT=OmniRoute\.git"

echo [*] Processing awesome-freellm-apis...
if exist "%AWESOME_GIT%" (
    rmdir /s /q "%AWESOME_GIT%"
    git rm --cached awesome-freellm-apis >nul 2>&1
    echo   - Removed nested .git folder
) else (
    echo   - No nested .git folder found.
)

echo [*] Processing OmniRoute...
if exist "%OMNIROUTE_GIT%" (
    rmdir /s /q "%OMNIROUTE_GIT%"
    git rm --cached OmniRoute >nul 2>&1
    echo   - Removed nested .git folder
) else (
    echo   - No nested .git folder found.
)

echo.
echo [*] Adding all files to the main SGN repository...
git add -A

echo [*] Committing changes...
git commit -m "chore: fix nested git repositories and sync all data"

echo [*] Pushing to GitHub...
git push

echo.
echo [✓] Done! The nested repositories have been merged into the main SGN repository.
echo [!] Please RESTART VS Code (or reload the window) to refresh the Source Control view.
echo.
pause
