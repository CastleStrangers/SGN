#!/usr/bin/env node
/**
 * scripts/05-manage-users.ts
 * 
 * إدارة المستخدمين - عرض وترقية وحذف
 * 
 * الاستخدام:
 *   npx tsx scripts/05-manage-users.ts list              # عرض جميع المستخدمين
 *   npx tsx scripts/05-manage-users.ts promote <email>  # ترقية لـ admin
 *   npx tsx scripts/05-manage-users.ts demote <email>   # خفض من admin
 *   npx tsx scripts/05-manage-users.ts delete <email>   # حذف مستخدم
 */

import "dotenv/config"
import { prisma } from "../src/lib/db"

async function listUsers() {
  console.log(`\n${"═".repeat(62)}`)
  console.log(`📋 قائمة المستخدمين`)
  console.log(`${"═".repeat(62)}\n`)

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  if (users.length === 0) {
    console.log(`❌ لا توجد مستخدمين\n`)
    return
  }

  console.log(`${users.length} مستخدم:\n`)
  users.forEach((user: any, i: number) => {
    const roleEmoji = user.role === "admin" ? "👑" : "👤"
    console.log(`${i + 1}. ${roleEmoji} ${user.email}`)
    console.log(
      `   الاسم: ${user.name || "غير محدد"} | الدور: ${user.role}`
    )
    console.log(`   تاريخ التسجيل: ${user.createdAt.toLocaleDateString("ar-NL")}`)
    console.log()
  })

  console.log(`${"═".repeat(62)}\n`)
}

async function promoteUser(email: string) {
  console.log(`\n🔄 جاري ترقية ${email} إلى admin...`)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log(`❌ المستخدم غير موجود\n`)
    return
  }

  if (user.role === "admin") {
    console.log(`⚠️  المستخدم بالفعل admin\n`)
    return
  }

  await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  })

  console.log(`✅ تم ترقية ${email} إلى admin\n`)
}

async function demoteUser(email: string) {
  console.log(`\n🔄 جاري خفض ${email} من admin...`)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log(`❌ المستخدم غير موجود\n`)
    return
  }

  if (user.role !== "admin") {
    console.log(`⚠️  المستخدم ليس admin\n`)
    return
  }

  await prisma.user.update({
    where: { email },
    data: { role: "member" },
  })

  console.log(`✅ تم خفض ${email} إلى member\n`)
}

async function deleteUser(email: string) {
  console.log(`\n⚠️  جاري حذف ${email}...`)

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    console.log(`❌ المستخدم غير موجود\n`)
    return
  }

  await prisma.user.delete({ where: { email } })

  console.log(`✅ تم حذف ${email}\n`)
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const email = args[1]

  try {
    switch (command) {
      case "list":
        await listUsers()
        break

      case "promote":
        if (!email) {
          console.log(`❌ يجب تحديد البريد الإلكتروني\n`)
          process.exit(1)
        }
        await promoteUser(email)
        break

      case "demote":
        if (!email) {
          console.log(`❌ يجب تحديد البريد الإلكتروني\n`)
          process.exit(1)
        }
        await demoteUser(email)
        break

      case "delete":
        if (!email) {
          console.log(`❌ يجب تحديد البريد الإلكتروني\n`)
          process.exit(1)
        }
        await deleteUser(email)
        break

      default:
        console.log(`\n╔════════════════════════════════════════════════════════════╗`)
        console.log(`║  👤 إدارة المستخدمين`)
        console.log(`╚════════════════════════════════════════════════════════════╝\n`)
        console.log(`الأوامر المتاحة:`)
        console.log(`   list               عرض جميع المستخدمين`)
        console.log(`   promote <email>    ترقية إلى admin`)
        console.log(`   demote <email>     خفض من admin`)
        console.log(`   delete <email>     حذف مستخدم\n`)
        console.log(`الأمثلة:`)
        console.log(`   npx tsx scripts/05-manage-users.ts list`)
        console.log(`   npx tsx scripts/05-manage-users.ts promote user@example.com`)
        console.log(`   npx tsx scripts/05-manage-users.ts demote user@example.com`)
        console.log(`   npx tsx scripts/05-manage-users.ts delete user@example.com\n`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`\n❌ خطأ:`)
    console.error(`   ${msg}\n`)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
