# دليل تحديث توكن فيسبوك للمزامنة

## 📋 المتطلبات

لتحديث توكن فيسبوك، تحتاج إلى:

1. **حساب مطور فيسبوك** (Facebook Developer Account)
2. **تطبيق فيسبوك** (Facebook App)
3. **صلاحية Page Access Token** مع `pages_read_engagement`

## 🔧 خطوات التحديث

### 1. الحصول على Page Access Token جديد

1. اذهب إلى [Facebook Developer Portal](https://developers.facebook.com/)
2. افتح تطبيقك أو أنشئ تطبيق جديد
3. اذهب إلى **Tools & APIs** > **Graph API Explorer**
4. اختر التطبيق من القائمة
5. في حقل **User or Page**، اختر **Get Page Access Token**
6. اختر صفحة الجالية: `DeSyrischeGemeenschapInNederland`
7. في قسم **Permissions**، تأكد من تفعيل:
   - `pages_read_engagement`
   - `pages_read_user_content`
8. اضغط **Generate Access Token**
9. انسخ التوكن الناتج

### 2. تحديث ملف .env

في ملف `.env` في المشروع، حدّث القيم التالية:

```env
FACEBOOK_PAGE_ID=61584301535331
FACEBOOK_PAGE_TOKEN=<التوكن الجديد هنا>
FACEBOOK_PAGE_SLUG=DeSyrischeGemeenschapInNederland
```

### 3. اختبار المزامنة

بعد تحديث التوكن، شغّل الأمر التالي للاختبار:

```bash
npm run sync
```

أو:

```bash
npx tsx scripts/01-sync-facebook.ts
```

## ⚠️ ملاحظات مهمة

- التوكن قد تنتهي صلاحيته بعد 60 يوماً إذا كان قصير العمر
- للحصول على توكن طويل العمر، تحتاج إلى:
  1. إضافة تطبيقك إلى **Business Account**
  2. طلب **Page Access Token** من خلال **System User**
  3. استخدام **Long-lived Token**

## 🔍 تشخيص المشاكل

إذا فشلت المزامنة، شغّل:

```bash
npx tsx scripts/07-diagnose-facebook.ts
```

هذا السكريبت سيقوم بفحص:
- صحة التوكن
- الصلاحيات المطلوبة
- الاتصال بـ Graph API
- جلب منشورات تجريبية

## 📞 الدعم

إذا واجهت مشاكل:
- راجع [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- تأكد من أن الصفحة عامة (Public)
- تأكد من أن التطبيق في وضع **Live** وليس **Development**
