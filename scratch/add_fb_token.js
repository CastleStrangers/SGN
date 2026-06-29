const { spawn } = require('child_process');
const fs = require('fs');

fs.writeFileSync('vercel-add-log.txt', '');

const cp = spawn('npx.cmd', ['vercel', 'env', 'add', 'FACEBOOK_PAGE_TOKEN', 'production'], { shell: true });

cp.stdout.on('data', d => {
  const str = d.toString();
  fs.appendFileSync('vercel-add-log.txt', 'STDOUT: ' + str + '\n');
  
  if (str.includes("value of FACEBOOK_PAGE_TOKEN")) {
    fs.appendFileSync('vercel-add-log.txt', 'Writing token value...\n');
    cp.stdin.write('EAAOCF9nXIWQBR1meARrMlLoDKmAZCS4VIeQ52Atrr319YAWcKLMzgXdxAGj17gUdGsOqZCp0tSmAxv1AcpYVLBZCj9nrGAOZAEHpXLCqpwXVH1JALfKnhHHhteawXZCtL3vf3CB2VLl2ZBVNgeJFTjCm0ak1CaN2ZAhLUBsG7ZByACmr3cd6JnDEo4B9tzwn82c1Js4GiCxSKkoT7iMVc5Q2T1VNURW8KJjzZCOOSdbFFGWEpl8XsLoyTBegZD\n');
  }
});

cp.stderr.on('data', d => {
  fs.appendFileSync('vercel-add-log.txt', 'STDERR: ' + d.toString() + '\n');
});

setTimeout(() => {
  cp.kill();
  fs.appendFileSync('vercel-add-log.txt', 'FINISHED\n');
}, 6000);
