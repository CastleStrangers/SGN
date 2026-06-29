const { spawn } = require('child_process');
const fs = require('fs');

fs.writeFileSync('vercel-rm-interactive.txt', '');

const cp = spawn('npx.cmd', ['vercel', 'env', 'rm', 'FACEBOOK_PAGE_TOKEN'], { shell: true });

cp.stdout.on('data', d => {
  fs.appendFileSync('vercel-rm-interactive.txt', 'STDOUT: ' + d.toString() + '\n');
});

cp.stderr.on('data', d => {
  fs.appendFileSync('vercel-rm-interactive.txt', 'STDERR: ' + d.toString() + '\n');
});

setTimeout(() => {
  cp.stdin.write('y\n');
}, 3000);

setTimeout(() => {
  cp.kill();
  fs.appendFileSync('vercel-rm-interactive.txt', 'FINISHED\n');
}, 6000);
