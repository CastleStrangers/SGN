const { spawn } = require('child_process');
const fs = require('fs');

fs.writeFileSync('vercel-add-interactive.txt', '');

const cp = spawn('npx.cmd', ['vercel', 'env', 'add', 'FACEBOOK_PAGE_TOKEN', 'production'], { shell: true });

cp.stdout.on('data', d => {
  const str = d.toString();
  fs.appendFileSync('vercel-add-interactive.txt', 'STDOUT: ' + str + '\n');
  
  if (str.includes("value of FACEBOOK_PAGE_TOKEN")) {
    fs.appendFileSync('vercel-add-interactive.txt', 'Writing token value...\n');
    cp.stdin.write('EAAOCF9nXIWQBR1meARrMlLoDKmAZCS4VIeQ52Atrr319YAWcKLMzgXdxAGj17gUdGsOqZCp0tSmAxv1AcpYVLBZCj9nrGAOZAEHpXLCqpwXVH1JALfKnhHHhteawXZCtL3vf3CB2VLl2ZBVNgeJFTjCm0ak1CaN2ZAhLUBsG7ZByACmr3cd6JnDEo4B9tzwn82c1Js4GiCxSKkoT7iMVc5Q2T1VNURW8KJjzZCOOSdbFFGWEpl8XsLoyTBegZD\n');
  }
  
  if (str.includes("already exists") || str.includes("override") || str.includes("Overwriting")) {
    fs.appendFileSync('vercel-add-interactive.txt', 'Confirming override...\n');
    cp.stdin.write('y\n');
  }
});

cp.stderr.on('data', d => {
  fs.appendFileSync('vercel-add-interactive.txt', 'STDERR: ' + d.toString() + '\n');
});

setTimeout(() => {
  cp.kill();
  fs.appendFileSync('vercel-add-interactive.txt', 'FINISHED\n');
}, 10000);
