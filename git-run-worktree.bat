@echo off
git worktree list > git-worktree-info.txt
echo ==================================== >> git-worktree-info.txt
echo CURRENT BRANCH >> git-worktree-info.txt
git branch -a >> git-worktree-info.txt
echo ==================================== >> git-worktree-info.txt
echo GIT STATUS SGN >> git-worktree-info.txt
git status >> git-worktree-info.txt
echo ==================================== >> git-worktree-info.txt
echo GIT STATUS PARENT >> git-worktree-info.txt
cd ..
git status >> SGN\git-worktree-info.txt 2>&1
echo Done! Worktree and branch info written to git-worktree-info.txt
