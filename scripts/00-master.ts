#!/usr/bin/env node
/**
 * scripts/00-master.ts
 * 
 * السكريبت الجامع الرئيسي
 * يجمع جميع الأوامر المتاحة في مكان واحد سهل الاستخدام
 * 
 * الاستخدام:
 *   npm run master
 *   npx tsx scripts/00-master.ts
 *   npx tsx scripts/00-master.ts [command]
 * 
 * الأوامر المتاحة:
 *   sync              - مزامنة Facebook (01)
 *   import            - استيراد تاريخي (02)
 *   reclassify        - إعادة تصنيف (03)
 *   reset             - إعادة تعيين (04)
 *   users             - إدارة المستخدمين (05)
 *   check-db          - فحص قاعدة البيانات (06)
 *   diagnose          - تشخيص Facebook (07)
 *   i18n              - التحقق من i18n (08)
 *   menu              - عرض القائمة التفاعلية
 */

import "dotenv/config"
import { spawn } from "child_process"
import * as readline from "readline"

interface MenuItem {
  id: string
  name: string
  description: string
  script: string
  command?: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "🔄 مزامنة Facebook",
    description: "مزامنة مستمرة لمنشورات Facebook",
    script: "01-sync-facebook.ts",
    command: "sync",
  },
  {
    id: "2",
    name: "📥 استيراد تاريخي",
    description: "استيراد جميع المنشورات التاريخية",
    script: "02-import-facebook.ts",
    command: "import:facebook",
  },
  {
    id: "3",
    name: "🏷️  إعادة تصنيف",
    description: "إعادة تصنيف المقالات باستخدام الذكاء الاصطناعي",
    script: "03-reclassify-posts.ts",
    command: "reclassify",
  },
  {
    id: "4",
    name: "🧹 إعادة تعيين",
    description: "حذف البيانات وإعادة المزامنة من الأول",
    script: "04-reset-and-sync.ts",
    command: "db:reset-sync",
  },
  {
    id: "5",
    name: "👤 إدارة المستخدمين",
    description: "عرض وإدارة المستخدمين والأدوار",
    script: "05-manage-users.ts",
  },
  {
    id: "6",
    name: "🔍 فحص قاعدة البيانات",
    description: "فحص صحة قاعدة البيانات والإحصائيات",
    script: "06-check-database.ts",
    command: "check-db",
  },
  {
    id: "7",
    name: "🔧 تشخيص Facebook",
    description: "تشخيص مشاكل الاتصال بـ Facebook API",
    script: "07-diagnose-facebook.ts",
    command: "diagnose-fb",
  },
  {
    id: "8",
    name: "🌍 التحقق من i18n",
    description: "التحقق من التزام الكود بـ i18n",
    script: "08-validate-i18n.ts",
    command: "i18n:check",
  },
]

function showHeader() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║                                                            ║`)
  console.log(`║       🎯 السكريبت الجامع - SY-NL Platform Master        ║`)
  console.log(`║                                                            ║`)
  console.log(`║           اختر السكريبت الذي تريد تشغيله                ║`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)
}

function showMenu() {
  console.log(`📋 الأوامر المتاحة:\n`)

  MENU_ITEMS.forEach((item) => {
    console.log(`  ${item.id}. ${item.name}`)
    console.log(`     📝 ${item.description}`)
    if (item.command) {
      console.log(`     🚀 npm run ${item.command}`)
    }
    console.log()
  })

  console.log(`  0. ❌ خروج\n`)
}

function showHelp() {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`)
  console.log(`║  📖 مساعدة السكريبت الجامع                              ║`)
  console.log(`╚════════════════════════════════════════════════════════════╝\n`)

  console.log(`الاستخدام:\n`)
  console.log(`  • بدون معاملات (عرض القائمة التفاعلية):`)
  console.log(`    npx tsx scripts/00-master.ts`)
  console.log(`    npm run master\n`)

  console.log(`  • مع اسم الأمر (تشغيل مباشر):`)
  console.log(`    npx tsx scripts/00-master.ts sync`)
  console.log(`    npx tsx scripts/00-master.ts import`)
  console.log(`    npx tsx scripts/00-master.ts reclassify\n`)

  console.log(`الأوامر المختصرة:\n`)
  MENU_ITEMS.forEach((item) => {
    const shortcut = item.command
      ? item.command.split(":")[0]
      : `${item.id}`
    console.log(`  npx tsx scripts/00-master.ts ${shortcut} → ${item.name}`)
  })

  console.log(`\nأوامر إضافية:\n`)
  console.log(`  npx tsx scripts/00-master.ts help   → عرض هذه المساعدة`)
  console.log(`  npx tsx scripts/00-master.ts list   → عرض قائمة الأوامر`)
  console.log(`  npx tsx scripts/00-master.ts menu   → عرض القائمة التفاعلية\n`)
}

async function runScript(script: string) {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", `scripts/${script}`], {
      stdio: "inherit",
      cwd: process.cwd(),
    })

    child.on("close", (code) => {
      resolve(code)
    })
  })
}

async function runNpmScript(command: string) {
  return new Promise((resolve) => {
    const child = spawn("npm", ["run", command], {
      stdio: "inherit",
      cwd: process.cwd(),
    })

    child.on("close", (code) => {
      resolve(code)
    })
  })
}

async function interactiveMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve)
    })
  }

  showHeader()
  showMenu()

  while (true) {
    const choice = await question(`اختر رقماً (0-${MENU_ITEMS.length}): `)

    if (choice === "0") {
      console.log(`\n👋 شكراً لاستخدام SY-NL Platform!\n`)
      rl.close()
      break
    }

    const item = MENU_ITEMS.find((m) => m.id === choice)

    if (!item) {
      console.log(`\n❌ اختيار غير صحيح. حاول مجدداً.\n`)
      continue
    }

    console.log(`\n✅ تشغيل: ${item.name}\n`)
    console.log(`${"═".repeat(60)}\n`)

    if (item.command) {
      await runNpmScript(item.command)
    } else {
      await runScript(item.script)
    }

    console.log(`\n${"═".repeat(60)}\n`)

    const again = await question(`هل تريد تشغيل أمر آخر؟ (y/n): `)
    if (again.toLowerCase() !== "y") {
      console.log(`\n👋 شكراً!\n`)
      rl.close()
      break
    }

    showHeader()
    showMenu()
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]?.toLowerCase()

  if (!command) {
    // عرض القائمة التفاعلية
    await interactiveMenu()
    return
  }

  if (command === "help" || command === "-h" || command === "--help") {
    showHelp()
    return
  }

  if (command === "list" || command === "menu") {
    showHeader()
    showMenu()
    return
  }

  // البحث عن السكريبت
  let item: MenuItem | undefined

  // البحث برقم
  item = MENU_ITEMS.find((m) => m.id === command)

  // البحث باسم الأمر
  if (!item) {
    item = MENU_ITEMS.find(
      (m) => m.command?.startsWith(command) || m.script.startsWith(command)
    )
  }

  // البحث بالاسم
  if (!item) {
    item = MENU_ITEMS.find((m) =>
      m.name.toLowerCase().includes(command)
    )
  }

  if (!item) {
    console.log(`\n❌ أمر غير معروف: ${command}\n`)
    console.log(`اكتب: npx tsx scripts/00-master.ts help\n`)
    process.exit(1)
  }

  console.log(`\n✅ تشغيل: ${item.name}\n`)
  console.log(`${"═".repeat(60)}\n`)

  if (item.command) {
    await runNpmScript(item.command)
  } else {
    await runScript(item.script)
  }

  console.log(`\n${"═".repeat(60)}\n`)
}

main().catch((err) => {
  console.error(`\n❌ خطأ:`)
  console.error(err)
  process.exit(1)
})
