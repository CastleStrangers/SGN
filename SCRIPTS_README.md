# 📝 السكريبتات - Utility Scripts

قائمة شاملة لجميع سكريبتات المشروع المحسّنة والمنظمة.

---

## 🎯 قائمة السكريبتات

### **1️⃣ المزامنة والبيانات**

#### `01-sync-facebook.ts` - 🔄 مزامنة Facebook
مزامنة تلقائية لمنشورات Facebook وإضافتها لقاعدة البيانات.

```bash
# استخدام
npm run sync
npx tsx scripts/01-sync-facebook.ts

# الجدول الزمني (Cron)
0 * * * *  # كل ساعة في الدقيقة 0
```

**الوظائف:**
- جلب آخر المنشورات من الصفحة
- معالجة وتصنيف البيانات
- حفظ في قاعدة البيانات
- إعادة تشغيل التطبيق
- عرض الإحصائيات

---

#### `02-import-facebook.ts` - 📥 استيراد تاريخي
استيراد جميع المنشورات التاريخية من Facebook منذ تاريخ محدد.

```bash
# استخدام
npm run import:facebook
npx tsx scripts/02-import-facebook.ts

# المتطلبات
FACEBOOK_PAGE_ID=61584301535331
FACEBOOK_PAGE_TOKEN=<your_token>
```

**الوظائف:**
- جلب جميع المنشورات منذ 2026-05-14
- تصنيف ذكي باستخدام AI
- حفظ في قاعدة البيانات
- تقارير مفصلة
- معالجة الأخطاء

**متطلبات الصلاحيات:**
- `pages_read_engagement`
- `pages_read_posts`

---

#### `03-reclassify-posts.ts` - 🏷️ إعادة تصنيف
إعادة تصنيف جميع المقالات باستخدام الذكاء الاصطناعي.

```bash
# استخدام
npm run reclassify
npx tsx scripts/03-reclassify-posts.ts
```

**متى تستخدمه:**
- تحديث نموذج التصنيف
- إضافة فئات جديدة
- تحسين دقة التصنيف

**الإحصائيات:**
- عدد المقالات المحدثة
- المقالات بدون تغيير
- الأخطاء والمشاكل

---

#### `04-reset-and-sync.ts` - 🧹 إعادة تعيين
حذف جميع المقالات وإعادة المزامنة من الأول.

```bash
# استخدام
npm run db:reset-sync
npx tsx scripts/04-reset-and-sync.ts

# بدون تأكيد (للإنتاج)
SKIP_CONFIRMATION=true npx tsx scripts/04-reset-and-sync.ts
```

**⚠️ تحذير:**
- يحذف جميع المقالات
- يحذف جميع التعليقات
- يحذف جميع المفضلات
- **استخدم بحذر!**

---

### **2️⃣ إدارة المستخدمين**

#### `05-manage-users.ts` - 👤 إدارة المستخدمين
إدارة المستخدمين والأدوار والصلاحيات.

```bash
# عرض جميع المستخدمين
npx tsx scripts/05-manage-users.ts list

# ترقية إلى admin
npx tsx scripts/05-manage-users.ts promote user@example.com

# خفض من admin
npx tsx scripts/05-manage-users.ts demote user@example.com

# حذف مستخدم
npx tsx scripts/05-manage-users.ts delete user@example.com
```

**الأوامر:**
- `list` - عرض جميع المستخدمين
- `promote <email>` - ترقية إلى admin
- `demote <email>` - خفض من admin
- `delete <email>` - حذف مستخدم

---

### **3️⃣ المراقبة والتشخيص**

#### `06-check-database.ts` - 🔍 فحص قاعدة البيانات
فحص حالة قاعدة البيانات والإحصائيات.

```bash
# استخدام
npx tsx scripts/06-check-database.ts
```

**المعلومات المعروضة:**
- إجمالي المقالات
- المقالات حسب المصدر
- المقالات حسب الفئة
- إحصائيات المستخدمين
- التعليقات والفعاليات
- آخر 5 مقالات
- التنبيهات والمشاكل

---

#### `07-diagnose-facebook.ts` - 🔧 تشخيص Facebook
تشخيص مشاكل الاتصال بـ Facebook API.

```bash
# استخدام
npx tsx scripts/07-diagnose-facebook.ts
```

**الفحوصات:**
- التحقق من متغيرات البيئة
- اختبار التوكن
- اختبار معرف الصفحة
- عرض الأخطاء والحلول
- حفظ التقرير في `fb_diagnose_result.txt`

**الحلول المقترحة:**
- تجديد التوكن
- التحقق من الصلاحيات
- التحقق من معرف الصفحة

---

#### `08-validate-i18n.ts` - 🌍 التحقق من i18n
البحث عن نصوص عربية مباشرة في الكود.

```bash
# استخدام
npm run i18n:check
npx tsx scripts/08-validate-i18n.ts
```

**الهدف:**
- التأكد من استخدام i18n
- منع hardcoded strings
- تحسين الترجمة

---

## 📋 الملفات الأخرى (للمرجع)

### Windows Scripts (`scripts/windows/`)
```
├── *.bat       # Batch scripts للـ development
├── *.vbs       # VBScript scripts
├── *.ps1       # PowerShell scripts
└── ecosystem.config.js  # PM2 configuration
```

---

## 🚀 إضافة السكريبتات إلى package.json

```json
{
  "scripts": {
    "sync": "npx tsx scripts/01-sync-facebook.ts",
    "import:facebook": "npx tsx scripts/02-import-facebook.ts",
    "reclassify": "npx tsx scripts/03-reclassify-posts.ts",
    "db:reset-sync": "npx tsx scripts/04-reset-and-sync.ts",
    "users": "npx tsx scripts/05-manage-users.ts",
    "check-db": "npx tsx scripts/06-check-database.ts",
    "diagnose-fb": "npx tsx scripts/07-diagnose-facebook.ts",
    "i18n:check": "npx tsx scripts/08-validate-i18n.ts"
  }
}
```

---

## 🔧 الاستخدام الشامل

### التطوير اليومي
```bash
# فحص قاعدة البيانات
npm run check-db

# مزامنة البيانات
npm run sync

# التحقق من i18n
npm run i18n:check
```

### الاستيراد الأول
```bash
# استيراد البيانات التاريخية
npm run import:facebook

# إعادة التصنيف
npm run reclassify
```

### الصيانة والإدارة
```bash
# عرض المستخدمين
npm run users list

# ترقية مستخدم
npm run users promote admin@example.com

# تشخيص المشاكل
npm run diagnose-fb
npm run check-db
```

---

## 📊 الجدول الزمني (Cron)

### المزامنة التلقائية

في `ecosystem.config.js`:

```javascript
{
  name: "sy-nl-sync",
  script: "./node_modules/tsx/dist/cli.js",
  args: "scripts/01-sync-facebook.ts",
  cron_restart: "0 * * * *",  // كل ساعة
}
```

---

## 🛠️ استكشاف الأخطاء

### خطأ: "Token غير صحيح"
```bash
npx tsx scripts/07-diagnose-facebook.ts
```

### خطأ: "لا توجد بيانات"
```bash
npm run check-db
npm run import:facebook
```

### خطأ: "Database connection"
```bash
npm run db:generate
npm run db:push
```

---

## 📝 ملاحظات مهمة

1. **جميع السكريبتات تدعم Arabic UI** ✅
2. **توثيق شامل في كل ملف** ✅
3. **معالجة أخطاء قوية** ✅
4. **تقارير مفصلة** ✅
5. **يسهل إضافة جديدة** ✅

---

## 🎯 ترتيب الأولويات

### استخدام يومي ⭐⭐⭐
- `01-sync-facebook.ts`
- `06-check-database.ts`

### استخدام أسبوعي ⭐⭐
- `03-reclassify-posts.ts`
- `05-manage-users.ts`

### استخدام شهري ⭐
- `02-import-facebook.ts`
- `07-diagnose-facebook.ts`

### للتطوير فقط
- `04-reset-and-sync.ts`
- `08-validate-i18n.ts`

---

## 💡 أفضل الممارسات

1. **استخدم `npm run`** بدلاً من `npx tsx` مباشرة
2. **تحقق من الأخطاء** في السجلات
3. **احفظ التقارير** لاستخدام لاحق
4. **استخدم الجدول الزمني** للمزامنة التلقائية
5. **اختبر في Dev قبل الإنتاج**

---

**آخر تحديث:** 16 يونيو 2026  
**الإصدار:** 0.2.0
