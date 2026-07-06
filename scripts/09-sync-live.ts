/**
 * scripts/09-sync-live.ts
 * يرسل أمر مزامنة مباشر إلى واجهة برمجة الموقع الحي (API)
 * لكي يقوم الموقع بجلب الأخبار وتخزينها في قاعدة بياناته الحية فوراً.
 */
import * as dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// جلب مفتاح الأمان السري من ملف .env المحلي
dotenv.config({ path: path.resolve(__dirname, "../.env") })

async function main() {
  console.log(`\n======================================================`)
  console.log(`🔄 جاري الاتصال بالموقع المباشر لإصدار أمر المزامنة...`)
  console.log(`======================================================\n`)

  const cronSecret = process.env.CRON_SECRET || "sgn-cron-secret-2026"
  
  try {
    const res = await fetch("https://sgn-indol.vercel.app/api/sync", {
      method: "POST",
      headers: {
        "x-cron-secret": cronSecret,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
    
    if (res.ok) {
       const data = await res.json()
       let totalNew = 0, totalSkipped = 0
       
       if (data.results) {
         for (const r of data.results) {
           totalNew += r.new
           totalSkipped += r.skipped
           const status = r.success ? "✅" : "❌"
           console.log(` ${status} ${r.source}: مجلوب (${r.fetched}) | جديد (${r.new}) | موجود (${r.skipped})`)
         }
       }
       
       console.log(`\n🎉 اكتملت المزامنة بنجاح! تم إضافة ${totalNew} خبر جديد على الموقع الحي.`)
       console.log(`📍 الأخبار الآن ظاهرة للعميل على: https://sgn-indol.vercel.app/news\n`)
    } else {
       console.error(`\n❌ فشل الاتصال بالموقع الحي. (الرمز: ${res.status})`)
       console.error(`الرد من الخادم:`, await res.text())
       console.log(`\n⚠️ ملاحظة: تأكد من إضافة المتغير CRON_SECRET بقيمة sgn-cron-secret-2026 في لوحة تحكم Vercel.`)
    }
  } catch(err) {
     console.error("\n❌ حدث خطأ غير متوقع أثناء الاتصال بالموقع:", err)
  }
}

main()
