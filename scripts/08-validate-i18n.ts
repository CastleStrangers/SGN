#!/usr/bin/env node
/**
 * scripts/08-validate-i18n.ts
 * 
 * التحقق من عدم وجود نصوص عربية hardcoded في الكود
 * جميع النصوص يجب أن تمر عبر نظام i18n
 * 
 * الاستخدام:
 *   npm run i18n:check
 *   npx tsx scripts/08-validate-i18n.ts
 */

import { readFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

const srcDir = join(__dirname, "..", "src")
const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

interface Issue {
  file: string
  line: number
  content: string
}

const issues: Issue[] = []

function scanDir(dir: string) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)

    // تخطي المجلدات المستثناة
    if (entry === "node_modules" || entry === ".next" || entry === "messages") {
      continue
    }

    if (statSync(fullPath).isDirectory()) {
      scanDir(fullPath)
    } else if (/\.(ts|tsx)$/.test(entry) && !fullPath.includes("messages")) {
      const content = readFileSync(fullPath, "utf-8")
      const lines = content.split("\n")

      lines.forEach((line, i) => {
        // تخطي التعليقات والـ console logs
        if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
          return
        }

        if (arabicRegex.test(line)) {
          issues.push({
            file: fullPath.replace(srcDir, ""),
            line: i + 1,
            content: line.trim().substring(0, 80),
          })
        }
      })
    }
  }
}

function main() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  🌍 فحص i18n - البحث عن نصوص عربية مباشرة`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  console.log(`📁 فحص المجلد: ${srcDir}\n`)

  scanDir(srcDir)

  if (issues.length === 0) {
    console.log(`✅ لا توجد نصوص عربية مباشرة - رائع!\n`)
    console.log(`${"═".repeat(62)}\n`)
    process.exit(0)
  }

  console.log(`❌ تم العثور على ${issues.length} مشكلة:\n`)

  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.file}:${issue.line}`)
    console.log(`   📝 ${issue.content}...`)
  })

  console.log(`\n${"═".repeat(62)}`)
  console.log(`\n💡 الحل:`)
  console.log(`   1. استخدم مفاتيح i18n بدلاً من النصوص المباشرة`)
  console.log(`   2. أضف النصوص إلى ملف الترجمة messages/ar.json`)
  console.log(`   3. استخدم useTranslations() hook في Components`)
  console.log(`   4. استخدم getTranslations() في Server Components\n`)

  console.log(`مثال:`)
  console.log(`   // ❌ خطأ:`)
  console.log(`   const message = "مرحبا بك";`)
  console.log(`\n   // ✅ صحيح:`)
  console.log(`   const t = useTranslations();`)
  console.log(`   const message = t("hello");\n`)

  process.exit(1)
}

main()
