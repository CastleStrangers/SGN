import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const doc = new PDFDocument({ margin: 50, size: 'A4' });
const outputPath = path.resolve('project-details-en.pdf');
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const logoPath = path.resolve('public/logo.png');
if (fs.existsSync(logoPath)) {
  doc.image(logoPath, 50, 30, { width: 80 });
}

// Title
doc.fontSize(26).font('Helvetica-Bold');
doc.text('Syrian Community Platform (SY-NL)', { align: 'center' });
doc.fontSize(12).font('Helvetica').text('A comprehensive web & mobile platform for the Syrian community in the Netherlands', { align: 'center' });
doc.moveDown(2);

// ===== Section 1: Overview =====
doc.fontSize(18).font('Helvetica-Bold').text('1. Overview', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text(
  'A full-stack web platform and mobile app for the Syrian community in the Netherlands, built with Next.js 15 and Expo React Native. ' +
  'The platform serves as a news hub, community management tool, and communication bridge for Syrians living in the Netherlands.'
);
doc.moveDown();

// ===== Section 2: Tech Stack =====
doc.fontSize(18).font('Helvetica-Bold').text('2. Technology Stack', { underline: true });
doc.moveDown(0.5);

const techData = [
  ['Next.js', '16.2.6', 'Full-stack React framework'],
  ['TypeScript', '5.x', 'Type safety'],
  ['Tailwind CSS', '4.x', 'Utility-first styling'],
  ['Prisma', '6.11.1', 'ORM (SQLite / Turso)'],
  ['NextAuth', '4.24.x', 'Authentication'],
  ['OpenAI SDK', '4.100.x', 'GPT-4o / GPT-5.5 API'],
  ['Expo', '52.x', 'Mobile (React Native)'],
  ['Zustand', '5.x', 'Client state management'],
  ['Zod', '4.x', 'Validation'],
  ['next-intl', '4.x', 'Internationalization (i18n)'],
  ['Cheerio / html-to-text', 'latest', 'Web scraping (sync)'],
];

let y = doc.y;
doc.fontSize(10).font('Helvetica-Bold');
doc.text('Technology', 50, y, { width: 120 });
doc.text('Version', 170, y, { width: 80 });
doc.text('Purpose', 250, y, { width: 200 });
y += 18;

doc.fontSize(10).font('Helvetica');
techData.forEach(row => {
  doc.text(row[0], 50, y, { width: 120 });
  doc.text(row[1], 170, y, { width: 80 });
  doc.text(row[2], 250, y, { width: 200 });
  y += 16;
});
doc.y = y + 8;
doc.moveDown();

// ===== Section 3: Web App Routes =====
doc.fontSize(18).font('Helvetica-Bold').text('3. Web Application Routes', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');

const webPages = [
  { path: '/', desc: 'Homepage (News Agency layout)' },
  { path: '/about', desc: 'About us' },
  { path: '/contact', desc: 'Contact form' },
  { path: '/volunteer', desc: 'Volunteer registration' },
  { path: '/news', desc: 'News feed with categories & search' },
  { path: '/news/[slug]', desc: 'Individual article view' },
  { path: '/news/category/[slug]', desc: 'Category filtered list' },
  { path: '/login', desc: 'Login page' },
  { path: '/signup', desc: 'Create account' },
  { path: '/forgot-password', desc: 'Password reset' },
  { path: '/events', desc: 'Events calendar' },
  { path: '/gallery', desc: 'Photo gallery' },
  { path: '/tasks', desc: 'Community tasks' },
];

webPages.forEach(page => {
  doc.text(`\u2022 ${page.path}  \u2014  ${page.desc}`);
});
doc.moveDown();

// Dashboard
doc.fontSize(14).font('Helvetica-Bold').text('Dashboard (/dashboard/*):');
doc.fontSize(12).font('Helvetica');
const dashboardPages = [
  { path: '/', desc: 'Stats & overview' },
  { path: '/tasks', desc: 'Task management' },
  { path: '/ai', desc: 'AI assistant (GPT-5.5)' },
  { path: '/messages', desc: 'Messages' },
  { path: '/users', desc: 'User management' },
  { path: '/comments', desc: 'Comment moderation' },
  { path: '/pages', desc: 'Page management' },
  { path: '/events', desc: 'Event management' },
  { path: '/subscribers', desc: 'Newsletter subscribers' },
  { path: '/volunteers', desc: 'Volunteer management' },
];

dashboardPages.forEach(page => {
  doc.text(`\u2022 /dashboard${page.path}  \u2014  ${page.desc}`);
});
doc.moveDown();

// ===== Section 4: API Routes =====
doc.fontSize(18).font('Helvetica-Bold').text('4. API Endpoints', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
const apiEndpoints = [
  '/api/auth/* - Authentication (NextAuth, signup, password reset)',
  '/api/news - CRUD news articles',
  '/api/comments - Comments with moderation',
  '/api/events - Event management',
  '/api/contact - Contact form submissions',
  '/api/sync - Automated news sync from sy-nl.org',
  '/api/upload - File uploads',
  '/api/ai/* - AI features (chat, suggest, translate)',
  '/api/members* - Member management & email broadcast',
  '/api/surveys - Survey system',
  '/api/dashboard/stats - Admin statistics',
  '/api/subscribe - Newsletter subscription',
];

apiEndpoints.forEach(ep => doc.text(`\u2022 ${ep}`));
doc.moveDown();

// ===== Section 5: Sync System =====
doc.fontSize(18).font('Helvetica-Bold').text('5. Automated Sync System', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text(
  'The platform includes an automated sync engine that scrapes news from sy-nl.org (Hostinger Website Builder, no RSS/API). ' +
  'It uses section-based HTML extraction with regex, downloads images locally, detects YouTube video IDs from thumbnail URLs, ' +
  'and categorizes content via keyword mapping or OpenAI.'
);
doc.text('');
doc.text('The sync system is deployed as a PM2 process with hourly cron jobs.');
doc.moveDown();

// ===== Section 6: Mobile App =====
doc.fontSize(18).font('Helvetica-Bold').text('6. Mobile Application', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('An Expo React Native app with:');
doc.text('\u2022 News articles and categories');
doc.text('\u2022 Messaging / chat system');
doc.text('\u2022 Profile management');
doc.text('\u2022 Favorites/bookmarks');
doc.text('\u2022 Independent i18n (Arabic, English, Dutch)');
doc.text('\u2022 AI chat integration');
doc.moveDown();

// ===== Section 7: AI Features =====
doc.fontSize(18).font('Helvetica-Bold').text('7. Artificial Intelligence', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('\u2022 OpenAI GPT-5.5 for chat, translation, and summarization');
doc.text('\u2022 RAG (Retrieval Augmented Generation) for fact-based answers');
doc.text('\u2022 Sentiment analysis');
doc.text('\u2022 Smart news categorization via OpenAI fallback');
doc.text('\u2022 Dashboard AI assistant');
doc.moveDown();

// ===== Section 8: Database =====
doc.fontSize(18).font('Helvetica-Bold').text('8. Database', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('\u2022 Development: SQLite (prisma/dev.db)');
doc.text('\u2022 Production: Turso (libSQL)');
doc.text('\u2022 Prisma ORM with full migration pipeline');
doc.text('\u2022 10+ models: User, Post, Comment, Event, Task, Contact, Subscriber, Volunteer, Notification, etc.');
doc.moveDown();

// ===== Section 9: i18n =====
doc.fontSize(18).font('Helvetica-Bold').text('9. Internationalization (i18n)', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('3 languages supported: Arabic, English, Dutch');
doc.text('\u2022 Web: next-intl with src/messages/{ar,en,nl}.json (600+ keys)');
doc.text('\u2022 Mobile: Custom i18n context with {ar,en,nl}.json (60+ keys)');
doc.text('\u2022 Full RTL support for Arabic');
doc.moveDown();

// ===== Section 10: Deployment =====
doc.fontSize(18).font('Helvetica-Bold').text('10. Deployment Targets', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('\u2022 Staging: Vercel (sgn-indol.vercel.app)');
doc.text('\u2022 Production: Hostinger VPS (sy-nl.org)');
doc.text('\u2022 Mobile: Expo APK / IPA');
doc.text('\u2022 Process manager: PM2 with ecosystem.config.js');
doc.moveDown();

// ===== Section 11: Completed Features =====
doc.fontSize(18).font('Helvetica-Bold').text('11. Completed Features', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');

const features = [
  'Full authentication system (email/password, NextAuth)',
  'Comprehensive admin dashboard',
  'News system with categories, search, and pagination',
  'Comment system with moderation',
  'AI assistant (GPT-5.5) with RAG',
  'Mobile application (Expo React Native)',
  'Advanced SEO (sitemap.xml, robots.txt, JSON-LD structured data)',
  'Full RTL support for Arabic',
  'Automated news sync engine with image/video extraction',
  'Member management with CSV import/export',
  'Email broadcast system',
  'Survey/poll system',
  'Volunteer registration',
  'Event calendar',
  'Photo gallery',
  'Push notifications',
  'i18n in 3 languages',
];

features.forEach(f => doc.text(`\u2713 ${f}`));
doc.moveDown();

// ===== Section 12: Milestones =====
doc.fontSize(18).font('Helvetica-Bold').text('12. Completed Milestones', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica');
doc.text('M1: Project Setup \u2713 | M2: Informational Site \u2713 | M3: Auth + Dashboard \u2713');
doc.text('M4: AI Integration \u2713 | M5: Mobile App \u2713 | M6: Deployment \u2713');
doc.text('M7: Automated Sync Engine \u2713 | M8: Sync Images & Video \u2713');
doc.moveDown(2);

// Footer
doc.fontSize(10).font('Helvetica').text('Project ready for production deployment. Full deployment guide available in HOSTINGER_DEPLOY.md.', { align: 'center' });
doc.fontSize(9).font('Helvetica').text('Generated from the Syrian Community in the Netherlands project repository.', { align: 'center', color: 'gray' });

doc.end();

stream.on('finish', () => {
  console.log('Generated: project-details-en.pdf');
});
