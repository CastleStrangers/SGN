@echo off
title SGN - Repair Git Sync
echo ====================================================
echo   Repairing SGN Git Sync (Nested Repository Conflict)
echo ====================================================
echo.

:: Get parent directory path
set "PARENT_DIR=%~dp0.."
set "PARENT_GIT=%PARENT_DIR%\.git"

if exist "%PARENT_GIT%" (
    echo [!] Found accidental .git folder in the parent directory:
    echo     %PARENT_GIT%
    echo.
    echo [*] Removing the accidental parent .git folder...
    
    :: Remove the directory recursively
    rmdir /s /q "%PARENT_GIT%"
    
    if exist "%PARENT_GIT%" (
        echo ❌ Failed to remove parent .git. Please delete the folder manually:
        echo    %PARENT_GIT%
    ) else (
        echo.
        echo [✓] Success! The accidental parent .git folder has been deleted.
        echo.
        echo Now VS Code will only track the actual SGN repository.
        echo.
        echo [!] IMPORTANT: Please restart VS Code to apply the changes.
    )
) else (
    echo [✓] No parent .git folder found. The conflict might already be resolved.
)

echo.
pause
