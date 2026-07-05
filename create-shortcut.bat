@echo off
title SGN - Create Desktop Shortcut
echo ===================================================
echo   Creating SGN Control Panel Desktop Shortcut...
echo ===================================================
echo.

set "WORKSPACE_DIR=%~dp0"
if "%WORKSPACE_DIR:~-1%"=="\" set "WORKSPACE_DIR=%WORKSPACE_DIR:~0,-1%"

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Control Panel.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%WORKSPACE_DIR%\sgn.bat'; $s.WorkingDirectory = '%WORKSPACE_DIR%'; $s.IconLocation = 'shell32.dll,24'; $s.Save()"

echo.
echo [✓] Done! Please check your desktop for the 'SGN Control Panel' shortcut.
echo.
pause
