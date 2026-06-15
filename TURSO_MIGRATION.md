# Turso Migration Guide

## ماذا هو Turso؟
Turso هو SQLite موزع على السحابة - يسمح لك بنفس أداء SQLite ولكن مع:
- ✅ توسع عالمي
- ✅ استنساخ القراءة
- ✅ مزامنة لا محدودة
- ✅ متوافق 100% مع Prisma

---

## خطوات الهجرة

### 1️⃣ إنشاء حساب Turso
```bash
# تثبيت CLI
npm install -g @turso/cli

# تسجيل الدخول
turso auth login

# إنشاء قاعدة بيانات جديدة
turso db create sy-nl-prod
```

### 2️⃣ الحصول على بيانات الاتصال
```bash
# احصل على URL
turso db show sy-nl-prod --detailed

# نسخ DATABASE_URL مثل:
# libsql://sy-nl-prod-username.turso.io?authToken=your-token-here
```

### 3️⃣ تحديث Prisma schema
```prisma
datasource db {
  provider = "turso"
  url      = env("DATABASE_URL")
}
```

### 4️⃣ تثبيت الإضافة
```bash
npm install @prisma/adapter-turso
npm install @libsql/client
```

### 5️⃣ تحديث prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "turso"
  url      = env("DATABASE_URL")
}
```

### 6️⃣ تحديث package.json (adapter)
```json
{
  "prisma": {
    "seed": "node prisma/seed.cjs"
  }
}
```

### 7️⃣ تحديث lib/db.ts
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaTurso } from "@prisma/adapter-turso";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaTurso(libsql);
export const prisma = new PrismaClient({ adapter });
```

### 8️⃣ دفع البيانات الحالية (إن وجدت)
```bash
# استخراج من SQLite المحلي
sqlite3 prisma/dev.db ".dump" > backup.sql

# تحميل إلى Turso
turso db shell sy-nl-prod < backup.sql
```

### 9️⃣ تحديث متغيرات البيئة

**في .env.local (development):**
```
DATABASE_URL="libsql://your-db-name.turso.io?authToken=your-token"
TURSO_AUTH_TOKEN="your-token"
```

**في .env.production (Vercel):**
أضف في Vercel Dashboard:
- `DATABASE_URL`
- `TURSO_AUTH_TOKEN`

### 🔟 تشغيل الهجرة
```bash
npm run db:push
npm run db:migrate
```

---

## اختبار الاتصال
```bash
npm run db:generate
npm run typecheck

# جرب Query مبسيط
node -e "const { prisma } = require('./src/lib/db'); prisma.post.count().then(console.log)"
```

---

## إيقاف SQLite
بعد التأكد من نجاح الهجرة:
1. احذف `prisma/dev.db`
2. احذف `prisma/*.db-journal`
3. حدّث `.dockerignore` لاستثناء ملفات SQLite

---

## خصائص Turso
- ✅ مجاني للـ development (حتى 500MB)
- ✅ $7/شهر للـ production (unlimited)
- ✅ Automatic backups
- ✅ Point-in-time recovery
- ✅ Read replicas عالمية

---

## المراجع
- [Prisma + Turso](https://www.turso.tech/posts/prisma-turso-starter)
- [Turso CLI](https://docs.turso.tech/cli/introduction)
- [Prisma Turso Adapter](https://www.prisma.io/docs/orm/overview/databases/turso)
