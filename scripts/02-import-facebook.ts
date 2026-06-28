#!/usr/bin/env node
/**
 * scripts/02-import-facebook.ts
 * 
 * استيراد تاريخي لمنشورات Facebook
 * يجلب جميع المنشورات منذ تاريخ محدد ويصنفها بالذكاء الاصطناعي
 * 
 * الاستخدام:
 *   npm run import:facebook
 *   npx tsx scripts/02-import-facebook.ts
 */

import "dotenv/config"
import { extractFacebook } from "../src/lib/sync/facebook"
import { categorizeWithAI } from "../src/lib/sync/categorizer"
import { syncArticleToDb } from "../src/lib/sync/db-sync"
import type { SyncSource } from "../src/lib/sync/types"

const SINCE_DATE = new Date("2026-05-14T00:00:00Z")

const SOURCE: SyncSource = {
  name: "facebook-sgn",
  type: "facebook",
  url: "https://www.facebook.com/DeSyrischeGemeenschapInNederland",
  enabled: true,
  category: "أخبار الجالية",
  since: "2026-05-14",
}

async function main() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  📥 استيراد تاريخي من Facebook`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  // التحقق من المتغيرات
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!pageId || !token) {
    console.error(`❌ خطأ: متغيرات البيئة ناقصة\n`)
    console.error(`أضف الأسطر التالية إلى ملف .env:`)
    console.error(`   FACEBOOK_PAGE_ID=61584301535331`)
    console.error(`   FACEBOOK_PAGE_TOKEN=<your_token>\n`)
    console.error(`للحصول على Token:`)
    console.error(`   https://developers.facebook.com/docs/facebook-login/access-tokens\n`)
    process.exit(1)
  }

  console.log(`📅 تاريخ البداية: ${SINCE_DATE.toLocaleDateString("ar-NL")}`)
  console.log(`📄 المصدر: ${SOURCE.url}`)
  console.log(`📍 معرف الصفحة: ${pageId}\n`)

  const startTime = Date.now()

  try {
    console.log(`⬇️  جاري جلب المنشورات من Facebook API...`)
    const articles = await extractFacebook(SOURCE, SINCE_DATE)

    console.log(`✅ تم جلب ${articles.length} منشور\n`)

    if (articles.length === 0) {
      console.log(`⚠️  لم يتم العثور على منشورات. تحقق من:`)
      console.log(`   1. صلاحية الـ Token (يحتاج pages_read_engagement)`)
      console.log(`   2. صحة FACEBOOK_PAGE_ID`)
      console.log(`   3. وجود منشورات بعد التاريخ: 2026-05-14\n`)
      process.exit(0)
    }

    console.log(`🏷️  جاري تصنيف وحفظ المنشورات...\n`)

    let newCount = 0
    let skipCount = 0
    let errorCount = 0

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      const progress = `[${i + 1}/${articles.length}]`
      const title = article.title.slice(0, 50)
      process.stdout.write(`\r${progress} معالجة: ${title}...`)

      try {
        const category = await categorizeWithAI(article)
        const result = await syncArticleToDb(article, category)

        if (result.status === "new") {
          newCount++
        } else {
          skipCount++
        }
      } catch (err) {
        errorCount++
        const msg = err instanceof Error ? err.message : String(err)
        console.log(
          `\n   ❌ خطأ في "${article.title.slice(0, 40)}": ${msg}`
        )
      }
    }

    const totalDuration = (Date.now() - startTime) / 1000

    console.log(`\n\n${"═".repeat(62)}`)
    console.log(`\n📊 نتيجة الاستيراد:`)
    console.log(`   ✅ جديد:     ${newCount} مقالة`)
    console.log(`   ⏭️  موجود:   ${skipCount} مقالة`)
    console.log(`   ❌ أخطاء:   ${errorCount} مقالة`)
    console.log(`   ⏱️  الوقت:   ${totalDuration.toFixed(1)} ثانية\n`)

    if (newCount > 0) {
      console.log(`🎉 تم استيراد ${newCount} منشور جديد بنجاح!`)
      console.log(`📍 عرضها على: http://localhost:3000/news\n`)
    }

    console.log(`${"═".repeat(62)}\n`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ فشل الاستيراد:`)
    console.error(`   ${msg}\n`)

    if (msg.includes("190") || msg.includes("invalid token")) {
      console.error(`🔑 مشكلة في التوكن. الحل:`)
      console.error(`   1. جدد التوكن من Meta Developers`)
      console.error(`   2. تأكد من صلاحية pages_read_engagement`)
      console.error(`   3. استخدم Page Access Token\n`)
    }

    process.exit(1)
  }
}

main()
