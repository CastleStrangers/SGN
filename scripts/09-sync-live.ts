/**
 * scripts/09-sync-live.ts
 * يجبر النظام على الاتصال بقاعدة البيانات الحية (Turso) 
 * وجلب أحدث الأخبار لكي يراها العميل فوراً.
 */
import * as dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Force production flags so src/lib/db.ts connects to Turso
process.env.NODE_ENV = "production"
process.env.VERCEL = "1"

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load the live environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.production") })

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error("❌ خطأ: لم يتم العثور على مفاتيح Turso في ملف .env.production")
  process.exit(1)
}

async function main() {
  const startTime = Date.now()
  console.log(`🔄 جاري الاتصال بالموقع المباشر وجلب أحدث الأخبار...`)

  // Import dynamically after env is set to ensure it uses production DB
  const { prisma } = await import("../src/lib/db")
  const { runSync } = await import("../src/lib/sync")

  try {
    const results = await runSync()
    let totalNew = 0, totalSkipped = 0, totalErrors = 0
    
    for (const r of results) {
      totalNew += r.new
      totalSkipped += r.skipped
      totalErrors += r.errors.length
      const status = r.success ? "✅" : "❌"
      console.log(` ${status} ${r.source}: مجلوب (${r.fetched}) | جديد (${r.new}) | موجود (${r.skipped})`)
    }

    const totalDuration = (Date.now() - startTime) / 1000
    console.log(`\n🎉 اكتملت المزامنة بنجاح في ${totalDuration.toFixed(1)} ثانية!`)
    console.log(`📍 الأخبار الآن ظاهرة على: https://sgn-indol.vercel.app/news`)
  } catch (err) {
    console.error(`\n❌ فشل الإجراء:`, err)
    process.exit(1)
  } finally {
    if (prisma) await prisma.$disconnect()
  }
}

main()
