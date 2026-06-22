const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'alter-turso.cjs',
  'check-all-posts.ts',
  'check-arabic.ts',
  'check-db.ts',
  'check-image-sizes.ts',
  'check_posts_details.js',
  'create-settings-table.cjs',
  'diagnose-fb-new.ts',
  'diagnose-fb.ts',
  'facebook_debug_images.ts',
  'find-page-id.ts',
  'fix-board-images.cjs',
  'generate-docs-pdf.js',
  'generate-docs-pdf.ts',
  'generate-project-pdf-en.mjs',
  'generate-project-pdf.js',
  'generate-project-pdf.ts',
  'get-page-token.cjs',
  'import-facebook.ts',
  'list-sqlite-users.ts',
  'list-users.ts',
  'promote-user.ts',
  'push-turso.cjs',
  'reclassify.ts',
  'reset-and-sync.ts',
  'scrape_debug.ts',
  'seed-board.ts',
  'sync.ts',
  'test-chrome-channel.ts',
  'test-firefox.ts',
  'test-mbasic.ts',
  'test_blob_upload.ts'
];

const scriptsDir = path.join(__dirname);

let deletedCount = 0;
let errorCount = 0;

console.log('🧹 جاري بدء عملية تنظيف السكريبتات المكررة والقديمة...\n');

filesToDelete.forEach(file => {
  const filePath = path.join(scriptsDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ تم حذف: ${file}`);
      deletedCount++;
    } catch (err) {
      console.error(`❌ فشل حذف ${file}:`, err.message);
      errorCount++;
    }
  } else {
    console.log(`ℹ️ الملف غير موجود بالفعل: ${file}`);
  }
});

console.log(`\n🎉 اكتملت العملية!`);
console.log(`   تم حذف ${deletedCount} ملف بنجاح.`);
if (errorCount > 0) {
  console.log(`   واجهنا مشاكل في حذف ${errorCount} ملف.`);
}
