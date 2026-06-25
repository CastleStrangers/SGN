#!/usr/bin/env node
/**
 * scripts/03-reclassify-posts.ts
 * 
 * إعادة تصنيف جميع المقالات باستخدام الذكاء الاصطناعي
 * مفيد عند تحديث نموذج التصنيف أو إضافة فئات جديدة
 * 
 * الاستخدام:
 *   npm run reclassify
 *   npx tsx scripts/03-reclassify-posts.ts
 */

import "dotenv/config"
import { prisma } from "./db"
import { categorizeWithAI } from "../src/lib/sync/categorizer"

async function main() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  🏷️  إعادة تصنيف المقالات`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  const startTime = Date.now()

  try {
    console.log(`📍 جاري جلب المقالات من قاعدة البيانات...`)
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    })

    console.log(`✅ تم جلب ${posts.length} مقالة\n`)
    console.log(`🔄 جاري إعادة التصنيف...\n`)

    let updatedCount = 0
    let unchangedCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const progress = `[${i + 1}/${posts.length}]`
      const title = post.title.slice(0, 40)
      process.stdout.write(`\r${progress} معالجة: ${title}...`)

      // تخطي مقاطع الفيديو من YouTube
      if (post.source === "youtube" || post.videoId) {
        if (post.category !== "فيديوهات") {
          await prisma.post.update({
            where: { id: post.id },
            data: { category: "فيديوهات" },
          })
          updatedCount++
        } else {
          skippedCount++
        }
        continue
      }

      try {
        const articleData = {
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category,
          tags: post.tags ? post.tags.split(",") : [],
        } as any

        const newCategory = await categorizeWithAI(articleData)

        if (newCategory !== post.category) {
          await prisma.post.update({
            where: { id: post.id },
            data: { category: newCategory },
          })
          updatedCount++
          console.log(
            `\n   ✏️  تم التحديث: "${post.category}" → "${newCategory}"`
          )
        } else {
          unchangedCount++
        }
      } catch (err) {
        errorCount++
        const msg = err instanceof Error ? err.message : String(err)
        console.log(`\n   ❌ خطأ في "${post.title.slice(0, 40)}": ${msg}`)
      }
    }

    const totalDuration = (Date.now() - startTime) / 1000

    console.log(`\n\n${"═".repeat(62)}`)
    console.log(`\n📊 نتيجة إعادة التصنيف:`)
    console.log(`   ✏️  تم تحديثها:    ${updatedCount} مقالة`)
    console.log(`   ✅ بدون تغيير:    ${unchangedCount} مقالة`)
    console.log(`   ⏭️  تم تخطيها:    ${skippedCount} مقالة`)
    console.log(`   ❌ أخطاء:        ${errorCount} مقالة`)
    console.log(`   ⏱️  المدة:       ${totalDuration.toFixed(1)} ثانية\n`)

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
