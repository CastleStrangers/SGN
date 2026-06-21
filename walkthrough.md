# توثيق التعديلات - اعتماد خط المراعي ونظام الألوان الجديد والأتمتة

تم تطبيق التغييرات المطلوبة بنجاح وتوحيدها عبر جميع أجزاء المشروع (موقع الويب وتطبيق الموبايل) وفقاً للضوابط البرمجية والتصميمية:

## 1. موقع الويب (Next.js)

* **الملف المعدل**: [layout.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/layout.tsx)
  * تم استبدال خط `Cairo` تماماً واستيراد خط **"Almarai"** من خوادم Google Fonts وإضافته كمتغير CSS مخصص.
* **الملف المعدل**: [globals.css](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/globals.css)
  * تم توجيه الخط الافتراضي للواجهة `--font-sans` ليعتمد على خط المراعي الجديد `--font-almarai`.
  * تم التأكد من استخدام الأبيض الناصع للعناوين والأبيض الشفاف للنصوص الطويلة المساعدة.

## 2. تطبيق الموبايل (Expo React Native)

* **الملف المعدل**: [_layout.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/mobile/app/_layout.tsx)
  * تم عمل آلية تحميل ديناميكية لخط **"Almarai"** بمختلف أوزانه (الخفيف، العادي، العريض) من خوادم Google Fonts عند بدء تشغيل التطبيق لضمان تماسك التصميم.
  * تم عمل حل برمجي ذكي وفعّال (Monkey-patching) لتطبيق خط المراعي كخط افتراضي لجميع عناصر النصوص (`Text` و `TextInput`) بشكل تلقائي مع المحافظة على سماكة النصوص الصحيحة (عريض أو عادي).
* **الملف المعدل**: [colors.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/mobile/constants/colors.ts)
  * تم إدراج ثوابت اللون الأبيض الناصع (`textWhite`) واللون الأبيض الشفاف (`textWhiteMuted`) لتسهيل استخدامهما في كافة شاشات التطبيق لراحة العين.

## 3. أتمتة العمليات وسيرفر التطوير (Automation & Dev Server)

* **الملف المعدل**: [run-sync-and-preview.bat](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/run-sync-and-preview.bat)
  * **إصلاح ترميز وأخطاء التشغيل**: تم التغلب على مشاكل إغلاق السكريبت المفاجئ عند التشغيل:
    1. **استبدال الرموز غير المعيارية**: تم استبدال الرموز الخاصة مثل علامة الصح الملونة `[✓]` بنصوص برمجية معيارية `[OK]` لتجنب أخطاء فك الترميز في موجه أوامر ويندوز (`cmd.exe`) طبقاً لصفحات الترميز المحلية (Active Code Pages).
    2. **منع الأخطاء البرمجية (Syntax Errors)**: تم تعديل طريقة معالجة رسائل الـ Commit المدخلة من قبل المستخدم باستخدام أسلوب `if not defined` بدلاً من التحقق النصي المباشر بالمتغيرات المحاطة بالاقتباسات المزدوجة، مما يمنع حدوث تشابك ونهاية غير متوقعة للسكريبت في حال لم يكتب العميل أي رسالة ضغط وتركها فارغة.
    3. **تشغيل السيرفر المحلي**: تم ربط إطلاق السيرفر المباشر بالدالة الافتراضية للمشروع `npm run dev` بدلاً من استدعاء `npx next dev` المباشر بخيارات قد لا تتناسب مع إصدار Next.js 16 الحالي.
  * يقوم بالآتي بالترتيب:
    1. التحقق من السيرفر على منفذ 3000 وإطلاقه في نافذة مستقلة إذا لم يكن يعمل.
    2. تحديث رابط الموبايل للإنتاج تلقائياً.
    3. إضافة ملفات التعديل وعمل Commit و Push لمستودع SGN على GitHub.
    4. تفعيل سكريبت vercel للرفع على المنصة السحابية.
    5. فتح روابط المعاينة المحلية والتجريبية تلقائياً.

* **الملف المعدل**: [start.bat](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/start.bat)
  * تم إصلاح مسار المجلد الصارم والمغلوط (الذي كان يشير للقرص `E:`) ليصبح ديناميكياً 100% باستخدام المتغير `%~dp0` ليقوم بالعمل على أي قرص أو مسار بشكل مرن ومباشر.

---

## نتائج التحقق والتشغيل البصري

لقد قمنا بتشغيل متصفح آلي للتأكد من عمل خادم التطوير المحلي وتطبيق التصميمات الجديدة على الرابط `http://localhost:3000`:

### لقطات شاشة من خادم التطوير بعد تطبيق التعديلات:

![الصفحة الرئيسية للجالية بعد تطبيق خط المراعي والألوان](C:\Users\msali\.gemini\antigravity-ide\brain\3b0a31f3-2be7-44c2-a6a5-04e5abff3b46\home_page_dev_server_1781917499215.png)

![تصفح الجزء السفلي من الصفحة الرئيسية](C:\Users\msali\.gemini\antigravity-ide\brain\3b0a31f3-2be7-44c2-a6a5-04e5abff3b46\home_page_scrolled_1781917503751.png)

### تسجيل فيديو لعملية التحقق من الموقع:

![تسجيل فيديو لعملية التحقق وتصفح الموقع](C:\Users\msali\.gemini\antigravity-ide\brain\3b0a31f3-2be7-44c2-a6a5-04e5abff3b46\test_dev_server_1781917461035.webp)

## 4. إصلاح خطأ البناء وتوافق الـ CI/CD (Prisma 7 & ESLint)
* **المشكلة الأولى (Vercel & local)**: فشل البناء مع الخطأ `P1012: The datasource property url is no longer supported in schema files`.
  * **الحل**: تم تعديل ملف [schema.prisma](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/prisma/schema.prisma) وإزالة سطر `url` لتفويض الاتصال بالكامل إلى [prisma.config.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/prisma.config.ts).
* **المشكلة الثانية (فشل فحص ESLint على GitHub)**: كان فحص الكود يفشل لعدم عثور ESLint 9 على حزم تابعة لـ Next.js.
  * **الحل**: قمنا بإدراج الحزمة المفقودة **`eslint-config-next`** في ملف [package.json](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/package.json) تحت قسم حزم التطوير `devDependencies`.
* **المشكلة الثالثة (فشل توليد Prisma Client على GitHub)**: عند تشغيل `prisma generate` في بيئة GitHub الآلية، ينهار البناء لعدم وجود ملف `.env` وطلب بريزما الصارم لـ `DATABASE_URL`.
  * **الحل**: قمنا بتعديل [prisma.config.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/prisma.config.ts) ليعتمد على `process.env.DATABASE_URL` مع توفير مسار قاعدة بيانات SQLite محلي احتياطي (`file:./prisma/dev.db`) عند غياب متغير البيئة، مما يسمح بالاختبار والتوليد بنجاح دون أخطاء.

## 5. استبدال صندوق فيسبوك بويدجت مواقيت الصلاة في هولندا
* **الملف المعدل**: [sidebar.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/sidebar.tsx)
  * تم إزالة كود الـ iframe التابع لفيسبوك بالكامل واستبداله بالمكون الجديد `<PrayerTimesWidget />`.
* **الملف الجديد**: [prayer-times.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/prayer-times.tsx)
  * تم بناء ويدجت مواقيت الصلاة بشكل ديناميكي كامل، حيث يتصل بـ Aladhan API لجلب المواقيت بناءً على المدينة المختارة.
  * يدعم 7 مدن هولندية كبرى (أمستردام، روتردام، لاهاي، أوترخت، آيندهوفن، جرونينجن، أنسخيده).
  * يقوم بالتحقق التلقائي من الوقت الفعلي لتمييز الصلاة القادمة ببادرة بصرية متحركة باللون الذهبي، ويعرض التقويم الهجري المقابل.
* **ملفات الترجمة (i18n)**:
  * تم إضافة مفاتيح الترجمة الخاصة بالمواقيت والمدن في ملفات الويب: [ar.json](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/messages/ar.json)، [en.json](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/messages/en.json)، [nl.json](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/messages/nl.json).
  * تم الحفاظ على المزامنة الكاملة مع ملفات تطبيق الموبايل بإضافة نفس المفاتيح في: `mobile/i18n/{ar,en,nl}.json`.

## 6. إصلاح أخطاء الـ Lint وتسهيل الوصول (Accessibility)
* **أزرار التصفح (Pagination)** في صفحة الأخبار [page.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/%5Blocale%5D/news/page.tsx):
  * تم إضافة الخصائص `title` و `aria-label` لأزرار الصفحة السابقة والتالية لتوفير نصوص مسموعة واضحة لقارئات الشاشة.
* **عنصر الاختيار (Select)** في ويدجت مواقيت الصلاة [prayer-times.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/prayer-times.tsx):
  * تم إضافة الخصائص `title` و `aria-label` لتسهيل الوصول والتنقل عبر لوحة المفاتيح.
  * تم التخلص من التنسيق المضمن (inline style) المسبب للتحذير ونقل الخاصية `color-scheme` إلى فئات Tailwind المدمجة.
* **الروابط الخارجية** في الشريط الجانبي [sidebar.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/sidebar.tsx):
  * تم تزويد جميع الروابط التي تفتح في علامة تبويب جديدة (`target="_blank"`) بالخاصية الحمائية والأمنية `rel="noopener noreferrer"` لمنع هجمات التزييف وتحسين الأمان البرمجي.

## 7. تطوير وتوضيح تصميم الأعلام بدقة فائقة (High-Resolution Premium Flags)
* **الملف المعدل الرئيسي**: [flags.tsx](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/flags.tsx)
  * **النجوم الثلاثة المطورة**: تم تصميم النجوم هندسياً ورياضياً بشكل خماسي مثالي، وتكبير حجمها بنسبة **1.6x** مع موازنتها بدقة عمودياً وأفقياً بتباعد قدره `1.26` وحدة، مما يمنع اندماج النجوم معاً أو ظهورها كخط مشوش في الشاشات الصغيرة.
  * **الألوان عالية التباين**:
    * علم الثورة السوري: الأخضر الزمردي الزاهي (`#00A95C`)، الأبيض الناصع (`#FFFFFF`)، والأسود الهادئ الشيك (`#121212`) لحواف ناعمة، والأحمر الناصع للنجوم (`#E30A17`).
    * علم هولندا: الأحمر الساطع (`#E30A17`)، والأزرق الملكي العميق الكوبالت (`#004C97`).
  * **طبقة اللمعان الزجاجية النقية**: تم استبدال التدرج اللوني المعتم والغامق الذي كان يسبب غبشاً، بلمعان زجاجي مسطح وناعم جداً في النصف العلوي فقط بنسبة عتامة خفيفة للغاية (`opacity="0.08"`) مع إطار رفيع خارجي يضمن بروز العلم.
  * **تلافي تداخل المعرفات (ID Conflicts)**: تم تعيين معرفات قص فريدة ديناميكية (`clip-syria-v2` و `clip-dutch-v2`) لضمان عدم تداخل الإطارات عند استدعاء الأعلام المتكرر.
  * **ميكرو أنيميشن**: تم تزويد جميع الأعلام بتأثير تفاعلي حركي سلس عند مرور الماوس (`transition-transform hover:scale-105`).

* **تكبير وتوسيع شاشات العرض**:
  * [الهيدر الرئيسي](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/site-header.tsx): تم زيادة الحجم من `w-6 h-4` (24px) إلى الحجم المميز والأوضح **`w-8 h-5` (32px)**.
  * [الفوتر](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/home/site-footer.tsx): تم التكبير من `w-5 h-3` إلى **`w-[28px] h-[18px]`** بنسبة أبعاد 3:2 حادة التميز.
  * [استمارة العضوية](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/components/membership/MembershipForm.tsx): تم التكبير إلى **`w-9 h-6` (36px)** لإعطاء طابع ترحيبي عالي الدقة للترويسة.
  * [صفحة التسجيل](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/%5Blocale%5D/signup/page.tsx) و[الدخول](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/%5Blocale%5D/login/page.tsx): تم التكبير إلى **`w-9 h-6`** في شاشات المكتب و **`w-8 h-5`** لشاشات الجوال.
  * [لوحة التحكم](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/%5Blocale%5D/dashboard/layout.tsx): تكبير الأعلام في القائمة الجانبية لتصبح **`w-6 h-4` (24px)** لتبدو مقروءة وبارزة جداً.

---

## 8. إصلاح مشكلة الصور الفارغة لفيسبوك وحفظ الوسائط محلياً أو سحابياً
* **الملف المعدل**: [db-sync.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/lib/sync/db-sync.ts)
  * تم تعديل دالة `syncArticleToDb` بحيث تكتشف تلقائياً وجود صور خارجية أو روابط فيسبوك CDN عند إنشاء أي مقال جديد.
  * تقوم الدالة باستدعاء أدوات التحميل التلقائي لتنزيل جميع الصور الملحقة بمحتوى المقال وصورته المصغرة وحفظها بشكل دائم في قاعدة البيانات بدلاً من الروابط الخارجية المؤقتة.
* **الملف المعدل**: [media.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/lib/sync/media.ts)
  * تم إضافة فحص وقائي في دالة `downloadMedia` لمنع محاولة تحميل الملفات التي تم تنزيلها مسبقاً (مثل الروابط النسبية أو روابط النطاق المحلي) لتجنب حدوث عمليات تحميل مكررة أو لا نهائية.
  * **دعم Vercel Blob للمنصات السحابية**: تم دمج حزمة `@vercel/blob` داخل دالة التنزيل؛ في حال وجود توكن `BLOB_READ_WRITE_TOKEN` (سواء في بيئة Vercel أو محلياً)، يتم تلقائياً رفع جميع الصور والوسائط إلى مخزن Vercel Blob السحابي وتخزين مسار الـ CDN السحابي الدائم في قاعدة البيانات، مع الاحتفاظ بآلية الكتابة المحلية في المجلد `public/uploads/sync` كخيار بديل عند غياب التوكن.
* **الملف المعدل**: [types.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/lib/sync/types.ts)
  * تم إيقاف تفعيل فيسبوك كالمصدر الافتراضي للمزامنة التلقائية مجدداً (`enabled: false`) في قائمة المصادر. يمنع هذا الكرون المجدول من تشغيل المزامنة مجدداً، بينما يحتفظ المسؤول بالقدرة على تشغيل الاستيراد اليدوي التاريخي أو المزامنة من لوحة التحكم.
* **الملف المعدل**: [extractor.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/lib/sync/extractor.ts)
  * تم إضافة حل بديل وذكي (Fallback) في دالة `extractAllImagesAndText` للتعامل مع الموقع الرسمي `sy-nl.org` بعد تحوله لبيئة بناء Hostinger / Zyro التي تعتمد على التصيير من طرف العميل (Client-side rendering).
  * في حال غياب وسوم HTML التقليدية (`<section>`)، يقوم السكربت تلقائياً باستخراج بيانات الـ JSON المسلسلة المضمنة في سمة الـ `props` داخل الصفحة وتفكيكها، ومن ثم استخراج جميع كتل النصوص العربية وصور الـ Zyro وروابط الفيديوهات المصاحبة وربطها بالـ Blocks الصحيحة لإنتاج مقالات كاملة البيانات بدون أي أخطاء.

---

## 9. أتمتة جلب الأخبار تلقائياً وحل مشكلة تحديث روابط العميل (On-Demand Universal Sync)
* **الملف المعدل**: [route.ts](file:///d:/I-Ai/App/Syrian%20community%20in%20the%20Netherlands/SGN/src/app/api/news/route.ts)
  * تم تطوير آلية التحديث التلقائي لتصبح شاملة لجميع البيئات (التطوير المحلي، والاستضافة التجريبية على Vercel، والاستضافة الإنتاجية).
  * بدلاً من الاعتماد الكلي على كرون السيرفر المجدول (الذي لا يعمل في بيئات Vercel السحابية)، يقوم خادم التطوير أو خادم الإنتاج بإطلاق مهمة المزامنة تلقائياً في الخلفية (Background Sync) بمجرد فتح أي مستخدم للصفحة الرئيسية واستدعاء واجهة الأخبار.
  * تم ربط المزامنة بجدول `AppSetting` في قاعدة البيانات لضبط خنق التكرار (Throttle):
    * **بيئة التطوير المحلي**: المزامنة مرة واحدة كحد أقصى كل **5 دقائق**.
    * **بيئة الإنتاج والرفع التجريبي**: المزامنة مرة واحدة كحد أقصى كل **30 دقيقة**.
  * تضمن هذه الطريقة بقاء رابط العميل التجريبي والروابط الرسمية محدثة بأحدث الأخبار ومنشورات فيسبوك تلقائياً وبشكل دوري بمجرد تصفح الموقع.

---

## 10. إصلاح بناء الـ CI/CD في GitHub Actions
* تم إدراج حزمة الترجمة والمراجعة البرمجية `eslint-config-next` إلى ملف `package.json` كحزمة تطوير.
* تم إعداد `prisma.config.ts` للعمل بمرونة مع قواعد بيانات SQLite الاحتياطية عند تشغيل `prisma generate` في بيئة GitHub Actions الخالية من قواعد البيانات.
* بفضل هذه التغييرات، ستتخطى عمليات الدمج (Merge) والـ Commits كافة اختبارات البناء بنجاح كامل.


