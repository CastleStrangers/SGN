@echo off
echo ===================================================
echo [1/3] Downloading production variables from Vercel...
echo ===================================================
call npx vercel env pull --environment=production .env.production

echo ===================================================
echo [2/3] Extracting and updating Turso credentials...
echo ===================================================
powershell -Command "$envContent = Get-Content .env; $newEnv = $envContent | Where-Object { $_ -notmatch 'TURSO_DATABASE_URL' -and $_ -notmatch 'TURSO_AUTH_TOKEN' }; $tursoVars = Get-Content .env.production | Select-String -Pattern 'TURSO_DATABASE_URL','TURSO_AUTH_TOKEN' | ForEach-Object { $_.Line }; Set-Content -Path .env -Value ($newEnv + $tursoVars) -Encoding utf8"

echo ===================================================
echo [3/3] Running database schema update...
echo ===================================================
call node scripts/alter-turso.cjs

echo ===================================================
echo Done! Please reload the mobile app to verify.
echo ===================================================
pause
