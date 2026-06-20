@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
title SGN Git Repair and Diagnostics
cd /d "%~dp0."

echo ======================================================= > git-repair-log.txt
echo   SGN GIT REPAIR AND DIAGNOSTICS LOG >> git-repair-log.txt
echo   Time: %date% %time% >> git-repair-log.txt
echo ======================================================= >> git-repair-log.txt
echo. >> git-repair-log.txt

echo 1. DIAGNOSING SGN (CHILD) REPOSITORY...
echo === SGN STATUS BEFORE REPAIR === >> git-repair-log.txt
git status >> git-repair-log.txt 2>&1

echo 2. ABORTING ANY STUCK REBASES OR MERGES IN SGN...
git rebase --abort >> git-repair-log.txt 2>&1
git merge --abort >> git-repair-log.txt 2>&1

echo 3. REMOVING DATABASE FROM GIT TRACKING (IF COMMITTED)...
git rm --cached -f prisma/dev.db >> git-repair-log.txt 2>&1
git commit -m "chore: untrack local dev.db database file" >> git-repair-log.txt 2>&1

echo 4. PULLING LATEST CODE FOR SGN...
git pull origin main --rebase >> git-repair-log.txt 2>&1

echo === SGN STATUS AFTER REPAIR === >> git-repair-log.txt
git status >> git-repair-log.txt 2>&1
git remote -v >> git-repair-log.txt 2>&1

echo ------------------------------------------------------- >> git-repair-log.txt
echo 5. DIAGNOSING PARENT REPOSITORY...
echo === PARENT STATUS BEFORE REPAIR === >> git-repair-log.txt
cd ..
git status >> SGN\git-repair-log.txt 2>&1

echo 6. ABORTING ANY STUCK REBASES OR MERGES IN PARENT...
git rebase --abort >> SGN\git-repair-log.txt 2>&1
git merge --abort >> SGN\git-repair-log.txt 2>&1

echo 7. PULLING LATEST CODE FOR PARENT...
git pull origin main --rebase >> SGN\git-repair-log.txt 2>&1

echo === PARENT STATUS AFTER REPAIR === >> SGN\git-repair-log.txt
git status >> SGN\git-repair-log.txt 2>&1
git remote -v >> SGN\git-repair-log.txt 2>&1

cd SGN
echo.
echo =======================================================
echo   REPAIR PROCESS COMPLETED!
echo   Please tell the assistant that the log file is ready.
echo =======================================================
pause
