#!/usr/bin/env node
/**
 * scripts/04-reset-and-sync.ts
 * 
 * حذف جميع المقالات وإعادة مزامنة البيانات من الأول
 * مفيد عند التطوير أو الاختبار
 * 
 * ⚠️  تحذير: هذا سيحذف جميع المقالات والتعليقات والمفضلات!
 * 
 * الاستخدام:
 *   npm run db:reset-sync
 *   npx tsx scripts/04-reset-and-sync.ts
 */

import "dotenv/config"
import { prisma } from "./db"
import { runSync } from "../src/lib/sync"

async function confirmReset(): Promise<boolean> {
  if (process.env.SKIP_CONFIRMATION === "true") {
    return true
  }

  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  ⚠️  تحذير: سيتم حذف جميع المقالات!`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)
  console.log(`هذا الإجراء سيحذف:`)
  console.log(`   • جميع المقالات`)
  console.log(`   • جميع التعليقات`)
  console.log(`   • جميع المفضلات`)
  console.log(`   • جميع البيانات المرتبطة\n`)

  // للتطوير فقط، لا توجد واجهة تفاعلية
  console.log(`⚠️  في الإنتاج، استخدم: SKIP_CONFIRMATION=true\n`)

  return true
}

async function main() {
  const shouldContinue = await confirmReset()
  if (!shouldContinue) {
    console.log(`❌ تم الإلغاء\n`)
    process.exit(0)
  }

  const startTime = Date.now()

  try {
    console.log(`🧹 جاري حذف المقالات من قاعدة البيانات...`)
    const deleteResult = await prisma.post.deleteMany()

    console.log(`✅ تم حذف ${deleteResult.count} مقالة\n`)

    console.log(`🔄 جاري تشغيل المزامنة لجلب البيانات الحقيقية...`)
    const results = await runSync()

    let totalNew = 0
    let totalSkipped = 0
    let totalErrors = 0
    let totalFetched = 0

    for (const r of results) {
      totalFetched += r.fetched
      totalNew += r.new
      totalSkipped += r.skipped
      totalErrors += r.errors.length

      const status = r.success ? "✅" : "❌"
      console.log(
        `\n${status} المصدر: ${r.source}\n   المجلوب: ${r.fetched} | جديد: ${r.new} | موجود: ${r.skipped} | أخطاء: ${r.errors.length}`
      )

      if (r.errors.length > 0) {
        r.errors.forEach((e) => console.log(`     ❌ ${e}`))
      }
    }

    const totalDuration = (Date.now() - startTime) / 1000

    console.log(`\n${"═".repeat(62)}`)
    console.log(`\n📊 النتيجة النهائية:`)
    console.log(`   🗑️  حذف:       ${deleteResult.count} مقالة قديمة`)
    console.log(`   ✅ جديد:      ${totalNew} مقالة`)
    console.log(`   ⏭️  موجود:    ${totalSkipped} مقالة`)
    console.log(`   ❌ أخطاء:     ${totalErrors}`)
    console.log(`   ⏱️  الوقت:    ${totalDuration.toFixed(1)} ثانية\n`)

    console.log(`🎉 اكتملت العملية بنجاح!`)
    console.log(`📍 عرض البيانات على: http://localhost:3001/news\n`)

    console.log(`${"═".repeat(62)}\n`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ فشل الإجراء:`)
    console.error(`   ${msg}\n`)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
