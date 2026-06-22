import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── تحميل .env ───
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    let k = t.slice(0, i).trim(), v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
const isTurso = !!(tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined");

const db = createClient({
  url: isTurso ? tursoUrl : "file:./prisma/dev.db",
  ...(isTurso ? { authToken: tursoToken } : {}),
});

console.log(`🔗 ${isTurso ? "Turso (إنتاج)" : "SQLite (محلي)"}`);

const result = await db.execute("SELECT id, nameAr, nameEn, image FROM board_members ORDER BY createdAt");
if (result.rows.length === 0) {
  console.log("⚠️ ما في أعضاء في قاعدة البيانات");
  process.exit(0);
}

const imageDir = path.join(__dirname, "public", "images", "board");
if (!fs.existsSync(imageDir)) {
  console.log("⚠️ مجلد الصور غير موجود");
  process.exit(0);
}

const availableImages = fs.readdirSync(imageDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
let updated = 0;

for (const row of result.rows) {
  const id = row.id;
  const nameAr = String(row.nameAr || "");
  const nameEn = String(row.nameEn || "");
  const currentImage = String(row.image || "");
  const firstNameEn = nameEn.split(" ")[0].toLowerCase();
  const firstNameAr = nameAr.split(" ")[0];

  let match = availableImages.find(f => f.toLowerCase().includes(firstNameEn));
  if (!match) match = availableImages.find(f => f.toLowerCase().includes(firstNameAr));

  if (match) {
    const imagePath = `/images/board/${match}`;
    if (currentImage !== imagePath) {
      await db.execute({
        sql: "UPDATE board_members SET image = ? WHERE id = ?",
        args: [imagePath, id],
      });
      console.log(`✅ ${nameAr} ← ${match}`);
      updated++;
    } else {
      console.log(`⏭️ ${nameAr} → صحيحة`);
    }
  } else {
    console.log(`❌ ${nameAr} → ما لقينا صورة`);
  }
}

console.log(`\n🎉 تم تحديث ${updated} عضو`);
