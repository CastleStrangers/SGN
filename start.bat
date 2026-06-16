@echo off
cd /d "E:\I-Ai\App\Syrian community in the Netherlands\SGN"
echo Starting SGN server...
echo Open http://localhost:3000 in your browser after 30 seconds
echo.
npx next dev -p 3000 --webpack
pause
