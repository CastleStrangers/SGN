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

// ─── تحميل board-mapping.json ───
const mappingPath = path.join(__dirname, "src", "lib", "board-mapping.json");
const nameToFile = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));

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

let updated = 0;

for (const row of result.rows) {
  const id = row.id;
  const nameAr = String(row.nameAr || "");
  const nameEn = String(row.nameEn || "");
  const currentImage = String(row.image || "");

  // بحث بالـ mapping جاهز
  const filename = nameToFile[nameEn];
  if (filename) {
    const imagePath = `/images/board/${filename}`;
    if (currentImage !== imagePath) {
      await db.execute({
        sql: "UPDATE board_members SET image = ? WHERE id = ?",
        args: [imagePath, id],
      });
      console.log(`✅ ${nameAr} ← ${filename}`);
      updated++;
    } else {
      console.log(`⏭️ ${nameAr} → صحيحة`);
    }
  } else {
    console.log(`❌ ${nameAr} → ما لقينا اسم مطابق بالمفينج`);
  }
}

console.log(`\n🎉 تم تحديث ${updated} عضو`);
