const https = require('https');
const fs = require('fs');

// Get env variables from process.env
const VERCEL_OIDC_TOKEN = process.env.VERCEL_OIDC_TOKEN;

// First, let's find the env var ID
const projectId = 'prjGwsJPWl2DXG1iIgtgUUbmcxtuMDl';
const teamId = 'team_zxRyJLdrgNv0yuaFrxdSxKCz';

const options = {
  hostname: 'api.vercel.com',
  path: `/v9/projects/${projectId}/env?teamId=${teamId}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${VERCEL_OIDC_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      fs.writeFileSync('vercel-api-env-list.txt', JSON.stringify(result, null, 2));
      console.log('Status:', res.statusCode);
      if (result.envs) {
        const fbToken = result.envs.find(e => e.key === 'FACEBOOK_PAGE_TOKEN');
        if (fbToken) {
          console.log('Found FACEBOOK_PAGE_TOKEN:', JSON.stringify(fbToken, null, 2));
          fs.writeFileSync('fb-token-id.txt', fbToken.id);
        } else {
          console.log('FACEBOOK_PAGE_TOKEN not found');
        }
      }
    } catch (e) {
      console.error('Parse error:', e.message);
      fs.writeFileSync('vercel-api-env-list.txt', data);
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
