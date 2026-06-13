# autosync.ps1
# Script to automatically watch SGN directory and push changes to GitHub every 60 seconds

$Interval = 60 # time in seconds to check for changes

Write-Host "======================================================" -ForegroundColor Green
Write-Host "   Syrian Community Netherlands - Git Auto Sync       " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Watching for changes in SGN folder..." -ForegroundColor Green
Write-Host "Checking every $Interval seconds. Close this window to stop syncing." -ForegroundColor Yellow
Write-Host ""

# Set Cwd to the SGN directory
Set-Location -LiteralPath $PSScriptRoot

while ($true) {
    # Check if there are any changes (modified, deleted, or untracked files)
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "[$timestamp] Changes detected in files:" -ForegroundColor Yellow
        Write-Host $status -ForegroundColor Gray
        
        Write-Host "Staging changes..." -ForegroundColor DarkYellow
        git add .
        
        # Force add sensitive environment variables if present
        if (Test-Path ".env") {
            git add -f .env
        }
        if (Test-Path ".env.local") {
            git add -f .env.local
        }
        
        Write-Host "Committing changes..." -ForegroundColor DarkYellow
        git commit -m "auto: sync changes at $timestamp"
        
        Write-Host "Pushing to GitHub..." -ForegroundColor DarkYellow
        git push origin main
        
        Write-Host "[$timestamp] Sync completed successfully!" -ForegroundColor Green
        Write-Host "------------------------------------------------------" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds $Interval
}
