const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ margin: 50, size: 'A4' });
const stream = fs.createWriteStream('project-details-arabic.pdf');

doc.pipe(stream);

// Title
doc.fontSize(24).font('Helvetica-Bold').text('منصة الجالية السورية في هولندا (SY-NL)', { align: 'center' });
doc.moveDown();

// Section 1: Overview
doc.fontSize(18).font('Helvetica-Bold').text('📋 نظرة عامة', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('هذا مشروع منصة ويب وموبايل شاملة للجالية السورية في هولندا، مبنية بـ Next.js 16 و Expo React Native.');
doc.moveDown();

// Section 2: Tech Stack
doc.fontSize(18).font('Helvetica-Bold').text('🛠 التقنيات المستخدمة', { underline: true });
doc.moveDown(0.5);

const techData = [
  ['Next.js', '16.2.6', 'إطار عمل Full-stack'],
  ['React', '19.x', 'واجهة المستخدم'],
  ['TypeScript', '5.x', 'الأمان في الأنواع'],
  ['Tailwind CSS', '4.x', 'التصميم'],
  ['Prisma', '6.11.1', 'ORM - SQLite'],
  ['NextAuth', '4.24.x', 'المصادقة'],
  ['OpenAI SDK', '4.100.x', 'GPT-5.5 API'],
  ['Zustand', '5.x', 'حالة العميل'],
  ['Zod', '4.x', 'التحقق من البيانات'],
];

let y = doc.y;
doc.fontSize(10).font('Helvetica');
doc.text('التقنية', 50, y, { width: 100 });
doc.text('الإصدار', 150, y, { width: 80 });
doc.text('الاستخدام', 230, y, { width: 200 });

y += 15;
techData.forEach(row => {
  doc.text(row[0], 50, y, { width: 100 });
  doc.text(row[1], 150, y, { width: 80 });
  doc.text(row[2], 230, y, { width: 200 });
  y += 15;
});

doc.y = y + 10;
doc.moveDown();

// Section 3: Web App Structure
doc.fontSize(18).font('Helvetica-Bold').text('🏗 هيكل التطبيق الويب', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');

const webPages = [
  { path: '/', desc: 'الصفحة الرئيسية (وكالة أنباء)' },
  { path: '/about', desc: 'من نحن' },
  { path: '/contact', desc: 'تواصل معنا' },
  { path: '/volunteer', desc: 'تطوع الآن' },
  { path: '/news', desc: 'نبض الجالية (مع تصنيفات وبحث)' },
  { path: '/news/[slug]', desc: 'عرض المقال الفردي' },
  { path: '/news/category/[slug]', desc: 'قائمة التصنيفات' },
  { path: '/login', desc: 'تسجيل الدخول' },
  { path: '/signup', desc: 'إنشاء حساب' },
];

webPages.forEach(page => {
  doc.text(`• ${page.path} - ${page.desc}`);
});
doc.moveDown();

// Dashboard
doc.fontSize(14).font('Helvetica-Bold').text('لوحة التحكم (/dashboard):');
doc.fontSize(12).font('Helvetica');
const dashboardPages = [
  { path: '/dashboard/tasks', desc: 'إدارة المهام' },
  { path: '/dashboard/ai', desc: 'AI مساعد (GPT-5.5)' },
  { path: '/dashboard/messages', desc: 'الرسائل' },
  { path: '/dashboard/users', desc: 'إدارة المستخدمين' },
  { path: '/dashboard/comments', desc: 'إدارة التعليقات' },
  { path: '/dashboard/pages', desc: 'إدارة الصفحات' },
];

dashboardPages.forEach(page => {
  doc.text(`• ${page.path} - ${page.desc}`);
});
doc.moveDown();

// Section 4: Mobile App
doc.fontSize(18).font('Helvetica-Bold').text('📱 التطبيق الموبايل', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('تطبيق Expo React Native منفصل يشمل:');
doc.moveDown(0.3);
doc.text('• شاشات الأخبار والمقالات');
doc.text('• شاشة التواصل');
doc.text('• شاشة من نحن');
doc.text('• نظام i18n منفصل (ar.json, en.json, nl.json)');
doc.moveDown();

// Section 5: i18n
doc.fontSize(18).font('Helvetica-Bold').text('🌐 التدويل (i18n)', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('يدعم 3 لغات: العربية، الإنجليزية، الهولندية');
doc.moveDown(0.3);
doc.text('• الويب: src/messages/{ar,en,nl}.json (600+ مفتاح)');
doc.text('• الموبايل: mobile/i18n/{ar,en,nl}.json (60+ مفتاح)');
doc.moveDown();

// Section 6: AI Features
doc.fontSize(18).font('Helvetica-Bold').text('🤡 الذكاء الاصطناعي', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('• يستخدم OpenAI GPT-5.5 للمحادثة والترجمة والملخصات');
doc.text('• نظام RAG (Retrieval Augmented Generation) للإجابات المستندة على الحقائق');
doc.text('• مساعد AI في لوحة التحكم');
doc.moveDown();

// Section 7: Database
doc.fontSize(18).font('Helvetica-Bold').text('🗄 قاعدة البيانات', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('• محلياً: SQLite (prisma/dev.db)');
doc.text('• الإنتاج: Turso (libsql)');
doc.text('• Prisma ORM لإدارة قاعدة البيانات');
doc.moveDown();

// Section 8: Deployment
doc.fontSize(18).font('Helvetica-Bold').text('🚀 أهداف النشر', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');

const deployData = [
  ['Vercel (staging)', 'https://sgn-msalimaziza-3522s-projects.vercel.app'],
  ['Hostinger (production)', 'https://sy-nl.org'],
  ['Mobile APK/IPA', 'عبر Expo'],
];

y = doc.y;
deployData.forEach(row => {
  doc.text(`• ${row[0]}: ${row[1]}`);
  y += 15;
});
doc.moveDown();

// Section 9: Completed Features
doc.fontSize(18).font('Helvetica-Bold').text('✅ الميزات المكتملة', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
const features = [
  'نظام مصادقة كامل',
  'لوحة تحكم شاملة',
  'نظام أخبار مع تصنيفات وبحث',
  'نظام تعليقات',
  'AI مساعد',
  'تطبيق موبايل',
  'SEO متقدم (sitemap, robots, JSON-LD)',
  'دعم RTL للعربية',
];

features.forEach(feature => {
  doc.text(`• ${feature}`);
});
doc.moveDown();

// Section 10: Milestones
doc.fontSize(18).font('Helvetica-Bold').text('📊 المراحل المنجزة', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('M1: إعداد ✅ | M2: موقع تعريفي ✅ | M3: مصادقة + Dashboard ✅');
doc.text('M4: AI ✅ | M5: Mobile ✅ | M6: نشر ✅');
doc.moveDown();

// Footer
doc.fontSize(10).font('Helvetica').text('المشروع جاهز للنشر على Hostinger ويتضمن دليلاً كاملاً للنشر.', { align: 'center' });

doc.end();

stream.on('finish', () => {
  console.log('✅ تم إنشاء ملف PDF بنجاح: project-details-arabic.pdf');
});
