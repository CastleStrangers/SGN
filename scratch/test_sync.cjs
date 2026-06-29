const https = require('https');
const fs = require('fs');

const data = JSON.stringify({});
const options = {
  hostname: 'sgn-indol.vercel.app',
  path: '/api/sync',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'x-cron-secret': 'sgn-cron-secret-2026'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const result = `Status: ${res.statusCode}\n\n${body}`;
    fs.writeFileSync('sync-result.txt', result);
    console.log('Status:', res.statusCode);
    console.log('Body:', body.substring(0, 500));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  fs.writeFileSync('sync-result.txt', 'Error: ' + e.message);
});

req.write(data);
req.end();
