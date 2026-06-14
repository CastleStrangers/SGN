@echo off
chcp 65001 > nul
echo ===================================================
echo   إنشاء اختصار لسكربت تحديث قاعدة البيانات على سطح المكتب
echo ===================================================
echo.

:: Create the shortcut using PowerShell in the background
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Run Turso Update.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0run-turso-update.bat'; $s.WorkingDirectory = '%~dp0'; $s.Save()"

echo [✓] تم إنشاء الاختصار بنجاح على سطح المكتب باسم "Run Turso Update".
echo.
pause
