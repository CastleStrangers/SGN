#!/usr/bin/env node
/**
 * scripts/06-check-database.ts
 * 
 * فحص حالة قاعدة البيانات والمزامنة
 * يعرض إحصائيات مفيدة عن البيانات
 * 
 * الاستخدام:
 *   npx tsx scripts/06-check-database.ts
 */

import "dotenv/config"
import { prisma } from "./db"

async function main() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  🔍 فحص قاعدة البيانات`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  try {
    // إحصائيات المقالات
    const totalPosts = await prisma.post.count()
    const publishedPosts = await prisma.post.count({
      where: { published: true },
    })
    const recentPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // آخر 30 يوم
        },
      },
    })

    // المقالات حسب المصدر
    const postsBySource = await prisma.post.groupBy({
      by: ["source"],
      _count: true,
      orderBy: {
        _count: {
          source: "desc",
        },
      },
    })

    // المقالات حسب الفئة
    const postsByCategory = await prisma.post.groupBy({
      by: ["category"],
      _count: true,
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    })

    // إحصائيات أخرى
    const totalUsers = await prisma.user.count()
    const totalComments = await prisma.comment.count()
    const totalEvents = await prisma.event.count()
    const totalTasks = await prisma.task.count()
    const totalVolunteers = await prisma.volunteer.count()
    const totalContacts = await prisma.contact.count()
    const totalFAQs = await prisma.fAQ.count()
    const totalRegulations = await prisma.regulation.count()
    const totalGuides = await prisma.guide.count()

    console.log(`📊 إحصائيات عامة:\n`)
    console.log(`📄 المقالات:`)
    console.log(`   الإجمالي: ${totalPosts}`)
    console.log(`   منشورة: ${publishedPosts}`)
    console.log(`   آخر 30 يوم: ${recentPosts}`)

    console.log(`\n📍 المقالات حسب المصدر:`)
    postsBySource.forEach((item) => {
      console.log(`   ${item.source || "غير معروف"}: ${item._count} مقالة`)
    })

    console.log(`\n🏷️  المقالات حسب الفئة:`)
    postsByCategory.forEach((item) => {
      console.log(`   ${item.category}: ${item._count} مقالة`)
    })

    console.log(`\n👥 المستخدمون: ${totalUsers}`)
    console.log(`💬 التعليقات: ${totalComments}`)
    console.log(`📅 الفعاليات: ${totalEvents}`)
    console.log(`✅ المهام: ${totalTasks}`)
    console.log(`🙋 المتطوعون: ${totalVolunteers}`)
    console.log(`📧 الرسائل: ${totalContacts}`)
    console.log(`❓ الأسئلة الشائعة: ${totalFAQs}`)
    console.log(`📜 الأنظمة واللوائح: ${totalRegulations}`)
    console.log(`📚 الأدلة الإرشادية: ${totalGuides}`)

    // آخر 5 مقالات
    const latestPosts = await prisma.post.findMany({
      select: {
        title: true,
        source: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    if (latestPosts.length > 0) {
      console.log(`\n📰 آخر 5 مقالات:`)
      latestPosts.forEach((post, i) => {
        const date = post.createdAt.toLocaleDateString("ar-NL")
        console.log(`   ${i + 1}. ${post.title.slice(0, 40)}... (${date})`)
      })
    }

    // تحذيرات
    const unverifiedUsers = await prisma.user.count({
      where: { emailVerified: null },
    })

    const unpublishedPosts = await prisma.post.count({
      where: { published: false },
    })

    console.log(`\n⚠️  التنبيهات:`)
    if (unverifiedUsers > 0) {
      console.log(`   • ${unverifiedUsers} مستخدم لم يتحقق من بريده`)
    }
    if (unpublishedPosts > 0) {
      console.log(`   • ${unpublishedPosts} مقالة غير منشورة`)
    }
    if (postsBySource.length === 0) {
      console.log(`   • لا توجد مقالات مزامنة`)
    }

    console.log(`\n${"═".repeat(62)}\n`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ خطأ في الاتصال بقاعدة البيانات:`)
    console.error(`   ${msg}\n`)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
