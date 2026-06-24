/**
 * سكريبت مباشر لتحديث قاعدة بيانات SQLite المحلية
 * بتغيير مسارات الصور العربية إلى إنجليزية
 */
const { execSync } = require("child_process");
const path = require("path");

const DB_PATH = path.join(process.cwd(), "prisma", "dev.db");

const RENAME_MAP = {
  "لقطة شاشة 2026-06-12 094404.png": "abdulmunim_chaman.png",
  "لقطة شاشة 2026-06-12 094419.png": "saleh_mohamad.png",
  "لقطة شاشة 2026-06-12 094433.png": "khaled_altawil.png",
  "لقطة شاشة 2026-06-12 094448.png": "nehad_sowid.png",
  "لقطة شاشة 2026-06-12 094501.png": "mohammad_semhani.png",
  "لقطة شاشة 2026-06-12 094514.png": "raid_dahmoush.png",
  "لقطة شاشة 2026-06-12 094526.png": "mahmoud_alnaser.png",
  "لقطة شاشة 2026-06-12 094536.png": "huda_alhallak.png",
  "لقطة شاشة 2026-06-12 094552.png": "omar_nwilati.png",
  "لقطة شاشة 2026-06-12 094604.png": "hasan_qutaini.png",
  "لقطة شاشة 2026-06-12 094620.png": "rabaa_alzreqat.png",
  "لقطة شاشة 2026-06-12 094630.png": "akram_aljnidi.png",
  "لقطة شاشة 2026-06-12 094641.png": "nabil_haj_hussein.png",
  "لقطة شاشة 2026-06-12 094656.png": "belal_alrefai.png",
  "لقطة شاشة 2026-06-12 094707.png": "faten_rahhal.png",
  "لقطة شاشة 2026-06-12 094718.png": "feras_abdin.png",
  "لقطة شاشة 2026-06-12 094729.png": "raed_kaakeh.png",
  "لقطة شاشة 2026-06-12 094739.png": "rabe_aljnidi.png",
  "لقطة شاشة 2026-06-12 094748.png": "mahera_tawashi.png",
  "لقطة شاشة 2026-06-12 094759.png": "wassim_hassan.png",
  "لقطة شاشة 2026-06-12 094809.png": "youssef_darwesh.png",
  "لقطة شاشة 2026-06-12 094823.png": "rima_alhrbat.png",
  "لقطة شاشة 2026-06-12 094834.png": "ahmad_alharfi.png",
};

// بناء أوامر SQL
const updates = [];
for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
  const oldPath = `/images/board/${oldName}`;
  const newPath = `/images/board/${newName}`;
  // Escape single quotes for SQL
  const escapedOldPath = oldPath.replace(/'/g, "''");
  const escapedNewPath = newPath.replace(/'/g, "''");
  updates.push(`UPDATE BoardMember SET image = '${escapedNewPath}' WHERE image = '${escapedOldPath}';`);
}

// تشغيل الأوامر عبر SQLite
console.log(`تحديث ${updates.length} سجل في قاعدة البيانات...`);
console.log(`مسار قاعدة البيانات: ${DB_PATH}\n`);

for (const sql of updates) {
  try {
    const result = execSync(`sqlite3 "${DB_PATH}" "${sql.replace(/"/g, '\\"')}"`, {
      encoding: "utf8",
      timeout: 5000,
    });
    const oldPath = sql.match(/WHERE image = '(.+)';/)?.[1] || "";
    const newPath = sql.match(/SET image = '(.+)' WHERE/)?.[1] || "";
    console.log(`✅ ${oldPath.split("/").pop()} → ${newPath.split("/").pop()}`);
  } catch (err) {
    console.log(`❌ فشل: ${err.message.substring(0, 100)}`);
  }
}

// التحقق من النتيجة
try {
  const checkResult = execSync(
    `sqlite3 "${DB_PATH}" "SELECT image FROM BoardMember LIMIT 3;"`,
    { encoding: "utf8" }
  );
  console.log("\n=== نماذج من قاعدة البيانات بعد التحديث ===");
  console.log(checkResult);
} catch (err) {
  console.log("لا يمكن التحقق عبر sqlite3:", err.message.substring(0, 100));
}
