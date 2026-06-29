const { spawn } = require('child_process');
const fs = require('fs');

const logFile = 'vercel-add-log-direct.txt';
fs.writeFileSync(logFile, '');

const cp = spawn('npx.cmd', ['vercel', 'env', 'add', 'FACEBOOK_PAGE_TOKEN', 'production'], { shell: true });

cp.stdout.on('data', d => {
  const str = d.toString();
  fs.appendFileSync(logFile, 'STDOUT: ' + str + '\n');
  
  if (str.includes("value of FACEBOOK_PAGE_TOKEN") || str.includes("value")) {
    fs.appendFileSync(logFile, 'Writing token value...\n');
    cp.stdin.write('EAAOCF9nXIWQBR1meARrMlLoDKmAZCS4VIeQ52Atrr319YAWcKLMzgXdxAGj17gUdGsOqZCp0tSmAxv1AcpYVLBZCj9nrGAOZAEHpXLCqpwXVH1JALfKnhHHhteawXZCtL3vf3CB2VLl2ZBVNgeJFTjCm0ak1CaN2ZAhLUBsG7ZByACmr3cd6JnDEo4B9tzwn82c1Js4GiCxSKkoT7iMVc5Q2T1VNURW8KJjzZCOOSdbFFGWEpl8XsLoyTBegZD\n');
  }
});

cp.stderr.on('data', d => {
  fs.appendFileSync(logFile, 'STDERR: ' + d.toString() + '\n');
});

setTimeout(() => {
  cp.kill();
  fs.appendFileSync(logFile, 'FINISHED\n');
}, 6000);
