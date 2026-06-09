const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sy-nl.org" },
    update: {},
    create: {
      name: "الإدارة",
      email: "admin@sy-nl.org",
      password: adminPassword,
      role: "admin",
    },
  });

  const memberPassword = await bcrypt.hash("member123", 12);
  await prisma.user.upsert({
    where: { email: "member@sy-nl.org" },
    update: {},
    create: {
      name: "عضو الجالية",
      email: "member@sy-nl.org",
      password: memberPassword,
      role: "member",
    },
  });

  console.log("Users created: admin@sy-nl.org / admin123");

  console.log("Skipping article seeding — use dashboard to create content");

  await prisma.task.deleteMany();
  const tasks = [
    { title: "تنظيم فعالية عيد الفطر", description: "تجهيز القاعة والبرنامج", priority: "high", createdBy: admin.id },
    { title: "تحديث قاعدة بيانات الأعضاء", description: "مراجعة وتحديث معلومات الأعضاء", priority: "medium", createdBy: admin.id },
    { title: "التواصل مع بلدية أمستردام", description: "متابعة نتائج الاجتماع", priority: "high", createdBy: admin.id },
    { title: "إعداد التقرير الشهري", description: "تقرير أنشطة الجالية لشهر مايو", priority: "medium", createdBy: admin.id },
    { title: "تنظيف مقر الجالية", description: "حملة نظافة للمقر الرئيسي", priority: "low", createdBy: admin.id },
  ];
  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }
  console.log(`${tasks.length} tasks created`);

  await prisma.contact.deleteMany();
  const contacts = [
    { name: "أحمد محمد", email: "ahmed@example.com", subject: "استفسار عن دورات اللغة", message: "السلام عليكم، أرغب في التسجيل بدورات اللغة الهولندية. هل هناك أماكن متاحة؟", read: false },
    { name: "سارة خالد", email: "sara@example.com", subject: "اقتراح فعالية", message: "أقترح تنظيم معرض للصور الفوتوغرافية عن سوريا. لدي مجموعة من الصور وأرغب في المشاركة.", read: false },
    { name: "خالد عمر", email: "khaled@example.com", subject: "طلب تطوع", message: "أرغب في التطوع مع الجالية. لدي خبرة في التنظيم وإدارة الفعاليات.", read: true },
  ];
  for (const contact of contacts) {
    await prisma.contact.create({ data: contact });
  }
  console.log(`${contacts.length} contact messages created`);

  // Seed default roles
  const roleDefaults = {
    admin: ["news.create","news.edit","news.delete","news.publish","news.feature","events.create","events.edit","events.delete","events.publish","tasks.create","tasks.edit","tasks.delete","tasks.assign","comments.approve","comments.delete","comments.manage","ads.create","ads.edit","ads.delete","surveys.create","surveys.edit","surveys.delete","surveys.view_results","media.upload","media.delete","pages.create","pages.edit","pages.delete","pages.publish","users.view","users.edit_role","users.delete","settings.view","settings.edit","roles.manage","volunteers.view","volunteers.manage","subscribers.view","subscribers.export","landing.create","landing.edit","landing.delete","landing.publish"],
    editor: ["news.create","news.edit","news.publish","news.feature","events.create","events.edit","events.publish","tasks.create","tasks.edit","tasks.assign","comments.approve","media.upload","media.delete","pages.create","pages.edit","pages.publish","volunteers.view","subscribers.view","landing.publish"],
    moderator: ["comments.approve","comments.delete","comments.manage","news.edit","events.edit","volunteers.view"],
    contributor: ["news.create","news.edit","events.create","events.edit"],
    member: [],
  };

  for (const [name, perms] of Object.entries(roleDefaults)) {
    await prisma.role.upsert({
      where: { name },
      update: { permissions: JSON.stringify(perms) },
      create: { name, description: getRoleDesc(name), permissions: JSON.stringify(perms), isSystem: true },
    });
  }
  console.log(`5 default roles seeded`);
}

function getRoleDesc(name) {
  const descs = {
    admin: "مدير النظام — صلاحية كاملة على جميع الوحدات",
    editor: "محرر — إدارة المحتوى والنشر",
    moderator: "مشرف — إدارة التعليقات والإشراف",
    contributor: "مساهم — إنشاء وتحرير المحتوى",
    member: "عضو — صلاحيات أساسية",
  };
  return descs[name] || "";
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
