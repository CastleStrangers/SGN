const https = require('https');
const url = 'https://graph.facebook.com/v19.0/me/accounts?access_token=EAAXc2ostbs8BRlhmWYUo82d4d48mmeyGmG2Ma6vsms37kQZA5XTZCuY88A1Yz6BNRKaOEXrCHLa3eKgiSTp2qNZCKHbhHZAUHX1XFx7jLyuIJgLuesbE51A4vjorkPUjZCXtwhf8ipv7xfu7barZAcek6RKv9BDU90gZBksD4x6EtD4yzokWsIoHIA9mmsD1msAehTxrYRoDZBqgNZAya97KK3PryiPF3FYLGZAemmXOga5LZBUCbbPHiIx6Vgl3jyluQeDxeNhXbIZC4bwZAoqhrv1Bt5E9wVlJzoWOIgZBkONqyxx3Vjmiuw0aAgCTCV5ouMTqRjmhIptvSfWVeXsHUhOw7b8AZDZD';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', (err) => console.log('Error: ' + err.message));
