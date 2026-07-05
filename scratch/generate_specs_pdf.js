import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const docxFilename = "SGN_Project_Specifications.docx";
const pdfFilename = "SGN_Project_Specifications.pdf";

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

// Resolve the "SGN Scriptes" target folder path
let targetFolder = path.join(desktopPath, "SGN Scriptes");
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder, { recursive: true });
}
console.log(`Target folder resolved: ${targetFolder}`);

const sgnPublicDir = path.join(process.cwd(), "public", "pdfs");
fs.mkdirSync(sgnPublicDir, { recursive: true });

const destPdfPathPublic = path.join(sgnPublicDir, pdfFilename);
const destPdfPathDesktop = path.join(targetFolder, pdfFilename);

const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>مواصفات وتفاصيل مشروع SGN</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap');
    
    body {
      font-family: 'Cairo', 'Arial', sans-serif;
      margin: 0;
      padding: 0;
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
    
    .logo-container {
      margin-bottom: 10px;
    }
    
    .logo-text {
      font-size: 28px;
      font-weight: 800;
      color: #1a5632;
      letter-spacing: 1px;
    }
    
    .logo-sub {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: -5px;
    }
    
    h1 {
      font-size: 26px;
      color: #1a5632;
      margin: 10px 0 5px 0;
      font-weight: 800;
    }
    
    .subtitle {
      font-size: 14px;
      color: #4b5563;
      margin: 0;
      font-weight: 600;
    }
    
    h2 {
      font-size: 18px;
      color: #1a5632;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 15px;
      font-weight: 700;
    }
    
    h3 {
      font-size: 15px;
      color: #0f3d23;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    p {
      font-size: 12px;
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
    }
    
    ul, ol {
      margin-top: 0;
      margin-bottom: 15px;
      padding-right: 20px;
    }
    
    li {
      font-size: 12px;
      margin-bottom: 6px;
    }
    
    .highlight-box {
      background-color: #f3fdf6;
      border-right: 4px solid #1a5632;
      padding: 12px 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
    
    .highlight-box p {
      margin: 0;
      font-weight: 600;
      color: #0f3d23;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 11px;
    }
    
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px 10px;
      text-align: right;
    }
    
    th {
      background-color: #1a5632;
      color: #ffffff;
      font-weight: 700;
    }
    
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      text-align: center;
      font-size: 9px;
      color: #9ca3af;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .badge {
      display: inline-block;
      padding: 2px 6px;
      background-color: #e6f4ea;
      color: #137333;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
    }
  </style>
</head>
<body>

  <div class="page-header">
    <div class="logo-container">
      <div class="logo-text">SGN</div>
      <div class="logo-sub">Syrian Community in the Netherlands</div>
    </div>
    <h1>وثيقة المواصفات والشرح التفصيلي لمشروع SGN</h1>
    <div class="subtitle">دليل شامل للأقسام، الميزات، لوحة التحكم الموحدة، ومجلس الإدارة</div>
  </div>

  <h2>1. مقدمة عن المنصة (Introduction)</h2>
  <p>منصة SGN (منصة الجالية السورية في هولندا) هي منصة رقمية متكاملة تهدف لخدمة وتيسير شؤون الجالية، وربط الأعضاء ببعضهم البعض، ومشاركة الأخبار، الفعاليات، والفرص التطوعية. تتبنى المنصة تقنيات حديثة لتقديم أداء ممتاز وتجربة مستخدم ذكية وسريعة لكافة أفراد المجتمع السوري في هولندا.</p>
  
  <div class="highlight-box">
    <p>تلتزم المنصة بدعم كامل للغات الثلاثة (العربية، الهولندية، والإنجليزية) مع التوافق التام للاتجاهات من اليمين لليسر (RTL) ومن اليسار لليمين (LTR).</p>
  </div>

  <h2>2. هيكلية المشروع التقنية (Project Structure & Tech Stack)</h2>
  <p>تم بناء المشروع كبيئة برمجية موحدة تدير نظام الويب والهواتف معاً لضمان أفضل تكامل ممكن:</p>
  <ul>
    <li><strong>تطبيق الويب (Web App):</strong> مبني باستخدام <strong>Next.js 16 (App Router)</strong> مع React 19 وتنسيق TailwindCSS. يحتوي على الموقع التعريفي، البوابة العامة للأعضاء، ولوحة تحكم المشرفين الكاملة.</li>
    <li><strong>تطبيق الهواتف الذكية (Mobile App):</strong> تطبيق تفاعلي للأعضاء مبني باستخدام <strong>Expo React Native (SDK 54)</strong> يدعم الشاشات التفاعلية، المحادثات المباشرة، وبطاقة العضوية الرقمية.</li>
    <li><strong>قاعدة البيانات والجداول (Database - Prisma ORM):</strong> قاعدة بيانات موحدة للويب والموبايل. تستخدم <strong>SQLite محلياً</strong> للتطوير السريع، ونظام <strong>Turso (libsql) سحابياً</strong> في الإنتاج لضمان السرعة العالية والتكلفة الفعالة.</li>
  </ul>

  <h2>3. الأقسام والميزات الذكية بالتفصيل (Detailed Features)</h2>
  
  <h3>3.1 الأخبار والفعاليات ونظام المزامنة (News & Events)</h3>
  <p>تضم المنصة قسماً متكاملاً لعرض الأخبار المصنفة (أخبار هولندا، أوروبا، الجالية، اقتصاد، ثقافيات) والفعاليات القادمة. يتم جلب المقالات آلياً عبر محرك مزامنة ذكي (Sync System) يسحب التحديثات من 3 مصادر رئيسية:</p>
  <ul>
    <li>موقع <strong>sy-nl.org</strong> الخارجي (من خلال تقنيات scraping).</li>
    <li>قناة <strong>اليوتيوب</strong> الرسمية للجالية عبر تغذية RSS.</li>
    <li>صفحة <strong>الفيسبوك</strong> الرسمية للجالية عبر Facebook Graph API.</li>
  </ul>

  <h3>3.2 نموذج الانتساب والبطاقات الرقمية (Memberships & QR)</h3>
  <p>يتميز التطبيق بنموذج انتساب ذكي مكون من عدة خطوات يسهل على المتقدمين ملء بياناتهم. بعد قبول المشرف للطلب، يتم توليد بطاقة عضوية رقمية مميزة للعضو تحتوي على رمز الاستجابة السريعة (QR Code). يمكن التحقق من صحة البطاقة فوراً من قبل مسؤولي الجالية بمسح الكود عبر كاميرا الموبايل.</p>

  <h3>3.3 المخزن الآمن وتحليل المستندات بالذكاء الاصطناعي (Safe Vault)</h3>
  <p>ميزة متطورة تتيح للمنتسبين رفع خطاباتهم الرسمية (رسائل البلدية، مصلحة الضرائب، إلخ) أو مستنداتهم الشخصية وحفظها بشكل مشفر في الخادم. يقوم الذكاء الاصطناعي المحلي (نموذج <strong>Ollama llava:7b</strong>) بتحليل الخطاب المرفوع فوراً وتلخيصه باللغة العربية وشرح الإجراءات والخطوات القانونية المطلوبة من العضو.</p>

  <div class="page-break"></div>

  <h3>3.4 المساعد الذكي المتخصص والزر العائم (AI Chat FAB)</h3>
  <p>مساعد ذكاء اصطناعي تفاعلي متوفر على الويب والموبايل، تم تخصيصه بعدة شخصيات لمساعدة المغتربين:</p>
  <ul>
    <li><strong>المساعد القانوني:</strong> للإجابة على استفسارات لم الشمل، الإقامة، والجنسية.</li>
    <li><strong>مرشد الاندماج واللغة:</strong> للمساعدة في تعلم الهولندية والتأقلم الاجتماعي.</li>
    <li><strong>مستشار التوظيف والسكن:</strong> لإرشادات البحث عن عمل وتفاصيل الإيجار الاجتماعي.</li>
  </ul>
  <p>يعمل المساعد بتقنية <strong>RAG (الاسترجاع المعزز بالمعرفة)</strong> للبحث التلقائي في أخبار وفعاليات الجالية ومجلس الإدارة لتقديم إجابات موثقة وحقيقية. وتم تسهيل الوصول إليه عبر <strong>الزر العائم للدردشة الذكية (FAB)</strong>:</p>
  <ul>
    <li><strong>في موقع الويب:</strong> يظهر زر عائم تفاعلي في كافة الصفحات، يفتح عند الضغط عليه نافذة دردشة منبثقة مصغرة (Chat Widget) تتيح للعضو محادثة المساعد وتغيير شخصياته أثناء تصفح أي خبر أو صفحة دون مغادرتها.</li>
    <li><strong>في تطبيق الموبايل:</strong> يظهر زر دائري مميز أسفل الشاشة الرئيسية للمدونة لنقل العضو بضغطة زر واحدة مباشرة إلى تبويب الدردشة الذكية.</li>
  </ul>

  <h3>3.5 دليل الخدمات المهنية (Services Directory) <span class="badge">جديد</span></h3>
  <p>دليل يتيح للمهنيين وأصحاب المشاريع من الجالية (أطباء، مقاولين، حرفيين، مترجمين، أصحاب مطاعم) التسجيل وعرض خدماتهم المهنية وتقييماتها للأعضاء الآخرين، لتعزيز التعاون الاقتصادي والاجتماعي بين السوريين في هولندا.</p>

  <h3>3.6 نظام المحادثة المباشرة والإشعارات (Direct Chat & Push)</h3>
  <p>نظام محادثة فورية P2P مشفر وربط مباشر بين الأعضاء ومزودي الخدمات في الدليل، يدعم إرسال إشعارات فورية للهواتف (Push Notifications) عبر خوادم Expo للتنبيه بالرسائل الجديدة، بالإضافة إلى <strong>نظام إشعارات فوري متكامل ومتجاوب على الويب (Notification Toaster)</strong> يظهر التنبيهات والأخبار العاجلة بشكل متناسق ومتناسب تماماً مع شاشات أجهزة الكمبيوتر (Windows) والمتصفحات المحمولة.</p>

  <h2>4. لوحة التحكم للمشرفين (Admin Control Panel Guide)</h2>
  <p>تحتوي المنصة على لوحة تحكم إدارية متكاملة تتيح للمشرفين التحكم بالعمليات اليومية وإدارتها:</p>
  
  <h3>4.1 شاشة إدارة الأعضاء والمنتسبين (Members Management)</h3>
  <p>Tتيح للمشرفين مراجعة كافة طلبات الانتساب الجديدة، مراجعة المستندات المرفقة، واتخاذ قرار القبول أو الرفض. بعد القبول، يتم تفعيل البطاقة الرقمية للعضو. كما تتيح الشاشة تصدير بيانات الأعضاء كملفات Excel أو PDF وإدارتها بشكل سلس.</p>

  <h3>4.2 شاشة إدارة الفعاليات والمتطوعين (Events & Volunteers)</h3>
  <p>شاشة مخصصة لإضافة فعاليات الجالية ومواعيدها ومواقعها الجغرافية ومتابعة الأعضاء المسجلين فيها. وقسم لإضافة الفرص التطوعية ومتابعة المتقدمين وتقييم مهاراتهم للأنشطة المختلفة.</p>

  <h3>4.3 شاشة الصلاحيات والأدوار (Roles & Permissions)</h3>
  <p>تتيح للمسؤولين تعيين الأدوار والصلاحيات للمستخدمين والمشرفين بشكل دقيق (Admin, Editor, Moderator, Member) لحفظ خصوصية البيانات.</p>

  <h3>4.4 شاشة إعدادات الموبايل والتحكم عن بعد (Mobile Remote Control)</h3>
  <p>شاشة تتيح للمشرفين تغيير الثيمات الافتراضية، تشغيل أو إيقاف ميزات محددة في الموبايل، إرسال إشعارات جماعية لكافة الأعضاء، وتحديث روابط السيرفرات والترجمات المباشرة فوراً دون الحاجة لإعادة رفع التطبيق للمتاجر.</p>

  <div class="page-break"></div>

  <h2>5. دليل لوحة التحكم الموحدة للسكريبتات (SGN CLI Control Panel Guide)</h2>
  <p>تضم المنصة أداة برمجية موحدة (SGN Control Panel) لتسهيل إدارة وتطوير المشروع دون تعقيد. تفصيل الخيارات الثمانية كالتالي:</p>
  <ul>
    <li><strong>1. تشغيل بيئة التطوير (Start Dev Environment):</strong> تشغيل خادم الويب (Next.js) وخادم الموبايل (Expo) ونظام المزامنة التلقائية معاً في بيئة واحدة وبشكل متكامل لتجربة الموقع والتطبيق محلياً.</li>
    <li><strong>2. مزامنة التعديلات ونشرها (Git Sync + Vercel Deploy):</strong> جلب آخر تحديثات المشروع وحفظ وإيداع كافة تعديلاتك البرمجية الجديدة ورفعها لـ GitHub لتحديث ونشر النسخة النهائية على السيرفر الفعلي.</li>
    <li><strong>3. بناء تطبيق الجوال (Mobile App Build):</strong> تحويل روابط خادم التطبيق لبيئة الإنتاج وبناء ملف التوزيع (Android APK) سحابياً باستخدام EAS Build.</li>
    <li><strong>4. تحديث ومزامنة قاعدة البيانات (Database Update and Sync):</strong> تحديث جداول قاعدة البيانات ومزامنتها محلياً وسحابياً على قاعدة بيانات Turso.</li>
    <li><strong>5. إصلاح تعارض مستودعات Git (Emergency Git Repair):</strong> حذف مجلدات .git العشوائية المتكونة بالخطأ في المجلدات الأبوية لإصلاح تتبع التعديلات في VS Code.</li>
    <li><strong>6. تصنيف الأخبار بالذكاء الاصطناعي (AI News Re-classification):</strong> تشغيل نموذج Ollama المحلي لتحليل وتصنيف الأخبار تلقائياً.</li>
    <li><strong>7. توليد وثيقة مواصفات المشروع (Generate Project Specs PDF):</strong> تحديث وتوليد هذا الملف المنسق وتحديث نسخته وحفظه مباشرة على جهازك.</li>
    <li><strong>8. إنشاء اختصار سطح المكتب الموحد (Create Desktop Shortcut):</strong> إنشاء اختصار مباشر للوحة التحكم على سطح المكتب.</li>
  </ul>

  <h2>6. أعضاء مجلس الإدارة الحالي (Board of Directors)</h2>
  <p>يتكون مجلس الإدارة المسجل رسمياً والنشط في قاعدة البيانات من 24 عضواً يشرفون على المكاتب المختلفة:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 10%">رقم</th>
        <th style="width: 45%">الاسم الكامل</th>
        <th style="width: 45%">المنصب / اللّجنة</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>عبد المنعم الشامان</td><td>رئيس مجلس الإدارة</td></tr>
      <tr><td>2</td><td>صالح المحمد حنايا</td><td>نائب رئيس مجلس الإدارة</td></tr>
      <tr><td>3</td><td>خالد فيصل الطويل</td><td>الأمين العام للجالية</td></tr>
      <tr><td>4</td><td>محمد سليم عزيزة</td><td>عضو مكتب الأمانة العامة (المسؤول التقني) <span class="badge">تمت الإضافة مؤخراً</span></td></tr>
      <tr><td>5</td><td>محمد رائد كعكة</td><td>رئيس المكتب المالي</td></tr>
      <tr><td>6</td><td>أحمد الحرفي</td><td>عضو مكتب الأمانة العامة (المسؤول التنظيمي)</td></tr>
      <tr><td>7</td><td>هدى الحلاق</td><td>مديرة المكتب الإعلامي</td></tr>
      <tr><td>8</td><td>رائد دهموش المشهور</td><td>مسؤول العلاقات الخارجية</td></tr>
      <tr><td>9</td><td>محمود الناصر</td><td>مسؤول العلاقات الدولية</td></tr>
      <tr><td>10</td><td>عمر النويلاتي</td><td>مسؤول النشاطات</td></tr>
      <tr><td>11</td><td>رابعة الزريقات</td><td>مسؤولة الشؤون القانونية</td></tr>
      <tr><td>12</td><td>فاتن رحال</td><td>رئيسة مكتب شؤون المرأة والأسرة</td></tr>
      <tr><td>13</td><td>حسن الحسن قطيني</td><td>مسؤول رواد الأعمال</td></tr>
      <tr><td>14</td><td>نبيل حاج حسين</td><td>مسؤول الصحة والدعم النفسي</td></tr>
      <tr><td>15</td><td>بلال الرفاعي</td><td>مسؤول الصحة والدعم النفسي</td></tr>
      <tr><td>16</td><td>محمد مصطفى سمهاني</td><td>مسؤول العلاقات الدولية</td></tr>
      <tr><td>17</td><td>نهاد سويد</td><td>مسؤول العلاقات العامة</td></tr>
      <tr><td>18</td><td>محمد أكرم الجنيدي</td><td>مسؤول الطلاب والتعليم</td></tr>
      <tr><td>19</td><td>يوسف درويش</td><td>لجنة الرقابة الداخلية</td></tr>
      <tr><td>20</td><td>محمد ربيع الجنيدي</td><td>المجلس الاستشاري</td></tr>
      <tr><td>21</td><td>وسيم حسان</td><td>المجلس الاستشاري</td></tr>
      <tr><td>22</td><td>ماهره الطواشي</td><td>المجلس الاستشاري</td></tr>
      <tr><td>23</td><td>ريمه الحربات</td><td>المجلس الاستشاري</td></tr>
      <tr><td>24</td><td>فراس هاني عابدين</td><td>المجلس الاستشاري</td></tr>
    </tbody>
  </table>

  <h2>7. قواعد التطوير والرفع (Development Rules)</h2>
  <ul>
    <li><strong>المزامنة الشاملة:</strong> أي ميزة أو تعديل أو إضافة للمفاتيح اللغوية (i18n) يجب أن تتم في ملفات ترجمة الويب والموبايل معاً لضمان عدم حدوث تعارضات.</li>
    <li><strong>قاعدة النشر الفوري:</strong> يجب رفع كل تعديل فوراً لـ GitHub وتحديث خادم الإنتاج ورابط العميل Vercel (sgn-indol.vercel.app).</li>
  </ul>

  <div class="footer">
    وثيقة مواصفات مشروع SGN • تم توليدها تلقائياً • الجالية السورية في هولندا © 2026
  </div>

</body>
</html>
`;

async function run() {
  console.log("Starting PDF generation via Playwright...");
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(htmlContent);
    await page.waitForLoadState("networkidle");
    
    // Generate PDF to public directory
    await page.pdf({
      path: destPdfPathPublic,
      format: "A4",
      margin: {
        top: "40px",
        bottom: "40px",
        left: "40px",
        right: "40px"
      },
      printBackground: true
    });
    console.log(`Saved PDF to public folder: ${destPdfPathPublic}`);
    
    // Copy PDF to SGN Scriptes folder on Desktop
    fs.copyFileSync(destPdfPathPublic, destPdfPathDesktop);
    console.log(`Copied PDF to Target Folder: ${destPdfPathDesktop}`);
    
    // Create Desktop shortcut (.lnk) pointing to the generated PDF
    try {
      console.log("Creating Desktop shortcut...");
      const vbsPath = path.join(os.tmpdir(), "create_link.vbs");
      const vbsContent = `
        Set shell = CreateObject("WScript.Shell")
        Set link = shell.CreateShortcut("${desktopPath}\\SGN Project Specifications.lnk")
        link.TargetPath = "${destPdfPathDesktop}"
        link.WorkingDirectory = "${targetFolder}"
        link.Description = "SGN Project Specifications"
        link.Save
      `;
      fs.writeFileSync(vbsPath, vbsContent);
      execSync(`cscript //NoLogo "${vbsPath}"`);
      fs.unlinkSync(vbsPath);
      console.log("Desktop shortcut created successfully via VBScript!");
    } catch (shortcutErr) {
      console.error("Could not create Desktop shortcut:", shortcutErr.message);
    }
    
  } catch (err) {
    console.error("Error in PDF generation process:", err);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

run();
