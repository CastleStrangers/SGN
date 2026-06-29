const fs = require('fs');
const path = require('path');
const localAppData = process.env.LOCALAPPDATA;
const authPath = path.join(localAppData, 'com.vercel.cli', 'auth.json');
if (fs.existsSync(authPath)) {
  const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  console.log("Token exists:", !!auth.token);
  fs.writeFileSync('vercel-token.txt', auth.token || '');
} else {
  console.log("Auth file not found at", authPath);
}
