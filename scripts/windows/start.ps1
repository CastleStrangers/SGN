Set-Location -LiteralPath $PSScriptRoot
Write-Host "Starting server on http://localhost:3000 ..." -ForegroundColor Green
Start-Process "http://localhost:3000"
npm run dev
Read-Host "Press Enter to exit"
