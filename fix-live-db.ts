import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log("==========================================")
  console.log("جاري الاتصال بقاعدة البيانات الحية للموقع...")
  console.log("==========================================")
  
  const envPath = path.join(process.cwd(), ".env.production")
  if (!fs.existsSync(envPath)) {
    console.error("❌ ملف .env.production غير موجود!")
    return
  }

  const envProd = fs.readFileSync(envPath, "utf8")
  const urlMatch = envProd.match(/TURSO_DATABASE_URL=([^\r\n]+)/)
  const tokenMatch = envProd.match(/TURSO_AUTH_TOKEN=([^\r\n]+)/)

  if (!urlMatch || !tokenMatch) {
    console.error("❌ لم يتم العثور على بيانات Turso في الملف!")
    return
  }

  const adapter = new PrismaLibSql({
    url: urlMatch[1],
    authToken: tokenMatch[1]
  })
  
  const prisma = new PrismaClient({ adapter })

  console.log("✅ تم الاتصال بنجاح. جاري إصلاح الأقسام...")

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

    console.log("==========================================")
    console.log("🎉 تم الإصلاح بالكامل! تفقد الموقع الآن.")
    console.log("==========================================")
  } catch (error) {
    console.error("❌ حدث خطأ:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
