import { prisma } from "../src/lib/db"

async function main() {
  const targetDate = new Date("2026-05-15T00:00:00Z")
  
  const posts = await prisma.post.findMany({
    where: {
      source: {
        contains: "فيسبوك" // or whatever the source name is for facebook
      },
      createdAt: {
        gte: targetDate
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // If source might not be explicitly "فيسبوك", let's also just check posts generally from that date
  const allPostsSince = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: targetDate
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  console.log("=== نتيجة التحقق من المزامنة ===")
  console.log(`إجمالي الأخبار المضافة منذ 15 مايو 2026: ${allPostsSince.length}`)
  
  if (allPostsSince.length > 0) {
    console.log("\nأحدث 5 أخبار تمت مزامنتها:")
    allPostsSince.slice(0, 5).forEach((p: any, i: number) => {
      console.log(`${i + 1}. [${p.source || 'غير معروف'}] ${p.title} (تاريخ: ${p.createdAt.toISOString().split('T')[0]})`)
    })
  } else {
    console.log("لم يتم العثور على أي أخبار متزامنة منذ هذا التاريخ.")
  }
}

main()
  .catch(e => {
    console.error("حدث خطأ أثناء الاتصال بقاعدة البيانات:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
