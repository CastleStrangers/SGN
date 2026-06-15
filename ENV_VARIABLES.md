# متغيرات البيئة - SY-NL Platform

## نظرة عامة
هذا المستند يشرح جميع متغيرات البيئة المستخدمة في منصة الجالية السورية في هولندا.

---

## 📌 متغيرات الإجبارية (Development)

### قاعدة البيانات
```bash
DATABASE_URL="file:./prisma/dev.db"  # SQLite محلي للتطوير
```

### المصادقة (NextAuth)
```bash
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"  # لتشفير الجلسات
NEXTAUTH_URL="http://localhost:3000"  # رابط التطبيق للتطوير
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # رابط عام
```

---

## 🚀 متغيرات الإنتاج

### قاعدة البيانات (Turso)
```bash
DATABASE_URL="libsql://your-database.turso.io?authToken=TOKEN"
TURSO_AUTH_TOKEN="your-turso-token"
```

### المصادقة
```bash
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://sy-nl.org"
NEXTAUTH_INTERNAL_URL="https://sy-nl.org"  # للطلبات الداخلية
NEXT_PUBLIC_APP_URL="https://sy-nl.org"
```

### Node.js
```bash
NODE_ENV="production"
NEXT_TELEMETRY_DISABLED="1"  # تعطيل التليمترى من Next.js
```

---

## 🤖 AI و LLM

### OpenAI (Production)
```bash
OPENAI_API_KEY="sk-..."  # مفتاح OpenAI
OPENAI_MODEL="gpt-4o-mini"  # النموذج المستخدم
```

### Gemini (اختياري)
```bash
GEMINI_API_KEY="your-gemini-key"
```

### Ollama (Development فقط)
```bash
AI_PROVIDER="ollama"  # في .env.local
OLLAMA_HOST="http://localhost:11434"
```

### اختيار الـ Provider تلقائياً
```bash
AI_PROVIDER="auto"  # ollama في dev، openai في production
```

---

## 🔐 OAuth Providers

### Google
```bash
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Facebook
```bash
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-secret"
FACEBOOK_PAGE_ID="61584301535331"
FACEBOOK_PAGE_TOKEN="your-page-token"
FACEBOOK_PAGE_SLUG="DeSyrischeGemeenschapInNederland"
```

### Azure AD
```bash
AZURE_AD_CLIENT_ID="your-azure-client-id"
AZURE_AD_CLIENT_SECRET="your-azure-secret"
AZURE_AD_TENANT_ID="your-tenant-id"  # أو "common"
```

### Apple
```bash
APPLE_ID="your-apple-id"
APPLE_SECRET="your-apple-secret"
```

---

## 📧 البريد الإلكتروني

### SMTP Configuration
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"  # ⚠️ ليس كلمة المرور العادية
SMTP_FROM="noreply@sy-nl.org"
```

### Nodemailer
```bash
# استخدم SMTP أعلاه أو أضف:
EMAIL_FROM="noreply@sy-nl.org"
```

---

## 🔴 أمان و Validation

### reCAPTCHA
```bash
RECAPTCHA_SITE_KEY="your-recaptcha-site-key"  # عام
RECAPTCHA_SECRET_KEY="your-recaptcha-secret"  # سري
```

---

## 📱 Telegram Integration

للتنبيهات والرسائل:
```bash
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-id"
```

---

## ⚡ Redis (Caching & Rate Limiting)

### Upstash Redis
```bash
REDIS_URL="https://your-redis-url.upstash.io"
REDIS_TOKEN="your-redis-token"
```

### أو ioredis محلي
```bash
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"  # اختياري
```

---

## 🔄 Sync & Background Jobs

```bash
SYNC_INTERVAL="0 * * * *"  # Cron: كل ساعة في الدقيقة 0
SYNC_MEDIA_DIR="public/uploads/sync"  # مجلد المزامنة
SYNC_AUTO_CATEGORIZE="true"  # تصنيف تلقائي للمحتوى
SYNC_DOWNLOAD_MEDIA="true"  # تحميل الصور
```

---

## 📦 Cloud Storage (S3)

اختياري - لتخزين الملفات:
```bash
S3_ENDPOINT="https://s3.amazonaws.com"
S3_REGION="eu-west-1"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET="sy-nl-media"
```

---

## 📱 Mobile App (Expo)

```bash
EXPO_PUBLIC_API_URL="http://localhost:3001"  # dev
# أو في production:
EXPO_PUBLIC_API_URL="https://sy-nl.org/api"

EXPO_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
```

قبل البناء للإنتاج:
```bash
cd mobile
npm run set:prod
```

---

## 📊 Analytics

### Google Analytics
```bash
NEXT_PUBLIC_GA_ID="GA-XXXXXXXXX-X"
```

---

## 🔗 Webhooks و Integrations

### Make.com أو Zapier
```bash
SOCIAL_PUBLISH_WEBHOOK_URL="https://hook.make.com/..."
```

---

## 📋 قائمة الفحص - قبل الإنتاج

- [ ] تم تغيير `NEXTAUTH_SECRET` إلى قيمة قوية
- [ ] تم تعيين `DATABASE_URL` إلى Turso أو PostgreSQL
- [ ] تم تفعيل جميع مفاتيح OAuth المطلوبة
- [ ] تم إعداد SMTP للبريد
- [ ] تم تفعيل reCAPTCHA
- [ ] تم تعيين Redis إذا كنت تستخدمه
- [ ] تم تحديث أرابط `NEXTAUTH_URL` و `NEXT_PUBLIC_APP_URL`
- [ ] تم تعطيل الـ logging الحساس في production
- [ ] تم اختبار جميع الخدمات الخارجية

---

## 🔍 كيفية الحصول على المتغيرات

### Google OAuth
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع جديد
3. فعّل Google+ API
4. أنشئ OAuth 2.0 Credentials (OAuth consent screen)
5. انسخ Client ID و Client Secret

### Facebook
1. اذهب إلى [Facebook Developers](https://developers.facebook.com)
2. أنشئ تطبيق جديد
3. أضف Facebook Login product
4. انسخ App ID و App Secret

### Turso
```bash
turso auth login
turso db create sy-nl-prod
turso db shell sy-nl-prod --url
```

### Redis (Upstash)
1. اذهب إلى [Upstash](https://upstash.com)
2. أنشئ قاعدة بيانات Redis جديدة
3. انسخ UPSTASH_REDIS_REST_URL و UPSTASH_REDIS_REST_TOKEN

---

## ⚠️ نصائح أمان

1. **لا تكشف السرار** - لا تضع المفاتيح في Git
2. **استخدم Vercel Secrets** - لتخزين آمن في الإنتاج
3. **استخدم متغيرات محلية** - `.env.local` للتطوير (مستثناة من Git)
4. **استدر الرموز دورياً** - غيّر المفاتيح كل 90 يوم
5. **استخدم environment-specific secrets** - لا تشارك المفاتيح بين dev و prod

---

## 📝 مثال `.env.local` (Development)

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="dev-secret-not-used-in-production-change-me"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI (Ollama locally)
AI_PROVIDER="ollama"
OLLAMA_HOST="http://localhost:11434"

# Mobile
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

---

## 📝 مثال `.env.production` (Production)

انظر إلى ملف `.env.production` في المشروع للقالب الكامل.

---

## 🆘 استكشاف الأخطاء

### خطأ: "NEXTAUTH_SECRET not set"
```bash
echo "تأكد من وجود NEXTAUTH_SECRET في متغيرات البيئة"
```

### خطأ: "Database connection error"
```bash
# تحقق من DATABASE_URL
npx prisma db push
```

### خطأ: "Redis connection refused"
```bash
# تأكد من تشغيل Redis أو استخدام Upstash
redis-cli ping
```

---

## المراجع
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth Configuration](https://next-auth.js.org/configuration/options)
- [Prisma Database URLs](https://www.prisma.io/docs/orm/reference/connection-urls)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
