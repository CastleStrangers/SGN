import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import fs from 'fs'
import path from 'path'

async function updateDb(prisma: any, name: string) {
  console.log(`\n--- جاري تحديث قاعدة البيانات: ${name} ---`)
  try {
    const nos = await prisma.post.updateMany({
      where: { source: 'nos-netherlands' },
      data: { category: 'أخبار هولندا' }
    })
    console.log(`✅ تم نقل ${nos.count} خبر إلى قسم "أخبار هولندا"`)

    const euro = await prisma.post.updateMany({
      where: { source: 'euronews-europe' },
      data: { category: 'أخبار أوروبا' }
    })
    console.log(`✅ تم نقل ${euro.count} خبر إلى قسم "أخبار أوروبا"`)

    const econ = await prisma.post.updateMany({
      where: { source: 'euronews-business' },
      data: { category: 'اقتصاد' }
    })
    console.log(`✅ تم نقل ${econ.count} خبر إلى قسم "اقتصاد"`)

    const cul = await prisma.post.updateMany({
      where: { source: 'euronews-culture' },
      data: { category: 'ثقافيات' }
    })
    console.log(`✅ تم نقل ${cul.count} خبر إلى قسم "ثقافيات"`)
  } catch (err) {
    console.error(`❌ خطأ أثناء تحديث ${name}:`, err)
  }
}

async function main() {
  console.log("==========================================")
  console.log("جاري إصلاح جميع قواعد البيانات (المحلية والحية)...")
  console.log("==========================================")
  
  // 1. Local Database
  const localPrisma = new PrismaClient()
  await updateDb(localPrisma, "المحلية (Localhost)")
  await localPrisma.$disconnect()

  // 2. Live Database
  const envPath = path.join(process.cwd(), ".env.production")
  if (!fs.existsSync(envPath)) {
    console.error("❌ ملف .env.production غير موجود! لا يمكن الاتصال بالقاعدة الحية.")
    return
  }

  const envProd = fs.readFileSync(envPath, "utf8")
  const urlMatch = envProd.match(/TURSO_DATABASE_URL=([^\r\n]+)/)
  const tokenMatch = envProd.match(/TURSO_AUTH_TOKEN=([^\r\n]+)/)

  if (!urlMatch || !tokenMatch) {
    console.error("❌ لم يتم العثور على بيانات Turso في الملف!")
    return
  }

  const { createClient } = await import('@libsql/client')
  const client = createClient({
    url: urlMatch[1],
    authToken: tokenMatch[1]
  })
  const adapter = new PrismaLibSql(client)
  
  const livePrisma = new PrismaClient({ adapter })
  await updateDb(livePrisma, "الحية (Turso)")
  await livePrisma.$disconnect()

  console.log("\n==========================================")
  console.log("🎉 تم الإصلاح بالكامل للموقعين!")
  console.log("==========================================")
}

main()
