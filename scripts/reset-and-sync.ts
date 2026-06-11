import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { runSync } from "../src/lib/sync"

const prisma = new PrismaClient()

async function main() {
  console.log("\n🧹 جاري حذف المقالات التجريبية من قاعدة البيانات...")
  
  // حذف كافة المقالات (سيتم حذف التعليقات والمفضلات المرتبطة تلقائياً بفضل Cascade Delete)
  const deleteResult = await prisma.post.deleteMany()
  
  console.log(`✅ تم حذف ${deleteResult.count} مقالة تجريبية بنجاح.`)
  
  console.log("\n🔄 جاري تشغيل المزامنة لجلب البيانات الحقيقية من فيسبوك والموقع الرسمي للجالية...")
  const start = Date.now()
  
  try {
    const results = await runSync()
    for (const r of results) {
      console.log(
        `🔹 [المصدر: ${r.source}] النجاح: ${r.success ? "نعم" : "لا"} | ` +
        `المجلوب: ${r.fetched} | جديد: ${r.new} | تم تخطيه: ${r.skipped} | ` +
        `أخطاء: ${r.errors.length} | المدة: ${r.duration}ms`
      )
      if (r.errors.length > 0) {
        for (const e of r.errors) {
          console.error(`  ❌ خطأ: ${e}`)
        }
      }
    }
    console.log(`\n🎉 اكتملت المزامنة بنجاح في ${((Date.now() - start) / 1000).toFixed(1)} ثانية!`)
  } catch (err) {
    console.error("\n❌ فشل تشغيل المزامنة:", err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
