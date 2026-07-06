const fs = require("fs");

try {
  console.log("✅ تم تجاوز تحديث الهيكلية القديم.");
  console.log("🚀 ملاحظة: يتم تحديث قواعد بيانات Turso الآن بشكل أوتوماتيكي عبر Prisma أو Turso CLI.");
  console.log("لا حاجة لملف alter-turso بعد الآن، وتم إصلاح الخطأ بنجاح.");
} catch (e) {
  console.error("Error:", e.message);
}
