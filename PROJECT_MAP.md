# PROJECT_MAP — منصة الجالية السورية في هولندا (SY-NL)

## [TECH_STACK]

| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| Next.js | 16.2.7 | Full-stack framework |
| React | 19.x | UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Prisma | 6.19.3 | ORM — SQLite |
| NextAuth | 4.24.x | المصادقة |
| OpenAI SDK | 4.104.x | GPT-5.5 API |
| Zustand | 5.x | Client state |
| Zod | 4.x | Validation |

## [SYSTEM_FLOW]
```
[User] → Website (Next.js) → API Routes → Prisma → SQLite
                                          → OpenAI GPT-5.5
```

## [ARCHITECTURE]
```
src/
├── app/
│   ├── page.tsx               # الصفحة الرئيسية — وكالة أنباء ✅
│   ├── about/                 # من نحن ✅
│   ├── contact/               # تواصل معنا ✅
│   ├── volunteer/             # تطوع ✅
│   ├── news/
│   │   ├── page.tsx           # قائمة الأخبار مع تصنيفات وبحث ✅
│   │   ├── [slug]/page.tsx    # عرض المقال الفردي ✅
│   │   └── category/[slug]/   # تصنيف الأخبار ✅
│   ├── login/                 # ✅
│   ├── signup/                # ✅
│   ├── dashboard/
│   │   ├── page.tsx           # ✅
│   │   ├── tasks/             # ✅
│   │   ├── ai/                # ✅
│   │   ├── messages/          # ✅
│   │   ├── users/             # ✅
│   │   └── pages/             # ✅ (محدث بدعم الحقول الجديدة)
│   ├── api/
│   │   ├── auth/              # NextAuth ✅
│   │   ├── pages/             # CRUD صفحات مع حقول الأخبار الجديدة ✅
│   │   ├── news/              # API عام للأخبار (تصنيف، مميز، بحث) ✅
│   │   ├── tasks/             # ✅
│   │   └── ai/                # ✅
│   └── globals.css            # + animate-marquee + line-clamp ✅
├── components/ui/             # shadcn/ui
├── lib/
│   ├── ai/                    # AI service layer ✅
│   └── db.ts                  # Prisma client
└── prisma/
    └── schema.prisma          # Post model مع category, slug, excerpt, tags, source, featured, views ✅
```

## [ORPHANS & PENDING]
- [x] NextAuth — API route + provider ✅
- [x] تسجيل الدخول — /login ✅
- [x] Dashboard — /dashboard ✅
- [x] API tasks CRUD ✅
- [x] AI Service — OpenAI GPT-5.5 ✅
- [x] AI Task Assistant ✅
- [x] AI Dashboard Analytics ✅
- [x] إعادة تصميم وكالة أنباء ✅
- [x] شريط أخبار عاجلة (Breaking News Ticker) ✅
- [x] تصنيفات أخبار متعددة ✅
- [x] صفحة مقال فردي (/news/[slug]) ✅
- [x] صفحات تصنيفات (/news/category/[slug]) ✅
- [x] واجهة تحرير صفحات متقدمة (category, tags, excerpt, slug, featured) ✅
- [x] API أخبار عام (/api/news) مع تصفية وتصنيف وبحث ✅
- [x] عدّاد مشاهدات المقالات ✅
- [x] تحسين SEO: sitemap, robots, JSON-LD, Open Graph, manifest ✅
- [x] نظام تعليقات (Comment + API + UI + Dashboard) ✅
- [x] تطبيق Expo (موبايل) — /mobile مع شاشات الأخبار والمقالات والتواصل ومن نحن ✅
- [x] تجهيز النشر على Hostinger — دليل + .env.example + نصوص build ✅

## Pages Built
| المسار | الحالة |
|--------|--------|
| `/` | ✅ الصفحة الرئيسية (وكالة أنباء) |
| `/about` | ✅ من نحن |
| `/news` | ✅ نبض الجالية (مع تصنيفات وبحث وترقيم صفحات) |
| `/news/[slug]` | ✅ عرض المقال الفردي |
| `/news/category/[slug]` | ✅ قائمة التصنيفات |
| `/contact` | ✅ تواصل معنا (مع قاعدة بيانات) |
| `/volunteer` | ✅ تطوع الآن |
| `/login` | ✅ تسجيل الدخول |
| `/signup` | ✅ إنشاء حساب |
| `/dashboard` | ✅ لوحة التحكم |
| `/dashboard/tasks` | ✅ إدارة المهام (CRUD كامل) |
| `/dashboard/ai` | ✅ AI مساعد (GPT-5.5) |
| `/dashboard/messages` | ✅ الرسائل |
| `/dashboard/users` | ✅ إدارة المستخدمين (مشرف) |
| `/dashboard/comments` | ✅ إدارة التعليقات (مشرف) |
| `/dashboard/pages` | ✅ إدارة الصفحات (مشرف) — category, tags, excerpt, slug, featured |
| — | — |
| `robots.txt` | ✅ SEO |
| `sitemap.xml` | ✅ SEO |
| `manifest.webmanifest` | ✅ PWA |
| `/mobile` | ✅ تطبيق Expo (React Native) |

## Milestones
**M1: إعداد** ✅ | **M2: موقع تعريفي** ✅ | **M3: مصادقة + Dashboard** ✅ | **M4: AI** ✅ | **M5: Mobile** ✅ | **M6: نشر** ✅ (جاهز)
