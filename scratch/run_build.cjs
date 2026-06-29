const { execSync } = require('child_process');
try {
  console.log('Running build...');
  const out = execSync('npm run build', { shell: true, stdio: 'pipe', encoding: 'utf-8' });
  console.log('BUILD STDOUT:\n', out);
} catch (e) {
  console.error('ERROR:\n', e.message);
  if (e.stdout) console.log('STDOUT:\n', e.stdout);
  if (e.stderr) console.error('STDERR:\n', e.stderr);
}
