# دليل تحديث توكن فيسبوك للمزامنة

## 📋 المتطلبات

لتحديث توكن فيسبوك، تحتاج إلى:

1. **حساب مطور فيسبوك** (Facebook Developer Account)
2. **تطبيق فيسبوك** (Facebook App)
3. **صلاحية Page Access Token** مع `pages_read_engagement`

## 🔧 خطوات التحديث

### الطريقة 1: الحصول على Page Access Token قصير العمر (60 يوم)

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

### الطريقة 2: الحصول على Page Access Token طويل العمر (موصى به)

للحصول على توكن طويل العمر (60 يوم + إمكانية التجديد):

1. **إعداد تطبيق فيسبوك كـ Business App**
   - اذهب إلى [Facebook Developer Portal](https://developers.facebook.com/)
   - افتح تطبيقك
   - اذهب إلى **App Settings** > **Advanced**
   - في قسم **Business Settings**، أضف التطبيق إلى **Business Account**

2. **إنشاء System User**
   - اذهب إلى **Business Settings** > **Users** > **System Users**
   - أنشئ System User جديد
   - أعطِ System User صلاحيات **Admin** على التطبيق
   - أضف System User إلى صفحة الجالية `DeSyrischeGemeenschapInNederland` كـ **Admin**

3. **الحصول على Page Access Token من System User**
   - في **Graph API Explorer**، اختر التطبيق
   - في حقل **User or Page**، اختر **System User**
   - اختر **Get Page Access Token**
   - اختر صفحة الجالية
   - تأكد من تفعيل الصلاحيات:
     - `pages_read_engagement`
     - `pages_read_user_content`
     - `pages_manage_posts`
   - اضغط **Generate Access Token**

4. **تحويل التوكن إلى Long-lived Token** (اختياري)
   التوكن الناتج من الخطوة السابقة سيكون طويل العمر (60 يوماً). لتمديده أكثر:

   ```bash
   curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<SHORT_LIVED_TOKEN>"
   ```

### تحديث ملف .env

في ملف `.env` في المشروع، حدّث القيم التالية:

```env
FACEBOOK_PAGE_ID=61584301535331
FACEBOOK_PAGE_TOKEN=<التوكن الجديد هنا>
FACEBOOK_PAGE_SLUG=DeSyrischeGemeenschapInNederland
```

### اختبار المزامنة

بعد تحديث التوكن، شغّل الأمر التالي للاختبار:

```bash
npm run sync
```

أو:

```bash
npx tsx scripts/01-sync-facebook.ts
```

## ⚠️ ملاحظات مهمة

- التوكن قصير العمر يعمل لمدة **ساعات قليلة**
- التوكن طويل العمر يعمل لـ **60 يوماً**
- يمكن تجديد التوكن الطويل العمر تلقائياً قبل انتهائه
- System User هو الطريقة الوحيدة للحصول على توكن طويل العمر
- تأكد أن التطبيق في وضع **Live** وليس **Development**
- تأكد أن الصفحة عامة (Public)

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
- تحقق من صلاحيات التطبيق في Business Settings
