require('dotenv').config();
const { execSync } = require('child_process');

async function main() {
  console.log("Syncing Turso production database using local Prisma binary...");
  
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!tursoUrl || !tursoToken) {
    console.error("Missing TURSO env variables!");
    return;
  }
  
  let prismaDbUrl = tursoUrl.replace("libsql://", "https://");
  prismaDbUrl = `${prismaDbUrl}?authToken=${tursoToken}`;
  
  console.log("Prisma Target DB URL:", prismaDbUrl.split('?')[0] + '?authToken=***');
  
  try {
    const out = execSync('node node_modules/prisma/build/index.js db push --accept-data-loss', {
      shell: true,
      stdio: 'pipe',
      encoding: 'utf-8',
      env: {
        ...process.env,
        DATABASE_URL: prismaDbUrl
      }
    });
    console.log("TURSO PUSH SUCCESS:\n", out);
  } catch (e) {
    console.error("TURSO PUSH ERROR:\n", e.message);
    if (e.stdout) console.log("STDOUT:\n", e.stdout);
    if (e.stderr) console.error("STDERR:\n", e.stderr);
  }
}

main();
