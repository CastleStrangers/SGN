#!/usr/bin/env node
/**
 * scripts/01-sync-facebook.ts
 * 
 * المزامنة التلقائية لمنشورات Facebook
 * يجلب أحدث المنشورات من صفحة الجالية ويضيفها لقاعدة البيانات
 * 
 * الاستخدام:
 *   npm run sync
 *   npx tsx scripts/01-sync-facebook.ts
 * 
 * الجدول الزمني (Cron):
 *   كل ساعة في الدقيقة 0: 0 * * * *
 */

import "dotenv/config"
import { runSync } from "../src/lib/sync"
import { execSync } from "child_process"

interface SyncResult {
  source: string
  success: boolean
  fetched: number
  new: number
  skipped: number
  errors: string[]
  duration: number
}

async function main() {
  const timestamp = new Date().toISOString()
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  🔄 بدء المزامنة من Facebook - ${timestamp}`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  const startTime = Date.now()

  try {
    // تشغيل المزامنة
    const results: SyncResult[] = await runSync()

    // عرض النتائج
    console.log(`\n📊 نتائج المزامنة:`)
    console.log(`${"─".repeat(62)}`)

    let totalFetched = 0
    let totalNew = 0
    let totalSkipped = 0
    let totalErrors = 0

    for (const r of results) {
      totalFetched += r.fetched
      totalNew += r.new
      totalSkipped += r.skipped
      totalErrors += r.errors.length

      const status = r.success ? "✅" : "❌"
      console.log(`\n${status} المصدر: ${r.source}`)
      console.log(`   المجلوب: ${r.fetched} | جديد: ${r.new} | موجود: ${r.skipped}`)
      console.log(`   الأخطاء: ${r.errors.length} | الوقت: ${r.duration}ms`)

      if (r.errors.length > 0) {
        console.log(`   الأخطاء التفصيلية:`)
        r.errors.forEach((e) => console.log(`     • ${e}`))
      }
    }

    const totalDuration = Date.now() - startTime

    console.log(`\n${"─".repeat(62)}`)
    console.log(`\n📈 الإجمالي:`)
    console.log(`   ✅ جديد: ${totalNew} مقالة`)
    console.log(`   ⏭️  موجود: ${totalSkipped} مقالة`)
    console.log(`   ❌ أخطاء: ${totalErrors}`)
    console.log(`   ⏱️  المدة الإجمالية: ${(totalDuration / 1000).toFixed(1)} ثانية\n`)

    if (totalNew > 0) {
      console.log(`🎉 تم إضافة ${totalNew} مقالة جديدة بنجاح!`)
      console.log(`📍 عرضها على: http://localhost:3000/news\n`)
    }

    // إعادة تشغيل التطبيق لاستقبال الملفات الجديدة
    console.log(`🔄 إعادة تشغيل التطبيق...`)
    try {
      execSync("npx pm2 restart sy-nl", { stdio: "inherit", timeout: 15000 })
      console.log(`✅ تم إعادة تشغيل التطبيق بنجاح\n`)
    } catch {
      console.log(`⚠️  لم يتمكن من إعادة تشغيل PM2 (قد لا يكون مثبت)\n`)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ فشل الإجراء:`)
    console.error(`   ${errorMsg}\n`)
    process.exit(1)
  }
}

main()
