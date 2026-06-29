const fs = require('fs');
const files = [
  'scratch/test_api_directly.cjs',
  'scratch/alter_table_sqlite.cjs',
  'scripts/alter-db.ts',
  'api-test-log.txt',
  'alter-db-log.txt',
  'check-db-log.txt'
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
