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
2. ✅ يتحدث رابط الزبون بعد الـ push: `https://sgn-msalimaziza-3522s-projects.vercel.app`
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
| **Vercel** | `https://sgn-msalimaziza-3522s-projects.vercel.app` | `vercel --prod` |
| **Mobile APK/IPA** | N/A | `cd mobile && npm run build:android` |

> `sy-nl.org` هو موقع خارجي لجلب المعلومات والأخبار فقط — ليس من مشروعنا.

## 🔄 Auto-update the Client URL

Before building the mobile app for production:
```bash
cd mobile && npm run set:prod
```
This changes `mobile/constants/config.ts` to use `https://sgn-msalimaziza-3522s-projects.vercel.app`.
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

## ⚡ Critical Patterns

- **Next.js 16**: `params` is `Promise` — must `await` in API routes and page components
- **Auth**: `getServerSession(authOptions)` (NEVER `getServerSession()` without authOptions)
- **API i18n**: `tReq(req, key)` or `getApiMessage(locale, key, vars)` — NEVER hardcoded Arabic
- **Hydration**: `suppressHydrationWarning` + `mounted` state for client-only values (theme, etc.)
- **Responsive**: RTL-first for Arabic, LTR for English/Dutch
- **Ports**: Web dev = `:3000`, Web prod = `:3001`, Mobile dev = `http://localhost:3001/api`
- **AI Chatbot**: `POST /api/chat/ai` — uses Ollama (`qwen2.5:7b`, local); system prompt defines assistant as Syrian community expert; rate-limited (30 msg/min); saves to `ChatAISession` + `ChatAIMessage` tables
- **AI Switch (Gemini → Ollama)**: All AI features (chat, translate, summarize, sentiment, polish-text, extract-id) now use `src/lib/ai/ollama.ts` instead of Google Gemini because the Gemini free-tier quota was exhausted. Ollama runs locally on port 11434. Ollama models: `qwen2.5:7b` (text, default), `llava:7b` (vision). Set via env vars `OLLAMA_MODEL`, `OLLAMA_VISION_MODEL`, `OLLAMA_HOST`.
- **Ollama Models**: `ollama pull qwen2.5:7b` (~4.7GB, excellent Arabic) for text; `ollama pull llava:7b` (~4.5GB) for vision (ID extraction). Must be running (`ollama serve`) before using any AI features.
- **RAG (Retrieval Augmented Generation)**: `src/lib/ai/rag.ts` — extracts keywords from user question, searches News (Post), Events, and Volunteer tables; injects results into system prompt for fact-aware answers
- **Mobile Chat**: `mobile/app/(tabs)/messages.tsx` — 4th tab in mobile app; AI chat with suggested questions, message bubbles, typing indicator; uses `mobile/lib/chat.ts` API functions

## 📌 When You See "OP:..." or Similar Prefixes

The user may reference prior sessions. The `AGENTS.md` file is the authoritative source for project rules.
