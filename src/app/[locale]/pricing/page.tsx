"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { 
  Crown, Check, Sparkles, Building2, ShieldCheck, CreditCard, 
  ArrowRight, HeartHandshake, Zap, Bell, CheckCircle2, ChevronRight
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

const DUTCH_BANKS = [
  { id: "ing", name: "ING Bank" },
  { id: "rabobank", name: "Rabobank" },
  { id: "abnamro", name: "ABN AMRO" },
  { id: "sns", name: "SNS Bank" },
  { id: "asnbank", name: "ASN Bank" },
  { id: "bunq", name: "bunq" },
];

export default function PricingPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("ing");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const vipMonthly = "2.99";
  const vipYearly = "29.00";

  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/20">
            <Crown className="w-3.5 h-3.5" />
            <span>
              {isAr ? "عضوية الجالية وباقات الأعمال" : isNl ? "Lidmaatschap & Zakelijke Pakketten" : "Membership & Business Plans"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "مبالغ رمزية بقيمة حقيقية... لك وللجالية" : isNl ? "Symbolische bedragen, maximale waarde" : "Small Contributions, Maximum Value"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            {isAr
              ? "اشترك في العضوية الذهبية واستفد من خدمات الذكاء الاصطناعي وخصومات المتاجر، أو وثّق نشاطك التجاري في دليل الأعمال الهولندي. جميع الاشتراكات تساهم في صندوق الجالية وتطوير المنصة."
              : isNl
              ? "Word VIP-lid en profiteer van onbeperkte AI-hulp en kortingen, of promoot uw onderneming in onze bedrijvengids. Uw bijdrage ondersteunt de gemeenschap."
              : "Become a VIP member to unlock unlimited AI letter explanations and merchant discounts, or list your business in our Dutch-Syrian directory."}
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {isAr ? "اشتراك شهري" : isNl ? "Maandelijks" : "Monthly"}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "yearly"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span>{isAr ? "اشتراك سنوي" : isNl ? "Jaarlijks" : "Yearly"}</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-black">
                {isAr ? "وفر شهرين" : isNl ? "2 mnd gratis" : "2 mo free"}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Free Member */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isAr ? "عضوية عادية" : isNl ? "Gratis Lid" : "Free Member"}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {isAr ? "عضو مسجل" : isNl ? "Standaard Lid" : "Community Member"}
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">€ 0</span>
                <span className="text-xs text-slate-400 font-medium">/ {isAr ? "دائماً مجاناً" : isNl ? "gratis" : "free"}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? "الوصول الأساسي لمحتوى وأخبار المنصة ودليل الخدمات." : isNl ? "Basis toegang tot nieuws en de dienstengids." : "Basic access to community news and directory."}
              </p>

              <div className="space-y-2.5 pt-4 border-t text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تصفح الأخبار والفعاليات" : isNl ? "Toegang tot nieuws & evenementen" : "Browse news & events"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "٣ عمليات فحص مجانية للرسائل الحكومية" : isNl ? "3 gratis scans voor brieven" : "3 free letter scans"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "بطاقة عضوية إلكترونية رقمية" : isNl ? "Digitale lidmaatschapskaart" : "Digital membership card"}</span>
                </div>
              </div>
            </div>

            <button
              disabled
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs rounded-xl cursor-default"
            >
              {isAr ? "خطتك الحالية" : isNl ? "Huidige plan" : "Current Plan"}
            </button>
          </div>

          {/* Card 2: SGN VIP (Featured) */}
          <div className="bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border-2 border-amber-500 shadow-xl relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 right-6 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {isAr ? "الأكثر فائدة وشعبية" : isNl ? "Meest Populair" : "Most Popular"}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>SGN VIP Plus</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {isAr ? "العضوية الذهبية" : isNl ? "Gouden Lidmaatschap" : "Gold VIP Membership"}
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  € {isAr ? formatLocalizedDigits(billingCycle === "monthly" ? vipMonthly : vipYearly, "ar") : (billingCycle === "monthly" ? vipMonthly : vipYearly)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / {billingCycle === "monthly" ? (isAr ? "شهرياً" : isNl ? "maand" : "month") : (isAr ? "سنوياً" : isNl ? "jaar" : "year")}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isAr 
                  ? "فحص غير محدود لجميع أوراقك الرسمية مع خصومات حقيقية في المطاعم والمتاجر."
                  : isNl
                  ? "Onbeperkt brieven scannen via AI en exclusieve kortingen bij aangesloten zaken."
                  : "Unlimited AI official letter explanation and exclusive discounts at partner stores."}
              </p>

              <div className="space-y-2.5 pt-4 border-t text-xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? "فحص وتحليل غير محدود للرسائل الحكومية" : isNl ? "Onbeperkt brieven scannen (AI)" : "Unlimited AI letter scanning"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? "بطاقة الخصومات الحصرية (٥٪ إلى ٢٥٪)" : isNl ? "Kortingspas bij Syrische winkels & horeca" : "5% to 25% partner discounts"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? "إضافة البطاقة لـ Apple Wallet & Google Wallet" : isNl ? "Apple Wallet & Google Wallet ondersteuning" : "Apple & Google Wallet digital pass"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? "شارة VIP ذهبية موثقة وأولوية في الفعاليات" : isNl ? "VIP badge & voorrang bij evenementen" : "Verified VIP badge & priority"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isAr ? "تحميل سيرة ذاتية هولندية مجاناً" : isNl ? "Gratis Nederlands CV downloaden" : "Free Dutch CV downloads"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan("vip")}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? "ترقية إلى VIP الذهبية" : isNl ? "Word VIP Lid" : "Upgrade to VIP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Business Silver */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isAr ? "للشركات والمشاريع" : isNl ? "Zakelijk" : "Business"}</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {isAr ? "باقة الأعمال الفضية" : isNl ? "Zilver Zakelijk" : "Silver Business"}
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  € {isAr ? formatLocalizedDigits("15", "ar") : "15"}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {isAr ? "شهرياً" : isNl ? "maand" : "month"}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? "لأصحاب المتاجر والمطاعم والمهنيين لجذب الزبائن السوريين." : isNl ? "Voor winkels, horeca en dienstverleners in Nederland." : "For shops, restaurants, and service providers."}
              </p>

              <div className="space-y-2.5 pt-4 border-t text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "إدراج في دليل الخدمات الرسمي" : isNl ? "Vermelding in officiële bedrijvengids" : "Listed in official directory"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "شارة «نشاط موثق من الجالية ✅»" : isNl ? "Geverifieerd Gemeenschapsbedrijf label" : "Verified Community Partner badge"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "رابط مباشر للواتساب والهاتف" : isNl ? "Directe WhatsApp- en belknop" : "Direct WhatsApp & call links"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تحديد موقع محلك على الخريطة التفاعلية" : isNl ? "Locatie op interactieve kaart" : "Pinpoint on interactive map"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan("silver")}
              className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              {isAr ? "تسجيل باقة فضية (١٥ €)" : isNl ? "Kies Zilver (€ 15)" : "Choose Silver (€ 15)"}
            </button>
          </div>

          {/* Card 4: Business Gold */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAr ? "إعلانات ونمو مميز" : isNl ? "Premium Zakelijk" : "Growth Partner"}</span>
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {isAr ? "باقة الأعمال الذهبية" : isNl ? "Goud Zakelijk" : "Gold Business"}
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  € {isAr ? formatLocalizedDigits("49", "ar") : "49"}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {isAr ? "شهرياً" : isNl ? "maand" : "month"}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? "حضور تسويقي بارز مع بانر إعلاني وإشعارات موجهة للمقاطعات." : isNl ? "Maximale zichtbaarheid met advertentiebanner en pushberichten." : "Maximum visibility with top ranking, banner, and targeted notifications."}
              </p>

              <div className="space-y-2.5 pt-4 border-t text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "تثبيت في قمة نتائج البحث والدليل" : isNl ? "Bovenaan zoekresultaten & gids" : "Pinned at top of directory"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "بانر إعلاني في واجهة الموقع والتطبيق" : isNl ? "Banner op homepage & app" : "Banner on homepage & app"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "إشعار موجه Push Notification للمقاطعة" : isNl ? "Gerichte pushmelding per provincie" : "Geo-targeted push notifications"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isAr ? "نشر عرضك الخاص في شبكة الخصومات" : isNl ? "Exclusieve aanbieding op kortingenpagina" : "Featured deal on discounts page"}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan("gold")}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              {isAr ? "تسجيل باقة ذهبية (٤٩ €)" : isNl ? "Kies Goud (€ 49)" : "Choose Gold (€ 49)"}
            </button>
          </div>
        </div>

        {/* Solidarity Fund Info Card */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div className="space-y-2 text-center md:text-start">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {isAr ? "أين تذهب مبالغ الاشتراكات الرمزية؟" : isNl ? "Waar gaat uw symbolische bijdrage heen?" : "Where do your contributions go?"}
            </h4>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isAr
                ? "تتوزع العائدات بشفافية كاملة: جزء يغطي تكاليف السيرفرات والبنية التحتية والذكاء الاصطناعي وتطوير التطبيق، والجزء الآخر يذهب مباشرة لصندوق الجالية السورية في هولندا لدعم الأسر المتعثرة في الحالات الطارئة والأنشطة الثقافية والتعليمية للجيل القادم."
                : isNl
                ? "De inkomsten worden transparant gebruikt voor serverkosten, AI-infrastructuur en app-ontwikkeling, en vloeien rechtstreeks terug naar het gemeenschapsfonds ter ondersteuning van sociale projecten en de taalacademie."
                : "Contributions transparently support platform hosting, AI APIs, and mobile app maintenance, while directly funding the Syrian Community Fund for emergency assistance and educational programs."}
            </p>
          </div>
        </div>

        {/* Checkout Modal (iDEAL Simulator) */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
              {!paymentSuccess ? (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {isAr ? "الدفع الآمن عبر iDEAL" : isNl ? "Veilig betalen met iDEAL" : "Secure Payment with iDEAL"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedPlan === "vip" 
                        ? (isAr ? `اشتراك SGN VIP الذهبي (${billingCycle === "monthly" ? "٢.٩٩ € / شهر" : "٢٩.٠٠ € / سنة"})` : `SGN VIP Plus (${billingCycle === "monthly" ? "€ 2,99 / mnd" : "€ 29,00 / jr"})`)
                        : selectedPlan === "silver" 
                        ? (isAr ? "باقة الأعمال الفضية (١٥.٠٠ € / شهر)" : "Zilver Zakelijk (€ 15,00 / mnd)")
                        : (isAr ? "باقة الأعمال الذهبية (٤٩.٠٠ € / شهر)" : "Goud Zakelijk (€ 49,00 / mnd)")}
                    </p>
                  </div>

                  {/* Bank Select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {isAr ? "اختر بنكك الهولندي:" : isNl ? "Kies uw Nederlandse bank:" : "Select your Dutch Bank:"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DUTCH_BANKS.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBank(b.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-start cursor-pointer ${
                            selectedBank === b.id
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300"
                              : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {checkoutLoading ? (
                        <span>{isAr ? "جاري الاتصال بالبنك..." : isNl ? "Verbinden met uw bank..." : "Connecting to bank..."}</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isAr ? "تأكيد الدفع عبر التطبيق البنكي" : isNl ? "Bevestig betaling via bank app" : "Confirm via Bank App"}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      {isAr ? "إلغاء" : isNl ? "Annuleren" : "Cancel"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {isAr ? "تم الدفع وتفعيل الاشتراك بنجاح! 🎉" : isNl ? "Betaling geslaagd! Welkom bij VIP 🎉" : "Payment Successful! Welcome to VIP 🎉"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isAr 
                      ? "تم تفعيل شارة VIP الذهبية في حسابك وبطاقتك الرقمية، ويمكنك الآن استخدام فحص الرسائل والخصومات بلا حدود."
                      : isNl
                      ? "Uw VIP-status is geactiveerd. U kunt nu onbeperkt brieven scannen en kortingen claimen."
                      : "Your VIP membership is now active. Enjoy unlimited scans and community partner discounts."}
                  </p>
                  <button
                    onClick={() => { setPaymentSuccess(false); setSelectedPlan(null); }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                  >
                    {isAr ? "الذهاب للخدمات" : isNl ? "Naar diensten" : "Go to Services"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
