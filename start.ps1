Set-Location -LiteralPath "D:\I-Ai\App\Syrian community in the Netherlands\SGN"
Write-Host "Starting server on http://localhost:3000/join ..." -ForegroundColor Green
Start-Process "http://localhost:3000/join"
npm run dev
Read-Host "Press Enter to exit"
