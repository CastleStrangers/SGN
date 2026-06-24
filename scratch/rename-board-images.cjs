/**
 * سكريبت لإعادة تسمية صور مجلس الإدارة من أسماء عربية إلى أسماء إنجليزية
 * وتحديث قاعدة البيانات بالمسارات الجديدة
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// خريطة التسمية: الاسم العربي القديم → الاسم الإنجليزي الجديد
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

const boardDir = path.join(process.cwd(), "public", "images", "board");

// 1. إعادة تسمية الملفات
console.log("=== إعادة تسمية الصور ===");
let renamedCount = 0;
for (const [oldName, newName] of Object.entries(RENAME_MAP)) {
  const oldPath = path.join(boardDir, oldName);
  const newPath = path.join(boardDir, newName);
  
  if (fs.existsSync(oldPath)) {
    if (!fs.existsSync(newPath)) {
      fs.copyFileSync(oldPath, newPath);
      console.log(`✅ نسخ: ${oldName} → ${newName}`);
      renamedCount++;
    } else {
      console.log(`⚠️ موجود مسبقاً: ${newName}`);
      renamedCount++;
    }
  } else {
    console.log(`❌ غير موجود: ${oldName}`);
  }
}
console.log(`\nتم معالجة ${renamedCount} ملف\n`);

// 2. تحديث board-mapping.json
const mappingPath = path.join(process.cwd(), "src", "lib", "board-mapping.json");
const newMapping = {};
const currentMapping = JSON.parse(fs.readFileSync(mappingPath, "utf8"));

for (const [memberName, oldFileName] of Object.entries(currentMapping)) {
  const newFileName = RENAME_MAP[oldFileName] || oldFileName;
  newMapping[memberName] = newFileName;
}

fs.writeFileSync(mappingPath, JSON.stringify(newMapping, null, 2));
console.log("✅ تم تحديث board-mapping.json\n");

// 3. تحديث قاعدة البيانات Turso
async function updateDatabase() {
  const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
  const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim();
  
  if (!tursoUrl || !tursoToken) {
    console.log("❌ متغيرات البيئة TURSO_DATABASE_URL و TURSO_AUTH_TOKEN غير موجودة");
    console.log("حاول تشغيل: set TURSO_DATABASE_URL=... && node scratch/rename-board-images.cjs");
    return;
  }
  
  const client = createClient({ url: tursoUrl, authToken: tursoToken });
  
  console.log("=== تحديث قاعدة البيانات ===");
  
  // قراءة جميع الأعضاء الحاليين
  const result = await client.execute("SELECT id, image FROM BoardMember");
  console.log(`وجدت ${result.rows.length} عضو في قاعدة البيانات`);
  
  let updatedCount = 0;
  for (const row of result.rows) {
    const currentImage = row.image;
    if (!currentImage) continue;
    
    // استخراج اسم الملف من المسار
    const fileName = currentImage.split("/").pop();
    const newFileName = RENAME_MAP[fileName];
    
    if (newFileName) {
      const newImagePath = `/images/board/${newFileName}`;
      await client.execute({
        sql: "UPDATE BoardMember SET image = ? WHERE id = ?",
        args: [newImagePath, row.id],
      });
      console.log(`✅ تحديث: ${currentImage} → ${newImagePath}`);
      updatedCount++;
    }
  }
  
  console.log(`\nتم تحديث ${updatedCount} سجل في قاعدة البيانات`);
  await client.close();
}

// تحميل متغيرات البيئة من .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          const value = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
    console.log("✅ تم تحميل .env.local\n");
  }
}

loadEnv();
updateDatabase().then(() => {
  console.log("\n✅ اكتملت العملية بنجاح!");
}).catch(err => {
  console.error("❌ خطأ في تحديث قاعدة البيانات:", err.message);
});
