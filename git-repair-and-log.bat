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

echo 1. CLEANING SGN (CHILD) REPOSITORY...
echo - Aborting any rebase or merge... >> git-repair-log.txt
call git rebase --abort >> git-repair-log.txt 2>&1
call git merge --abort >> git-repair-log.txt 2>&1

echo - Hard resetting local changes... >> git-repair-log.txt
call git reset --hard HEAD >> git-repair-log.txt 2>&1

echo - Checking out main branch... >> git-repair-log.txt
call git checkout main >> git-repair-log.txt 2>&1

echo - Pulling latest main branch code... >> git-repair-log.txt
call git pull origin main >> git-repair-log.txt 2>&1

echo - Untracking dev.db if needed... >> git-repair-log.txt
call git rm --cached -f prisma/dev.db >> git-repair-log.txt 2>&1
call git commit -m "chore: untrack local dev.db database file" >> git-repair-log.txt 2>&1
call git push origin main >> git-repair-log.txt 2>&1

echo === SGN STATUS AFTER REPAIR === >> git-repair-log.txt
call git status >> git-repair-log.txt 2>&1
call git remote -v >> git-repair-log.txt 2>&1

echo ------------------------------------------------------- >> git-repair-log.txt
echo 2. CLEANING PARENT REPOSITORY...
cd ..
echo - Aborting any rebase or merge in Parent... >> SGN\git-repair-log.txt 2>&1
call git rebase --abort >> SGN\git-repair-log.txt 2>&1
call git merge --abort >> SGN\git-repair-log.txt 2>&1

echo - Hard resetting Parent repository... >> SGN\git-repair-log.txt 2>&1
call git reset --hard HEAD >> SGN\git-repair-log.txt 2>&1

echo - Checking out main branch in Parent... >> SGN\git-repair-log.txt 2>&1
call git checkout main >> SGN\git-repair-log.txt 2>&1

echo - Pulling latest main branch in Parent... >> SGN\git-repair-log.txt 2>&1
call git pull origin main >> SGN\git-repair-log.txt 2>&1
call git push origin main >> SGN\git-repair-log.txt 2>&1

echo === PARENT STATUS AFTER REPAIR === >> SGN\git-repair-log.txt
call git status >> SGN\git-repair-log.txt 2>&1
call git remote -v >> SGN\git-repair-log.txt 2>&1

cd SGN
echo.
echo =======================================================
echo   REPAIR PROCESS COMPLETED!
echo   Please tell the assistant that the log file is ready.
echo =======================================================
pause
