param($Port = 3010)
$env:NODE_ENV = "production"
npx next start -p $Port
