# autosync.ps1
# Script to automatically watch SGN directory for any local modifications and instantly push to GitHub & deploy to Vercel

Write-Host "======================================================" -ForegroundColor Green
Write-Host "   Syrian Community Netherlands - Real-time Auto Sync   " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Watching for changes in SGN folder in real-time..." -ForegroundColor Green
Write-Host "Close this window to stop syncing." -ForegroundColor Yellow
Write-Host ""

# Set Location to the SGN root directory
$sgnRoot = (Get-Item "$PSScriptRoot\..\..").FullName
Set-Location -LiteralPath $sgnRoot

# Git sync helper function
function Sync-Changes {
    param($Path)
    
    # Sleep briefly to let file locks release and batch multiple quick saves
    Start-Sleep -Milliseconds 800
    
    # Check if there are actual changes
    $status = git status --porcelain
    if ($status) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Write-Host "[$timestamp] Change detected: $Path" -ForegroundColor Yellow
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
        
        Write-Host "Committing SGN changes..." -ForegroundColor DarkYellow
        git commit -m "auto: sync changes at $timestamp"
        
        Write-Host "Pushing SGN to GitHub..." -ForegroundColor DarkYellow
        git push origin main
        
        Write-Host "Updating client staging link (Vercel deploy)..." -ForegroundColor DarkYellow
        vercel --prod --yes
        
        Write-Host "[$timestamp] Sync & deployment completed successfully!" -ForegroundColor Green
        Write-Host "------------------------------------------------------" -ForegroundColor Gray
    }
}

# Create FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $sgnRoot
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Filter out ignored directories like .git, .next, node_modules
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Ignore changes in node_modules, .next, .git, .vercel, temp files
    if ($path -notmatch '\\(node_modules|\.next|\.git|\.vercel|tsconfig\.tsbuildinfo|pm2.*\.log|pm2.*\.out)\b') {
        Sync-Changes -Path "$($changeType): $path"
    }
}

# Register events
$handlers = @()
$handlers += Register-ObjectEvent $watcher "Changed" -Action $action
$handlers += Register-ObjectEvent $watcher "Created" -Action $action
$handlers += Register-ObjectEvent $watcher "Deleted" -Action $action
$handlers += Register-ObjectEvent $watcher "Renamed" -Action $action

Write-Host "Real-time watcher is active. Saving any file will trigger instant sync & deploy." -ForegroundColor Cyan

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Clean up event handlers on exit
    Write-Host "Stopping event handlers..." -ForegroundColor Red
    foreach ($h in $handlers) {
        Unregister-Event -SourceIdentifier $h.Name
    }
    $watcher.Dispose()
}
