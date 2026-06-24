/**
 * تحديث صور أعضاء مجلس الإدارة في قاعدة البيانات المحلية
 * باستخدام Prisma + LibSQL
 */
const path = require("path");
const fs = require("fs");

// تحميل متغيرات البيئة
function loadEnv() {
  const files = [".env.local", ".env"];
  for (const file of files) {
    const envPath = path.join(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const rawValue = trimmed.substring(eqIdx + 1).trim();
            const value = rawValue.replace(/^["']|["']$/g, "");
            if (!process.env[key]) process.env[key] = value;
          }
        }
      }
    }
  }
}
loadEnv();

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

async function main() {
  const { createClient } = require("@libsql/client");
  
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  // تحويل "file:./prisma/dev.db" إلى مسار مطلق
  const isRelative = dbUrl.startsWith("file:./") || dbUrl.startsWith("file:prisma");
  const absoluteUrl = isRelative 
    ? "file:" + path.join(process.cwd(), dbUrl.replace("file:", ""))
    : dbUrl;
  
  console.log(`الاتصال بقاعدة البيانات: ${absoluteUrl}`);
  
  const client = createClient({ url: absoluteUrl });
  
  // قراءة الأعضاء الحاليين
  const result = await client.execute("SELECT id, image FROM BoardMember");
  console.log(`\nوجد ${result.rows.length} عضو في قاعدة البيانات\n`);
  
  let updatedCount = 0;
  for (const row of result.rows) {
    const currentImage = row.image;
    if (!currentImage) continue;
    
    // استخراج اسم الملف من المسار
    const parts = currentImage.split("/");
    const fileName = parts[parts.length - 1];
    const newFileName = RENAME_MAP[fileName];
    
    if (newFileName) {
      const newImagePath = `/images/board/${newFileName}`;
      await client.execute({
        sql: "UPDATE BoardMember SET image = ? WHERE id = ?",
        args: [newImagePath, row.id],
      });
      console.log(`✅ ${fileName} → ${newFileName}`);
      updatedCount++;
    } else {
      console.log(`⏩ تجاهل: ${fileName}`);
    }
  }
  
  console.log(`\n✅ تم تحديث ${updatedCount} سجل`);
  
  // التحقق
  const check = await client.execute("SELECT image FROM BoardMember LIMIT 5");
  console.log("\nنماذج بعد التحديث:");
  for (const row of check.rows) {
    console.log("  -", row.image);
  }
  
  await client.close();
}

main().catch(console.error);
