const { spawn } = require('child_process');
const fs = require('fs');

const TOKEN = 'EAAOCF9nXIWQBR1meARrMlLoDKmAZCS4VIeQ52Atrr319YAWcKLMzgXdxAGj17gUdGsOqZCp0tSmAxv1AcpYVLBZCj9nrGAOZAEHpXLCqpwXVH1JALfKnhHHhteawXZCtL3vf3CB2VLl2ZBVNgeJFTjCm0ak1CaN2ZAhLUBsG7ZByACmr3cd6JnDEo4B9tzwn82c1Js4GiCxSKkoT7iMVc5Q2T1VNURW8KJjzZCOOSdbFFGWEpl8XsLoyTBegZD';
const logFile = 'vercel-add-new.txt';
fs.writeFileSync(logFile, '');

const cp = spawn('npx.cmd', ['vercel', 'env', 'add', 'FACEBOOK_PAGE_TOKEN', 'production'], { shell: true });

let writtenToken = false;
let writtenSensitive = false;

function handleData(d) {
  const str = d.toString();
  fs.appendFileSync(logFile, str);
  
  if (!writtenToken && str.includes("FACEBOOK_PAGE_TOKEN")) {
    writtenToken = true;
    fs.appendFileSync(logFile, '\n[Sending token...]\n');
    setTimeout(() => cp.stdin.write(TOKEN + '\n'), 300);
  }
  
  if (!writtenSensitive && str.includes("sensitive")) {
    writtenSensitive = true;
    fs.appendFileSync(logFile, '\n[Sending y for sensitive...]\n');
    setTimeout(() => cp.stdin.write('y\n'), 300);
  }
}

cp.stdout.on('data', handleData);
cp.stderr.on('data', handleData);

cp.on('close', (code) => {
  fs.appendFileSync(logFile, `\n[DONE with code ${code}]\n`);
});

setTimeout(() => {
  cp.kill();
  fs.appendFileSync(logFile, '\n[TIMEOUT]\n');
}, 12000);
