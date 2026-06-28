# AGENTS.md — Project-wide rules for AI agents

> **Always read this file first** before making any changes.

## 🎯 Golden Rule

**EVERY change must be applied ACROSS ALL parts of the project:**
- ✅ **Web app** — `src/` (Next.js + i18n)
- ✅ **Mobile app** — `mobile/` (Expo React Native, separate i18n)
- ✅ **API routes** — shared between web + mobile
- ✅ **i18n keys** — if added to web, also add to mobile (and vice versa)
- ✅ **Prisma schema** — changes affect both web API and mobile API calls

## 📤 Git Rule (مهم جداً)

**كل تعديل للمشروع على الهارد ديسك لازم:**
1. ✅ يترفع للمستودع العام `https://github.com/CastleStrangers/SGN.git`
2. ✅ يتحدث رابط الزبون بعد الـ push: `https://sgn-indol.vercel.app`
3. ✅ `git add -A && git commit -m "وصف التعديل" && git push`

## 🗣️ لغة الحوار

**لغة الحوار الأساسية هنا هي العربية (اللهجة السورية).** كل الشرح والتعليمات والتواصل يكون بالعربي.

## 🏗 Project Structure

```
SGN/                          # ← Web app (Next.js 16 + i18n + Tailwind)
  src/
    app/                      # Routes: [locale]/ + api/
    components/               # React components
    lib/                      # Shared libraries
    messages/                 # Web i18n (ar.json, en.json, nl.json)
  mobile/                     # ← Mobile app (Expo React Native)
    app/                      # Screens (uses useI18n() hook)
    constants/                # Colors, API URL, config
    i18n/                     # Mobile i18n (ar.json, en.json, nl.json)
    lib/                      # i18n engine, API client
  prisma/                     # Database schema (shared)
  public/                     # Static files
```

## 📡 Deployment Target

| Target | URL | How |
|--------|-----|-----|
| **Vercel** | `https://sgn-indol.vercel.app` | `vercel --prod` |
| **Mobile APK/IPA** | N/A | `cd mobile && npm run build:android` |

> `sy-nl.org` هو موقع خارجي لجلب المعلومات والأخبار فقط — ليس من مشروعنا.

## 🔄 Auto-update the Client URL

Before building the mobile app for production:
```bash
cd mobile && npm run set:prod
```
This changes `mobile/constants/config.ts` to use `https://sgn-indol.vercel.app`.
- `npm run set:dev` → switches back to `http://localhost:3001`
- The `build:android` / `build:ios` / `build:web` scripts run `set:prod` automatically.

## 🌐 i18n Rule

- **Web i18n** → `src/messages/{ar,en,nl}.json` (600+ keys, 40+ namespaces)
- **Mobile i18n** → `mobile/i18n/{ar,en,nl}.json` (60+ keys, 12 namespaces)
- **Shared keys** must exist in BOTH web and mobile i18n files.
- **New feature** → add i18n keys to web AND mobile message files.
- **API routes** → use `getApiMessage(locale, key)` from `@/lib/api-messages`.

## 🗄 Database

- Schema: `prisma/schema.prisma` (shared for all parts)
- Local: SQLite (`prisma/dev.db`)
- Production: Turso (libsql) — set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
- Sync: `prisma db push` after any schema change

## 🧪 Build Checklist

1. `npm run build` — web app compiles (70 routes, 0 TypeScript errors)
2. `cd mobile && npx tsc --noEmit` — mobile compiles (module-not-found for native libs OK)
3. `npm run i18n:check` — no hardcoded Arabic in source files
4. Verify new pages have nav links in `top-bar.tsx`, `site-header.tsx`, `footer`

## 🔄 SGN Workflow — من فكرة إلى نشر

```
┌─ 1. فكرة (Issue / GitHub Project) ─────────────────┐
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 2. تحليل + تقسيم (15 د) ──────────────────────────┐
│  - شو المطلوب؟                                      │
│  - يحتاج تغيير Prisma؟ i18n؟ Web/Mobile/كلاهما؟    │
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 3. فرع جديد ──────────────────────────────────────┐
│  fix/الموضوع  أو  feat/الميزة                       │
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 4. تنفيذ (Deep Work — 90 د) ──────────────────────┐
│  برمجة + i18n + اختبارات                             │
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 5. تدقيق (10 د) ─────────────────────────────────┐
│  npm run build + lint + test:run                    │
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 6. رفع + نشر (دقيقة) ────────────────────────────┐
│  SGN Sync & Deploy.lnk (double click)               │
└─────────────────┬───────────────────────────────────┘
                  ▼
┌─ 7. مراجعة بعد النشر (5 د) ───────────────────────┐
│  افتح الموقع وتأكد الشغل تمام                        │
└─────────────────────────────────────────────────────┘
```

## ⚡ Critical Patterns

- **Next.js 16**: `params` is `Promise` — must `await` in API routes and page components
- **Auth**: `getServerSession(authOptions)` (NEVER `getServerSession()` without authOptions)
- **API i18n**: `tReq(req, key)` or `getApiMessage(locale, key, vars)` — NEVER hardcoded Arabic
- **Hydration**: `suppressHydrationWarning` + `mounted` state for client-only values (theme, etc.)
- **Responsive**: RTL-first for Arabic, LTR for English/Dutch
- **Ports**: Web dev = `:3000` (Experimental/Testing), Web prod = `:3001`, Mobile dev = `http://localhost:3000/api`
- **AI Chatbot**: `POST /api/chat/ai` — uses Ollama (`qwen2.5:7b`, local); system prompt defines assistant as Syrian community expert; rate-limited (30 msg/min); saves to `ChatAISession` + `ChatAIMessage` tables
- **AI Switch (Gemini → Ollama / Anthropic)**: All AI features now default to **Ollama** (`qwen2.5:7b`) locally. In production, the system supports **Anthropic (Claude)** via Vercel AI Gateway or **OpenAI**. Configure via `AI_PROVIDER`, `ANTHROPIC_BASE_URL`, and `ANTHROPIC_CUSTOM_HEADERS`.
- **Ollama Models**: `ollama pull qwen2.5:7b` (~4.7GB, excellent Arabic) for text; `ollama pull llava:7b` (~4.5GB) for vision (ID extraction). Must be running (`ollama serve`) before using any AI features.
- **RAG (Retrieval Augmented Generation)**: `src/lib/ai/rag.ts` — extracts keywords from user question, searches News (Post), Events, and Volunteer tables; injects results into system prompt for fact-aware answers
- **Mobile Chat**: `mobile/app/(tabs)/messages.tsx` — 4th tab in mobile app; AI chat with suggested questions, message bubbles, typing indicator; uses `mobile/lib/chat.ts` API functions. **Direct Chat**: `mobile/app/direct-chat.tsx` — peer-to-peer messaging between members/service providers with **Push Notifications** via Expo.

## 📡 Sync System — جلب الأخبار (مهم جداً لا تحذف)

### المصادر
| المصدر | النوع | الحالة | الموقع |
|--------|-------|--------|--------|
| sy-nl.org | Webpage scraping | مُفعّل | `https://www.sy-nl.org/nbdh-aljalyh` |
| YouTube | RSS Feed | مُفعّل | قناة `UCgsEr_WQEnuymVqvTWXqmtw` |
| Facebook | Graph API | مُفعّل | `DeSyrischeGemeenschapInNederland` |

### الملفات الأساسية
- **إعدادات المصادر**: `src/lib/sync/types.ts` — `DEFAULT_SOURCES`
- **محرك السينك**: `src/lib/sync/index.ts` — `runSync()`
- **استخراج المقالات**: `src/lib/sync/extractor.ts`
- **فيسبوك**: `src/lib/sync/facebook.ts` (يحبّذ `pages_read_engagement`)
- **الحفظ بقاعدة البيانات**: `src/lib/sync/db-sync.ts` (يدعم منع التكرار)
- **تحميل الوسائط**: `src/lib/sync/media.ts` (يدعم Vercel Blob + محلي)
- **تصنيف بالذكاء الاصطناعي**: `src/lib/sync/categorizer.ts` (fallback: كلمات مفتاحية)

### كيفية تشغيل المزامنة
```bash
# مسح كل المقالات وجلب جديد (⚠️ يحذف الموجود)
SKIP_CONFIRMATION=true npx tsx scripts/04-reset-and-sync.ts

# مزامنة فيسبوك فقط (يحترم التوكن من .env)
npx tsx scripts/01-sync-facebook.ts

# أو عبر API (يتطلب admin auth):
curl -X POST http://localhost:3000/api/sync
```

## 🧑‍🤝‍🧑 أعضاء مجلس الإدارة

| الحقل | القيمة |
|-------|--------|
| العدد الإجمالي | 24 ✅ |
| في SQLite | 24 عضو |
| في Turso | 24 عضو |
| الصور | موجودة في `public/images/board/` |

### قائمة الأعضاء (حسب الترتيب)
1. عبد المنعم الشامان — رئيس مجلس الإدارة
2. صالح المحمد حنايا — نائب رئيس مجلس الإدارة
3. خالد فيصل الطويل — الأمين العام للجالية
4. محمد سليم عزيزة — عضو مكتب الأمانة العامة (المسؤول التقني) ✅ **(تمت الإضافة 26 يونيو 2026)**
5. محمد رائد كعكة — رئيس المكتب المالي
6. أحمد الحرفي — عضو مكتب الأمانة العامة (المسؤول التنظيمي)
7. هدى الحلاق — مديرة المكتب الإعلامي
8. رائد دهموش المشهور — مسؤول العلاقات الخارجية
9. محمود الناصر — مسؤول العلاقات الدولية
10. عمر النويلاتي — مسؤول النشاطات
11. رابعة الزريقات — مسؤولة الشؤون القانونية
12. فاتن رحال — رئيسة مكتب شؤون المرأة والأسرة
13. حسن الحسن قطيني — مسؤول رواد الأعمال
14. نبيل حاج حسين — مسؤول الصحة والدعم النفسي
15. بلال الرفاعي — مسؤول الصحة والدعم النفسي
16. محمد مصطفى سمهاني — مسؤول العلاقات الدولية
17. نهاد سويد — مسؤول العلاقات العامة
18. محمد أكرم الجنيدي — مسؤول الطلاب والتعليم
19. يوسف درويش — لجنة الرقابة الداخلية
20. محمد ربيع الجنيدي — المجلس الاستشاري
21. وسيم حسان — المجلس الاستشاري
22. ماهره الطواشي — المجلس الاستشاري
23. ريمه الحربات — المجلس الاستشاري
24. فراس هاني عابدين — المجلس الاستشاري

### تعديلات سابقة
- **صورة أحمد الحرفي:** تم تصحيح المسار من `ahmad_alharfi.png` → `Ahmad_Al_Herafi.jpg`
- **إضافة محمد سليم عزيزة:** تمت 26 يونيو 2026 (UUID: `ab43e716-735c-487c-a1fb-5fbb71f88012`)

### نتائج آخر مزامنة (26 يونيو 2026)
- **sy-nl.org**: 25 مقالة ✅
- **YouTube**: 13 فيديو ✅
- **Facebook**: 31 منشور ✅
- **الإجمالي**: 69 خبر في قاعدة البيانات (تم حذف 10 مقالات وهمية)
- قاعدة البيانات: `prisma/dev.db` (SQLite محلياً)

### Facebook — معلومات مهمة
- **Page ID**: `943115162210802` (من `/me/accounts`)
- **التوكن**: موجود في `.env` كـ `FACEBOOK_PAGE_TOKEN` (مأخوذ من `/me/accounts` تجديد كل 60 يوم)
- إذا انتهى التوكن: استخدم `https://graph.facebook.com/v19.0/me/accounts?access_token={USER_TOKEN}` لاستخراج التوكن الجديد للصفحة
- صلاحية يحتاجها التوكن: `pages_read_engagement`

## 📌 When You See "OP:..." or Similar Prefixes

The user may reference prior sessions. The `AGENTS.md` file is the authoritative source for project rules.
