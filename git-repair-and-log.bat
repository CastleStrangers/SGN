@echo off\r
chcp 65001 > nul\r
setlocal enabledelayedexpansion\r
title SGN Git Repair and Diagnostics\r
cd /d "%~dp0"\r
\r
echo ======================================================= > git-repair-log.txt\r
echo   SGN GIT REPAIR AND DIAGNOSTICS LOG >> git-repair-log.txt\r
echo   Time: %date% %time% >> git-repair-log.txt\r
echo ======================================================= >> git-repair-log.txt\r
echo. >> git-repair-log.txt\r
\r
echo 1. DIAGNOSING SGN (CHILD) REPOSITORY...\r
echo === SGN STATUS BEFORE REPAIR === >> git-repair-log.txt\r
git status >> git-repair-log.txt 2>&1\r
\r
echo 2. ABORTING ANY STUCK REBASES OR MERGES IN SGN...\r
git rebase --abort >> git-repair-log.txt 2>&1\r
git merge --abort >> git-repair-log.txt 2>&1\r
\r
echo 3. REMOVING DATABASE FROM GIT TRACKING (IF COMMITTED)...\r
git rm --cached -f prisma/dev.db >> git-repair-log.txt 2>&1\r
git commit -m "chore: untrack local dev.db database file" >> git-repair-log.txt 2>&1\r
\r
echo 4. PULLING LATEST CODE FOR SGN...\r
git pull origin main --rebase >> git-repair-log.txt 2>&1\r
\r
echo === SGN STATUS AFTER REPAIR === >> git-repair-log.txt\r
git status >> git-repair-log.txt 2>&1\r
git remote -v >> git-repair-log.txt 2>&1\r
\r
echo ------------------------------------------------------- >> git-repair-log.txt\r
echo 5. DIAGNOSING PARENT REPOSITORY...\r
echo === PARENT STATUS BEFORE REPAIR === >> git-repair-log.txt\r
cd ..\r
git status >> SGN\git-repair-log.txt 2>&1\r
\r
echo 6. ABORTING ANY STUCK REBASES OR MERGES IN PARENT...\r
git rebase --abort >> SGN\git-repair-log.txt 2>&1\r
git merge --abort >> SGN\git-repair-log.txt 2>&1\r
\r
echo 7. PULLING LATEST CODE FOR PARENT...\r
git pull origin main --rebase >> SGN\git-repair-log.txt 2>&1\r
\r
echo === PARENT STATUS AFTER REPAIR === >> SGN\git-repair-log.txt\r
git status >> SGN\git-repair-log.txt 2>&1\r
git remote -v >> SGN\git-repair-log.txt 2>&1\r
\r
cd SGN\r
echo.\r
echo =======================================================\r
echo   REPAIR PROCESS COMPLETED!\r
echo   Please tell the assistant that the log file is ready.\r
echo =======================================================\r
pause\r
