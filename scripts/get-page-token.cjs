const https = require('https');
const fs = require('fs');
const path = require('path');

const userToken = process.argv[2];

if (!userToken) {
  console.error("\n❌ خطأ: يرجى تمرير الـ User Access Token كمعامل للسكربت.");
  console.error("مثال الاستخدام:");
  console.error("   node scripts/get-page-token.cjs \"EAAXc2ostbs8...\"\n");
  process.exit(1);
}

const url = `https://graph.facebook.com/v19.0/me/accounts?access_token=${userToken}`;

console.log("⏳ جاري الاتصال بـ Facebook API للحصول على توكن الصفحة...");

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const pages = response.data || [];
      const targetPage = pages.find(p => p.id === "943115162210802" || p.name.includes("الجسور") || p.name.includes("Gemeenschap"));
      
      if (!targetPage) {
        console.error("\n❌ لم يتم العثور على الصفحة المطلوبة (De Syrische Gemeenschap in Nederland) في هذا الحساب.");
        console.log("الصفحات المتاحة:");
        pages.forEach(p => console.log(`   • ${p.name} (ID: ${p.id})`));
        process.exit(1);
      }
      
      const pageToken = targetPage.access_token;
      console.log(`\n✅ تم العثور على الصفحة: ${targetPage.name}`);
      console.log(`🔑 توكن الصفحة (Page Access Token): \n${pageToken}\n`);
      
      // تحديث ملف .env تلقائياً
      const envPath = path.join(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('FACEBOOK_PAGE_TOKEN')) {
          envContent = envContent.replace(
            /FACEBOOK_PAGE_TOKEN="[^"]*"/,
            `FACEBOOK_PAGE_TOKEN="${pageToken}"`
          );
        } else {
          envContent += `\nFACEBOOK_PAGE_TOKEN="${pageToken}"`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log("💾 تم تحديث ملف .env المحلي بالتوكن الجديد تلقائياً!");
      }
      
      console.log("\n🚀 يمكنك الآن تشغيل المزامنة:");
      console.log("   npm run import:facebook\n");
      process.exit(0);
      
    } catch (e) {
      console.error("\n❌ فشل استخراج التوكن:");
      console.error(`   ${e.message}\n`);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('\n❌ خطأ في الاتصال بالإنترنت: ' + err.message);
  process.exit(1);
});
