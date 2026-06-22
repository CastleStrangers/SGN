@echo off
chcp 65001 > nul
title إنشاء اختصارات سطح مكتب SGN
cd /d "%~dp0"

echo =======================================================
echo   جاري إنشاء اختصارات سطح المكتب لبيئة عمل SGN المشتركة
echo =======================================================
echo.

:: 1. Create Shortcut for starting the Dev Environment
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Start Dev.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0start-dev-environment.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,24'; $s.Save()"

:: 2. Create Shortcut for Git Auto Sync
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0git-auto-sync-all.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,147'; $s.Save()"

:: 3. Create Shortcut for Git Push & Deploy (New Interactive)
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Push & Deploy.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0git-push-project.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,147'; $s.Save()"

:: 4. Create Shortcut for syncing the Turso Database
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Sync DB (Turso).lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0run-turso-update.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,238'; $s.Save()"

:: 5. Create Shortcut for Mobile App Build & Deploy
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'SGN Mobile Build.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~dp0mobile-build-prod.bat'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,149'; $s.Save()"

echo [✓] تم إنشاء الاختصارات بنجاح على سطح المكتب:
echo.
echo   1. "SGN Start Dev" -> لتشغيل بيئة التطوير (الويب، الموبايل، والمزامنة) بضغطة واحدة.
echo   2. "Git Auto Sync" -> لمزامنة مستودع المشروع التلقائي ونشره فورياً.
echo   3. "SGN Push & Deploy" -> لرفع المشروع تفاعلياً مع إدخال وصف للتعديلات ونشرها.
echo   4. "SGN Mobile Build" -> لتهيئة روابط الإنتاج وبناء تطبيق الموبايل (EAS).
echo   5. "SGN Sync DB (Turso)" -> لتنزيل إعدادات Vercel ومزامنة قاعدة البيانات السحابية.
echo.
echo يمكنك الآن إغلاق النوافذ القديمة واستخدام الاختصارات الجديدة دائماً.
echo.
pause
