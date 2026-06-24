/**
 * سكريبت لتحديث مسارات صور أعضاء مجلس الإدارة في قاعدة البيانات المحلية
 * عبر استدعاء API مباشرة
 */
const https = require("http");

// خريطة التحديث: اسم الملف العربي القديم → الاسم الإنجليزي الجديد
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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("JSON parse error: " + data.substring(0, 200))); }
      });
    }).on("error", reject);
  });
}

async function main() {
  // جلب جميع أعضاء مجلس الإدارة من API
  console.log("جلب أعضاء مجلس الإدارة...");
  const members = await fetchJson("http://localhost:3000/api/board");
  console.log(`وجد ${members.length} عضو\n`);
  
  for (const member of members) {
    const currentImage = member.image || "";
    // استخراج اسم الملف
    const fileName = currentImage.split("/").pop();
    const newFileName = RENAME_MAP[fileName];
    
    if (!newFileName) {
      console.log(`⏩ تجاهل: ${member.nameEn} (${fileName || "لا توجد صورة"})`);
      continue;
    }
    
    const newImagePath = `/images/board/${newFileName}`;
    console.log(`🔄 تحديث: ${member.nameEn}`);
    console.log(`   من: ${currentImage}`);
    console.log(`   إلى: ${newImagePath}`);
    
    // تحديث عبر PATCH API
    const updateData = JSON.stringify({ image: newImagePath });
    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: "localhost",
        port: 3000,
        path: `/api/board/${member.id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(updateData),
        },
      }, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
          catch (e) { resolve({ status: res.statusCode, body: data }); }
        });
      });
      req.on("error", reject);
      req.write(updateData);
      req.end();
    });
    
    if (result.status === 200) {
      console.log(`   ✅ تم\n`);
    } else {
      console.log(`   ❌ فشل (${result.status}): ${JSON.stringify(result.body)}\n`);
    }
  }
  
  console.log("✅ اكتملت العملية!");
}

main().catch(console.error);
