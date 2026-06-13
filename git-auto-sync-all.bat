@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo =======================================================
echo   AUTOMATED GIT SYNC and VERCEL DEPLOY (SGN + PARENT)
echo   نظام المزامنة التلقائية والرفع إلى Vercel
echo =======================================================
echo.

:: Create and update desktop shortcuts to ensure they always point to the current correct directory
echo Creating and updating desktop shortcuts...
echo جاري إنشاء وتحديث اختصارات سطح المكتب...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Git Auto Sync.lnk'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.Save()"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Start SGN Server.lnk'); $vbs = [System.IO.Path]::Combine('%~dp0', 'start-server.vbs'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"' + $vbs + '\"'; $s.WorkingDirectory = '%~dp0'; $s.Save()"
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'AI Reclassify News.lnk'); $bat = [System.IO.Path]::Combine('%~dp0', 'run-reclassify.bat'); $s = $ws.CreateShortcut($desktop); $s.TargetPath = $bat; $s.WorkingDirectory = '%~dp0'; $s.Save()"

:: 1. Sync SGN (Child)
echo.
echo [1/3] Syncing SGN repository (مزامنة مستودع SGN)...
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in SGN. Committing...
    git commit -m "auto: commit SGN changes"
    if %errorlevel% neq 0 (
        echo [❌ خطأ] فشل في عمل Commit للتغييرات في SGN.
        pause
        exit /b 1
    )
) else (
    echo - SGN repository is already clean.
)

echo - Pushing SGN changes to origin...
git push origin main
if %errorlevel% neq 0 (
    echo [❌ خطأ] فشل في رفع التغييرات (git push) لمستودع SGN. تأكد من الاتصال بالإنترنت وصلاحيات الوصول.
    pause
    exit /b 1
)

:: 2. Sync Parent
echo.
echo [2/3] Syncing Parent repository (مزامنة المستودع الرئيسي)...
cd ..
git add .
git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo - Changes detected in Parent. Committing...
    git commit -m "auto: sync nested SGN changes to parent repository"
    if %errorlevel% neq 0 (
        echo [❌ خطأ] فشل في عمل Commit للمستودع الرئيسي.
        cd SGN
        pause
        exit /b 1
    )
) else (
    echo - Parent repository is already clean.
)

echo - Pushing Parent changes to origin...
git push origin main
if %errorlevel% neq 0 (
    echo [❌ خطأ] فشل في رفع التغييرات لمستودع Parent.
    cd SGN
    pause
    exit /b 1
)
cd SGN

:: 3. Deploy to Vercel
echo.
echo [3/3] Deploying directly to Vercel staging (الرفع إلى Vercel)...
call vercel --prod
if %errorlevel% neq 0 (
    echo [❌ خطأ] فشل الرفع إلى Vercel. يرجى التحقق من تثبيت Vercel CLI وتسجيل الدخول.
    pause
    exit /b 1
)

:: 4. Open Staging Site Preview
echo.
echo - Opening Staging/Preview website in your browser...
start https://sgn-indol.vercel.app

:: 5. Verification & Auto Exit
echo.
echo =======================================================
echo   SUCCESS: All repositories synced, deployed, and clean!
echo   تمت العملية بنجاح! تم رفع ومزامنة كل شيء.
echo =======================================================
timeout /t 5
