@echo off
cd /d "%~dp0..\.."
echo Running diagnostics... > git-diag-results.txt
echo ==================================== >> git-diag-results.txt
echo CURRENT DIRECTORY >> git-diag-results.txt
cd >> git-diag-results.txt
echo ==================================== >> git-diag-results.txt
echo GIT STATUS SGN >> git-diag-results.txt
git status >> git-diag-results.txt 2>&1
echo ==================================== >> git-diag-results.txt
echo GIT WORKTREE LIST SGN >> git-diag-results.txt
git worktree list >> git-diag-results.txt 2>&1
echo ==================================== >> git-diag-results.txt
echo GIT BRANCH SGN >> git-diag-results.txt
git branch -a >> git-diag-results.txt 2>&1
echo Diagnostics complete! >> git-diag-results.txt
echo Diagnostic details written to git-diag-results.txt
pause
