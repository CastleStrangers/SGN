const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة من ملف .env يدوياً (لأن dotenv ما هو محمل)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const { PrismaClient } = require('.prisma/client');

async function getPrisma() {
  const { PrismaLibSql } = await import('@prisma/adapter-libsql');

  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
  const dbUrl = (tursoUrl && tursoUrl !== 'undefined' && tursoToken && tursoToken !== 'undefined')
    ? tursoUrl
    : 'file:./prisma/dev.db';

  const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(tursoToken && tursoToken !== 'undefined' ? { authToken: tursoToken } : {}),
  });

  const prisma = new PrismaClient({ adapter });
  console.log(`🔗 متصل بقاعدة البيانات: ${dbUrl.includes('turso') ? 'Turso (إنتاج)' : 'SQLite (محلي)'}`);
  return prisma;
}

async function main() {
  const prisma = await getPrisma();

  console.log('جاري جلب أعضاء مجلس الإدارة من قاعدة البيانات...');
  const members = await prisma.boardMember.findMany();

  if (members.length === 0) {
    console.log('⚠️ لا يوجد أعضاء في قاعدة البيانات المتصلة.');
    return prisma;
  }

  const imageDir = path.join(__dirname, 'public', 'images', 'board');
  if (!fs.existsSync(imageDir)) {
    console.log('⚠️ مجلد الصور غير موجود!');
    return prisma;
  }

  const availableImages = fs.readdirSync(imageDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  let updatedCount = 0;

  for (const member of members) {
    const firstNameEn = (member.nameEn || '').split(' ')[0].toLowerCase();
    const firstNameAr = (member.nameAr || '').split(' ')[0];
    const searchNames = [firstNameEn, ...(firstNameAr ? [firstNameAr] : [])];

    let match = null;
    for (const name of searchNames) {
      match = availableImages.find(img => img.toLowerCase().includes(name));
      if (match) break;
    }

    if (match) {
      const imagePath = `/images/board/${match}`;
      if (member.image !== imagePath) {
        await prisma.boardMember.update({
          where: { id: member.id },
          data: { image: imagePath },
        });
        console.log(`✅ ${member.nameAr} ← ${imagePath}`);
        updatedCount++;
      } else {
        console.log(`⏭️ ${member.nameAr} → صحيحة بالفعل`);
      }
    } else {
      console.log(`❌ ${member.nameAr} → ما لقينا صورة مطابقة`);
    }
  }

  console.log(`\n🎉 تم تحديث ${updatedCount} عضو`);
  return prisma;
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .then(async (prisma) => { await prisma.$disconnect(); });
