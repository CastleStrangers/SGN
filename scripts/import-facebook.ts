/**
 * scripts/import-facebook.ts
 * سكريبت الاستيراد التاريخي لمنشورات صفحة الفيسبوك
 *
 * يجلب جميع المنشورات من صفحة الجالية السورية في هولندا
 * منذ 14 مايو 2026 حتى اليوم ويحفظها في قاعدة البيانات.
 *
 * تشغيل: npx tsx scripts/import-facebook.ts
 * أو:    npm run import:facebook
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
  console.log("\n🔵 سكريبت استيراد منشورات الفيسبوك")
  console.log("=".repeat(50))
  console.log(`📅 جلب المنشورات منذ: ${SINCE_DATE.toLocaleDateString("ar-NL")}`)
  console.log(`📄 المصدر: ${SOURCE.url}`)
  console.log("")

  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!pageId || !token) {
    console.error("❌ خطأ: FACEBOOK_PAGE_ID أو FACEBOOK_PAGE_TOKEN غير محددَين في .env")
    console.error("   أضف الأسطر التالية إلى ملف .env:")
    console.error("   FACEBOOK_PAGE_ID=61584301535331")
    console.error("   FACEBOOK_PAGE_TOKEN=<your_token>")
    process.exit(1)
  }

  const start = Date.now()

  try {
    console.log("⬇️  جلب المنشورات من Facebook Graph API...")
    const articles = await extractFacebook(SOURCE, SINCE_DATE)

    console.log(`✅ تم جلب ${articles.length} منشور`)
    if (articles.length === 0) {
      console.log("\n⚠️  لم يتم العثور على منشورات. تحقق من:")
      console.log("   1. صلاحية الـ Token (يحتاج pages_read_engagement)")
      console.log("   2. صحة FACEBOOK_PAGE_ID")
      console.log("   3. تاريخ البداية (2026-05-14)")

      // Try to get a new token with proper permissions
      console.log("\n📋 للحصول على Token بصلاحيات كاملة:")
      console.log(
        "   https://www.facebook.com/v19.0/dialog/oauth?client_id=1490681598681536&redirect_uri=https://localhost:3001&scope=pages_read_engagement&response_type=token"
      )
      process.exit(0)
    }

    console.log("\n🏷️  تصنيف وحفظ المنشورات...")

    let newCount = 0
    let skipCount = 0
    let errorCount = 0

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      process.stdout.write(`\r   [${i + 1}/${articles.length}] معالجة: ${article.title.slice(0, 50)}...`)

      try {
        // التصنيف
        const category = await categorizeWithAI(article)

        // الحفظ في قاعدة البيانات
        const result = await syncArticleToDb(article, category)

        if (result.status === "new") {
          newCount++
        } else {
          skipCount++
        }
      } catch (err) {
        errorCount++
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`\n   ❌ خطأ في "${article.title.slice(0, 40)}": ${msg}`)
      }
    }

    const duration = ((Date.now() - start) / 1000).toFixed(1)

    console.log("\n\n" + "=".repeat(50))
    console.log("📊 نتيجة الاستيراد:")
    console.log(`   ✅ جديد:     ${newCount} مقالة`)
    console.log(`   ⏭️  موجود:   ${skipCount} مقالة`)
    console.log(`   ❌ أخطاء:   ${errorCount} مقالة`)
    console.log(`   ⏱️  الوقت:   ${duration} ثانية`)
    console.log("=".repeat(50))

    if (newCount > 0) {
      console.log(`\n🎉 تم استيراد ${newCount} منشور جديد بنجاح!`)
      console.log("   يمكن عرضها على: http://localhost:3001/news")
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("\n❌ فشل الاستيراد:", msg)

    if (msg.includes("190") || msg.includes("invalid token") || msg.includes("OAuthException")) {
      console.error("\n🔑 مشكلة في التوكن. الحلول:")
      console.error("   1. تجديد التوكن من Meta Developers")
      console.error("   2. التأكد من صلاحية pages_read_engagement")
      console.error("   3. استخدام Page Access Token بدلاً من User Token")
    }

    process.exit(1)
  }
}

main()
