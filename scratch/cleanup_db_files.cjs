const fs = require('fs');
const files = [
  'scratch/check_db_schema.cjs',
  'scratch/push_db.cjs',
  'scratch/run_push.cjs',
  'scripts/check-premium-field.ts',
  'check-db-log.txt',
  'prisma-push-log.txt',
  'push-db-result.txt'
];

files.forEach(f => {
  try {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
      console.log(`Deleted: ${f}`);
    }
  } catch (e) {
    console.error(`Failed to delete ${f}:`, e.message);
  }
});
