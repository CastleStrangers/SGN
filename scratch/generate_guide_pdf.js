import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const pdfFilename = "SGN_Control_Panel_Guide.pdf";

// Get Desktop path using Registry or fallbacks (supporting OneDrive)
let desktopPath = "";
try {
  const regCmd = 'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\User Shell Folders" /v Desktop';
  const regOutput = execSync(regCmd).toString();
  const match = regOutput.match(/Desktop\s+REG_EXPAND_SZ\s+(.+)/);
  if (match) {
    desktopPath = match[1].replace(/%USERPROFILE%/g, os.homedir()).trim();
  }
} catch (e) {
  // Silent fallback
}

if (!desktopPath || !fs.existsSync(desktopPath)) {
  const oneDriveDesktop = path.join(os.homedir(), "OneDrive", "Desktop");
  if (fs.existsSync(oneDriveDesktop)) {
    desktopPath = oneDriveDesktop;
  } else {
    desktopPath = path.join(os.homedir(), "Desktop");
  }
}
console.log(`Resolved Desktop Path: ${desktopPath}`);

const sgnPublicDir = path.join(process.cwd(), "public", "pdfs");
fs.mkdirSync(sgnPublicDir, { recursive: true });

const destPdfPathPublic = path.join(sgnPublicDir, pdfFilename);
const destPdfPathDesktop = path.join(desktopPath, pdfFilename);

const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>دليل استخدام لوحة التحكم الموحدة - SGN</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');
    
    body {
      font-family: 'Cairo', 'Arial', sans-serif;
      margin: 0;
      padding: 40px;
      color: #1f2937;
      background-color: #ffffff;
      line-height: 1.6;
    }
    
    .page-header {
      border-bottom: 4px solid #1a5632;
      padding-bottom: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .logo-text {
      font-size: 28px;
      font-weight: 800;
      color: #1a5632;
      letter-spacing: 1px;
    }
    
    .logo-sub {
      font-size: 12px;
      color: #c8a84e;
      text-transform: uppercase;
      font-weight: 700;
      margin-top: 5px;
    }
    
    h1 {
      font-size: 24px;
      color: #1a5632;
      margin: 15px 0 5px 0;
      font-weight: 800;
    }
    
    .subtitle {
      font-size: 14px;
      color: #4b5563;
      margin: 0;
      font-weight: 600;
    }
    
    .intro {
      background-color: #f3f4f6;
      border-right: 5px solid #c8a84e;
      padding: 15px;
      margin-bottom: 30px;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .option-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
      background-color: #fafafa;
    }
    
    .option-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }
    
    .option-number {
      background-color: #1a5632;
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-left: 15px;
    }
    
    .option-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a5632;
    }
    
    .option-title-en {
      font-size: 12px;
      color: #6b7280;
      margin-right: 10px;
      font-family: 'Courier New', Courier, monospace;
    }
    
    .option-details {
      margin-top: 10px;
    }
    
    .detail-item {
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .detail-label {
      font-weight: 700;
      color: #374151;
      display: inline-block;
      width: 120px;
    }
    
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
  </style>
</head>
<body>

  <div class="page-header">
    <div class="logo-text">SGN Control Panel Guide</div>
    <div class="logo-sub">الجالية السورية في هولندا — De Syrische Gemeenschap in Nederland</div>
    <h1>دليل استخدام لوحة التحكم الموحدة للمشروع</h1>
    <p class="subtitle">شرح وتفصيل للمهام والخيارات الثمانية المتوفرة لإدارة التطبيق والمنصة</p>
  </div>

  <div class="intro">
    تعتبر لوحة التحكم الموحدة (SGN Control Panel) الأداة البرمجية الرئيسية لتسهيل إدارة وتطوير تطبيق الويب والهاتف المحمول للجالية. تتيح لك تنفيذ كافة العمليات الحساسة بضغطة زر واحدة دون الحاجة لحفظ أو كتابة أوامر برمجية معقدة.
  </div>

  <!-- Option 1 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">1</div>
      <div class="option-title">تشغيل بيئة التطوير المحلية</div>
      <div class="option-title-en">[Start Dev Environment]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يقوم بتشغيل خادم الويب (Next.js) وخادم تطبيق الموبايل (Expo) بالإضافة إلى مراقب التحديثات التلقائي (Git Autosync) معاً في بيئة واحدة.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> يومياً عند رغبتك في تعديل أو اختبار أي ميزة برمجية على حاسوبك الشخصي.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> يفتح المتصفح تلقائياً على خادم الويب المحلي (http://localhost:3000) للبدء في التجربة.</div>
    </div>
  </div>

  <!-- Option 2 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">2</div>
      <div class="option-title">مزامنة التعديلات ونشرها على السيرفر</div>
      <div class="option-title-en">[Git Sync + Vercel Deploy]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يسحب آخر كود للمشروع من المستودع العام، ويقوم بحفظ وإيداع كافة تعديلاتك الجديدة مع طلب كتابة رسالة توضيحية للتعديل، ثم يرفعه للمستودع العام GitHub.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> عند إنجاز أي ميزة برمجية جديدة والرغبة في جعلها حية ومباشرة للزبائن والمستخدمين على السيرفر الفعلي.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> يقوم سيرفر Vercel تلقائياً ببناء ونشر النسخة النهائية من الموقع لتحديث الرابط: https://sgn-indol.vercel.app.</div>
    </div>
  </div>

  <!-- Option 3 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">3</div>
      <div class="option-title">بناء تطبيق الجوال وتصدير نسخة APK</div>
      <div class="option-title-en">[Mobile App Build]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يقوم تلقائياً بتحويل روابط خوادم التطبيق إلى السيرفر السحابي الفعلي للإنتاج، ثم يشغل أمر بناء تطبيق الأندرويد باستخدام منصة EAS Build السحابية.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> عند الانتهاء من ميزات الموبايل والرغبة في تصدير ملف APK جاهز للتثبيت على الهواتف أو رفعه للمتجر.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> تصدير نسخة نهائية مستقرة متصلة بقاعدة البيانات الفعلية للمنصة.</div>
    </div>
  </div>

  <!-- Option 4 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">4</div>
      <div class="option-title">تحديث ومزامنة قاعدة البيانات</div>
      <div class="option-title-en">[Database Update and Sync]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يقوم بدفع التعديلات الجديدة لمخطط قاعدة البيانات (Prisma schema push) محلياً، ثم يسحب متغيرات البيئة من Vercel ويطبق التحديثات في السحابة على قاعدة بيانات Turso.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> عند إضافة جداول جديدة (مثل محادثات الذكاء الاصطناعي) أو تعديل حقول مستخدمين لضمان مزامنة البيانات بين المطور والسحابة.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> تطابق تام 100% بين قواعد البيانات المحلية والسحابية.</div>
    </div>
  </div>

  <!-- Option 5 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">5</div>
      <div class="option-title">إصلاح تعارض مستودعات Git (أداة الطوارئ)</div>
      <div class="option-title-en">[Emergency Git Repair]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> سكريبت ذكي للبحث عن مجلدات .git العشوائية والقديمة المتكونة بالخطأ في المجلدات الأبوية للمشروع وحذفها تلقائياً.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم?</span> عند مواجهة مشكلة في تتبع التعديلات (Source Control) داخل VS Code أو تعليق مزامنة Git.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> عودة تتبع التعديلات للعمل بشكل سليم وسلس.</div>
    </div>
  </div>

  <!-- Option 6 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">6</div>
      <div class="option-title">تصنيف الأخبار تلقائياً بالذكاء الاصطناعي</div>
      <div class="option-title-en">[AI News Re-classification]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يشغل نموذج الذكاء الاصطناعي المحلي (Ollama) لتحليل الأخبار والمقالات المجلوبة حديثاً وتصنيفها ووضعها في الأقسام الصحيحة بالمنصة.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> بعد تشغيل المزامنة وجلب الأخبار والمقالات من المصادر الخارجية لترتيبها وتصنيفها تلقائياً.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> فرز وتصنيف دقيق للمحتوى الإخباري للموقع والتطبيق دون تدخل بشري.</div>
    </div>
  </div>

  <!-- Option 7 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">7</div>
      <div class="option-title">توليد وثيقة مواصفات المشروع PDF</div>
      <div class="option-title-en">[Generate Project Specs PDF]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> يقوم بإنشاء ملف PDF شامل يحتوي على التوصيف التقني الكامل وهيكلية الأكواد في المشروع وقواعد البيانات ليكون مرجعاً تقنياً.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> للحصول على وثيقة تقنية رسمية محدثة للمشروع لأغراض التوثيق أو المراجعة.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> حفظ ملف PDF منسق بأسلوب راقٍ ومباشرة على سطح المكتب.</div>
    </div>
  </div>

  <!-- Option 8 -->
  <div class="option-card">
    <div class="option-header">
      <div class="option-number">8</div>
      <div class="option-title">إنشاء اختصار سطح المكتب الموحد</div>
      <div class="option-title-en">[Create Desktop Shortcut]</div>
    </div>
    <div class="option-details">
      <div class="detail-item"><span class="detail-label">الوصف التفصيلي:</span> ينشئ اختصاراً واحداً ومنظماً باسم "SGN Control Panel" على سطح مكتبك ليشير إلى الملف الرئيسي.</div>
      <div class="detail-item"><span class="detail-label">متى يُستخدم؟</span> لمرة واحدة لتنظيف سطح المكتب من الاختصارات الـ 11 القديمة وتوحيدها في لوحة تحكم واحدة.</div>
      <div class="detail-item"><span class="detail-label">النتيجة:</span> سطح مكتب نظيف مع إمكانية تشغيل كافة عمليات المشروع بنقرة واحدة.</div>
    </div>
  </div>

  <div class="footer">
    تم التوليد تلقائياً بواسطة نظام التطوير الذكي للجالية السورية في هولندا &copy; 2026
  </div>

</body>
</html>
`;

(async () => {
  console.log("Generating Guide PDF...");
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({
      path: destPdfPathDesktop,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px"
      }
    });
    
    // Also save in public dir for backup/sharing
    fs.copyFileSync(destPdfPathDesktop, destPdfPathPublic);
    
    await browser.close();
    console.log(`Success! PDF saved to Desktop: ${destPdfPathDesktop}`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    process.exit(1);
  }
})();
