# 📦 دليل نشر منصة الجالية السورية على Hostinger

## المتطلبات
- حساب Hostinger مع خطة Node.js (أو Business/Cloud)
- Node.js v22 (إعداد Node.js من لوحة Hostinger)
- دومين (مثال: sy-nl.org)

## خطوات النشر

### 1. تجهيز المشروع محلياً
```bash
# تثبيت الاعتماديات
npm install

# إنشاء ملف .env بالإعدادات الصحيحة
# انظر .env.example للمتغيرات المطلوبة
```

### 2. رفع المشروع إلى Hostinger
- استخدم Git (استضافته على GitHub/GitLab)
- أو ارفع الملفات عبر FTP إلى المجلد `public_html` أو `nodeapp`

### 3. إعدادات Hostinger Node.js
- من لوحة hPanel اذهب إلى **Hosting → Advanced → Node.js Selector**
- اختر **Node.js v22**
- حدد **Document Root**: `public_html` (أو المجلد الذي رفعت إليه الملفات)
- **Application Mode**: `production`
- **Entry point**: `npm start`
- اضغط **Save** وانتظر إعادة التشغيل

### 4. متغيرات البيئة (Environment Variables)
ضبط في Hostinger hPanel:
```
DATABASE_URL="file:./prisma/dev.db"  # أو استخدم MySQL/PostgreSQL
NEXTAUTH_SECRET="<مفتاح سري قوي>"
NEXTAUTH_URL="https://sy-nl.org"
OPENAI_API_KEY="<مفتاح OpenAI API>"
NEXT_PUBLIC_APP_URL="https://sy-nl.org"
```

### 5. بناء المشروع
```bash
# توليد Prisma Client
npm run db:generate

# دفع schema إلى قاعدة البيانات
npm run db:push

# بناء المشروع
npm run build
```

### 6. إعادة تشغيل التطبيق
من Hostinger hPanel:
- اذهب إلى **Node.js Selector**
- اضغط **Restart**

### 7. تطبيق الموبايل (Expo API)
المشروع يتضمن تطبيق موبايل في مجلد `mobile/`. قبل رفع APK/IPA للإنتاج:
```bash
cd mobile
npm run set:prod   # يغير رابط API من localhost إلى sy-nl.org
npm run build:android  # أو build:ios
```
للعودة للتطوير المحلي:
```bash
npm run set:dev    # يعيد الرابط إلى localhost:3001
```

## ملاحظات مهمة
- **SQLite**: قاعدة SQLite (المستخدمة حالياً) تعمل فقط مع مثيل واحد. للاستخدام الإنتاجي يُنصح بالترقية إلى MySQL أو PostgreSQL عبر Turso.
- **الصور**: استخدم خدمة تخزين خارجية (مثل Cloudinary أو Uploadthing) للصور والمرفقات.
- **الـ SSL**: Hostinger يوفر SSL مجاني عبر Let's Encrypt.
- **التحديثات**: بعد أي تعديل، أعد تشغيل التطبيق من hPanel.
- **Vercel**: المشروع منشور أيضاً على Vercel (sgn-indol.vercel.app) للاختبار.
- **PM2**: يستخدم `ecosystem.config.js` لإدارة عمليات Node.js (port 3001 + cron sync).
