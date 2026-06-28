#!/usr/bin/env node
/**
 * scripts/07-diagnose-facebook.ts
 * 
 * تشخيص مشاكل الاتصال بـ Facebook API
 * يفحص التوكن والصلاحيات والاتصالات
 * 
 * الاستخدام:
 *   npx tsx scripts/07-diagnose-facebook.ts
 */

import "dotenv/config"
import fs from "fs"

async function main() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  🔧 تشخيص Facebook API`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  const token = process.env.FACEBOOK_PAGE_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID
  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET

  let output = `🔍 تقرير التشخيص - ${new Date().toISOString()}\n`
  output += `${"═".repeat(62)}\n\n`

  // 1. التحقق من المتغيرات
  console.log(`1️⃣  التحقق من متغيرات البيئة...`)
  output += `متغيرات البيئة:\n`

  if (!token) {
    console.log(`   ❌ FACEBOOK_PAGE_TOKEN غير موجود`)
    output += `   ❌ FACEBOOK_PAGE_TOKEN غير موجود\n`
  } else {
    console.log(`   ✅ FACEBOOK_PAGE_TOKEN موجود`)
    output += `   ✅ FACEBOOK_PAGE_TOKEN موجود\n`
  }

  if (!pageId) {
    console.log(`   ❌ FACEBOOK_PAGE_ID غير موجود`)
    output += `   ❌ FACEBOOK_PAGE_ID غير موجود\n`
  } else {
    console.log(`   ✅ FACEBOOK_PAGE_ID = ${pageId}`)
    output += `   ✅ FACEBOOK_PAGE_ID = ${pageId}\n`
  }

  if (!clientId || !clientSecret) {
    console.log(`   ⚠️  FACEBOOK_CLIENT_ID/SECRET غير موجود`)
    output += `   ⚠️  FACEBOOK_CLIENT_ID/SECRET غير موجود\n`
  } else {
    console.log(`   ✅ FACEBOOK_CLIENT_ID/SECRET موجود`)
    output += `   ✅ FACEBOOK_CLIENT_ID/SECRET موجود\n`
  }

  if (!token) {
    console.log(`\n❌ لا يمكن المتابعة بدون TOKEN\n`)
    process.exit(1)
  }

  output += `\n`

  // 2. اختبار التوكن
  console.log(`\n2️⃣  اختبار توكن الوصول...`)
  try {
    const meRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`
    )
    const meJson = await meRes.json()

    if (meJson.error) {
      console.log(`   ❌ خطأ: ${meJson.error.message}`)
      output += `خطأ في التوكن:\n   ${JSON.stringify(meJson.error, null, 2)}\n`
    } else {
      console.log(`   ✅ التوكن صحيح`)
      console.log(`   معرف الكيان (me): ${meJson.id}`)
      console.log(`   الاسم: ${meJson.name}`)
      output += `التوكن صحيح:\n   معرف الكيان: ${meJson.id}\n   الاسم: ${meJson.name}\n`

      // جلب الصفحات المرتبطة بالتوكن
      console.log(`\n   📄 جلب الصفحات المتاحة لهذا التوكن...`)
      try {
        const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`)
        const accountsJson = await accountsRes.json()
        if (accountsJson.data && accountsJson.data.length > 0) {
          accountsJson.data.forEach((acc: any) => {
            console.log(`      • صفحة: ${acc.name} (ID: ${acc.id})`)
            output += `      • صفحة: ${acc.name} (ID: ${acc.id})\n`
          })
        } else {
          console.log(`      ⚠️ لم يتم العثور على صفحات مرتبطة (قد يكون التوكن مخصص لصفحة واحدة بالفعل)`)
        }
      } catch (e) {}
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log(`   ❌ فشل الاتصال: ${msg}`)
    output += `فشل الاتصال: ${msg}\n`
  }

  output += `\n`

  // 3. اختبار معرف الصفحة
  if (pageId) {
    console.log(`\n3️⃣  اختبار معرف الصفحة...`)
    try {
      const postsRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/posts?limit=1&access_token=${token}`
      )
      const postsJson = await postsRes.json()

      if (postsJson.error) {
        console.log(`   ❌ خطأ: ${postsJson.error.message}`)
        output += `خطأ في معرف الصفحة:\n   ${JSON.stringify(postsJson.error, null, 2)}\n`

        if (postsJson.error.code === 100) {
          console.log(`   💡 تلميح: تحقق من معرف الصفحة`)
          output += `   💡 تلميح: تحقق من معرف الصفحة\n`
        }
      } else {
        console.log(`   ✅ معرف الصفحة صحيح`)
        console.log(`   عدد المنشورات: ${postsJson.data?.length || 0}`)
        output += `معرف الصفحة صحيح:\n   عدد المنشورات: ${postsJson.data?.length || 0}\n`
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.log(`   ❌ فشل الاتصال: ${msg}`)
      output += `فشل الاتصال: ${msg}\n`
    }
  }

  output += `\n`

  // 4. الحلول
  console.log(`\n4️⃣  الحلول المقترحة:\n`)
  output += `الحلول المقترحة:\n`

  const solutions = [
    "تأكد من أن التوكن لم ينته صلاحيته",
    "تحقق من الصلاحيات (يجب أن تكون pages_read_engagement)",
    "تأكد من معرف الصفحة الصحيح (61584301535331)",
    "استخدم Page Access Token بدلاً من User Token",
    "قد تكون الصفحة خاصة أو محظورة جغرافياً",
  ]

  solutions.forEach((sol, i) => {
    console.log(`   ${i + 1}. ${sol}`)
    output += `   ${i + 1}. ${sol}\n`
  })

  console.log(`\n${"═".repeat(62)}\n`)

  // حفظ التقرير
  const logFile = "fb_diagnose_result.txt"
  fs.writeFileSync(logFile, output)
  console.log(`✅ تم حفظ التقرير في: ${logFile}\n`)
}

main()
