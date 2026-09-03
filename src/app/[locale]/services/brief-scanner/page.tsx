"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { 
  FileText, Upload, Sparkles, AlertTriangle, CheckCircle2, 
  Calendar, CreditCard, ShieldCheck, Crown, ArrowRight,
  RefreshCw, Building2, HelpCircle, FileSearch
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface ScanResult {
  sender: string;
  authorityKey: string;
  urgency: "high" | "medium" | "low";
  subject: string;
  deadline: string | null;
  amount: string | null;
  summary: string[];
  actionRequired: string;
  legalTip: string;
}

export default function BriefScannerPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [freeScansLeft, setFreeScansLeft] = useState(3);
  const [showVipModal, setShowVipModal] = useState(false);

  const handleScan = async (letterType?: string) => {
    if (freeScansLeft <= 0) {
      setShowVipModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/scan-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterType, locale }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setFreeScansLeft((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleScan("general");
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            <span>
              {isAr ? "مفسر الخطابات والرسائل الحكومية بالذكاء الاصطناعي" : isNl ? "AI Document & Brieven Scanner" : "AI Official Letters & Document Scanner"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr 
              ? "افهم أي خطاب رسمي هولندي خلال ثوانٍ" 
              : isNl 
              ? "Begrijp elke officiële Nederlandse brief in seconden" 
              : "Understand Any Official Dutch Letter in Seconds"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {isAr
              ? "ارفع صورة أي رسالة ورقية من البلدية، الضرائب، الـ IND، أو مصلحة العمل، وسيقوم الذكاء الاصطناعي بتلخيصها بدقة وتحديد المهل والإجراء المطلوب منك."
              : isNl
              ? "Upload een foto van uw brief van de Belastingdienst, IND, Gemeente of UWV en ontvang direct een duidelijke samenvatting met deadlines en actiepunten."
              : "Upload a photo of your letter from Dutch tax, IND, municipality, or UWV and receive an instant clear summary with deadlines and action steps."}
          </p>

          {/* Usage Badge */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isAr ? "رصيدك المجاني المتبقي:" : isNl ? "Resterende gratis scans:" : "Remaining free scans:"}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
              {isAr ? formatLocalizedDigits(freeScansLeft, "ar") : freeScansLeft} {isAr ? "عمليات فحص" : isNl ? "scans" : "scans"}
            </span>
            {freeScansLeft <= 1 && (
              <button 
                onClick={() => setShowVipModal(true)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                {isAr ? "ترقية إلى VIP" : isNl ? "Upgrade naar VIP" : "Upgrade to VIP"}
              </button>
            )}
          </div>
        </div>

        {/* Upload Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? "اختر صورة الخطاب أو اسحبها هنا" : isNl ? "Kies een foto of sleep deze hierheen" : "Select or drag your letter image here"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? "يدعم صور الموبايل (JPG, PNG) أو ملفات PDF" : isNl ? "Ondersteunt foto's (JPG, PNG) of PDF" : "Supports camera photos (JPG, PNG) or PDF"}
              </p>
            </div>

            <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-3 rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all">
              <FileSearch className="w-4 h-4" />
              <span>{isAr ? "اختيار صورة أو تصوير بالكاميرا" : isNl ? "Bestand kiezen / Camera" : "Choose File / Take Photo"}</span>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* Quick Demos (Try it now) */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">
            {isAr ? "أو جرّب نماذج حقيقية شائعة بنقرة واحدة:" : isNl ? "Of probeer direct een veelvoorkomend voorbeeld:" : "Or try common real-world samples with 1 click:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => { setSelectedDemo("cjib"); handleScan("cjib"); }}
              className={`p-3.5 rounded-2xl border text-start transition-all flex items-center gap-3 cursor-pointer ${
                selectedDemo === "cjib"
                  ? "border-red-500 bg-red-50/50 dark:bg-red-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isAr ? "مخالفة مرورية (CJIB)" : isNl ? "Verkeersboete CJIB" : "CJIB Traffic Fine"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {isAr ? "غرامة سرعة وموعد سداد" : isNl ? "Boete met betaaltermijn" : "Speeding fine & deadline"}
                </p>
              </div>
            </button>

            <button
              onClick={() => { setSelectedDemo("ind"); handleScan("ind"); }}
              className={`p-3.5 rounded-2xl border text-start transition-all flex items-center gap-3 cursor-pointer ${
                selectedDemo === "ind"
                  ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isAr ? "تجديد الإقامة (IND)" : isNl ? "Verlenging IND" : "IND Residence Renewal"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {isAr ? "تذكير قبل ٣ أشهر" : isNl ? "Herinnering 3 maanden" : "3-month reminder"}
                </p>
              </div>
            </button>

            <button
              onClick={() => { setSelectedDemo("belastingdienst"); handleScan("belastingdienst"); }}
              className={`p-3.5 rounded-2xl border text-start transition-all flex items-center gap-3 cursor-pointer ${
                selectedDemo === "belastingdienst"
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isAr ? "بدل السكن والصحة (Toeslagen)" : isNl ? "Toeslagen Belasting" : "Tax Allowances"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {isAr ? "دفعة مسبقة وإشعار دخل" : isNl ? "Voorschotbeschikking" : "Advance assessment"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? "جاري قراءة الخطاب وتحليله عبر الذكاء الاصطناعي..." : isNl ? "Brief wordt geanalyseerd..." : "Analyzing official document..."}
            </p>
            <p className="text-xs text-slate-500">
              {isAr ? "استخراج الجهة، المهل الزمنية، والمبالغ المستحقة" : isNl ? "Gegevens, deadlines en acties worden geëxtraheerd" : "Extracting authorities, deadlines, and action steps"}
            </p>
          </div>
        )}

        {/* Analysis Result Card */}
        {result && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Card Header with Urgency Badge */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              result.urgency === "high" 
                ? "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/40" 
                : "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40"
            }`}>
              <div className="flex items-center gap-2.5">
                {result.urgency === "high" ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {result.sender}
                </span>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                result.urgency === "high"
                  ? "bg-red-600 text-white"
                  : "bg-emerald-600 text-white"
              }`}>
                {result.urgency === "high" 
                  ? (isAr ? "هام وعاجل" : isNl ? "Urgent" : "Urgent")
                  : (isAr ? "إشعار اعتيادي" : isNl ? "Regulier" : "Standard Notice")}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Subject */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAr ? "موضوع الخطاب" : isNl ? "Onderwerp van de brief" : "Letter Subject"}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {result.subject}
                </h2>
              </div>

              {/* Deadline & Amount Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.deadline && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        {isAr ? "المهلة النهائية المحددة" : isNl ? "Vervaldatum / Deadline" : "Official Deadline"}
                      </p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {result.deadline}
                      </p>
                    </div>
                  </div>
                )}

                {result.amount && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        {isAr ? "المبلغ المالي المذكور" : isNl ? "Verschuldigd bedrag" : "Amount Mentioned"}
                      </p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {result.amount}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bulleted Summary */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAr ? "ملخص محتوى الخطاب" : isNl ? "Samenvatting van de inhoud" : "Key Points Summary"}
                </span>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {result.summary.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Required Box */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? "الإجراء المطلوب منك الآن" : isNl ? "Vereiste actie van u" : "Action Required From You"}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {result.actionRequired}
                </p>
              </div>

              {/* Legal Tip Box */}
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-black uppercase">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? "نصيحة قانونية من مستشاري الجالية" : isNl ? "Juridisch advies van SGN" : "Legal Advice From SGN Experts"}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.legalTip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SGN VIP Upsell Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-start">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30">
                <Crown className="w-3.5 h-3.5" />
                <span>SGN VIP Membership</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                {isAr ? "احصل على فحص غير محدود للرسائل وخصومات الجالية" : isNl ? "Onbeperkt brieven scannen & exclusieve kortingen" : "Unlimited Letter Scanning & Exclusive Discounts"}
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                {isAr 
                  ? "اشترك في العضوية الذهبية بـ ٢.٩٩ يورو فقط شهرياً، واحصل على فحص فوري لجميع خطاباتك، استشارات قانونية، وبطاقة الخصومات لدى المتاجر والمطاعم السورية في هولندا."
                  : isNl
                  ? "Word VIP-lid voor slechts € 2,99 per maand: onbeperkt scannen, juridische adviezen en kortingen bij aangesloten bedrijven."
                  : "Become a VIP member for only € 2.99/month: unlimited scans, legal advice, and discounts at partner community businesses."}
              </p>
            </div>

            <button
              onClick={() => setShowVipModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{isAr ? "الاشتراك بـ ٢.٩٩ € / شهر" : isNl ? "Start voor € 2,99 / mnd" : "Join for € 2.99 / mo"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VIP Modal */}
        {showVipModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Crown className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? "الترقية إلى عضوية SGN الذهبية" : isNl ? "Word SGN VIP Lid" : "Upgrade to SGN VIP"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? "دعم مستمر لك ولعائلتك ودعم لصندوق الجالية" : isNl ? "Ondersteun uzelf en de gemeenschap" : "Continuous support for you and the community fund"}
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "تحليل وفحص غير محدود لجميع الخطابات الحكومية" : isNl ? "Onbeperkt brieven scannen via AI" : "Unlimited AI letter & document analysis"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "بطاقة الخصومات الذكية (٥٪ إلى ١٥٪ في المتاجر والمطاعم)" : isNl ? "Exclusieve kortingskaart bij aangesloten zaken" : "Community discount card (5% to 15% off)"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? "أولوية الحجز في فعاليات ومؤتمرات الجالية" : isNl ? "Voorrang bij evenementen en workshops" : "Priority access to community events"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(isAr ? "جاري تحويلك لبوابة الدفع الهولندية الآمنة iDEAL..." : "Doorsturen naar beveiligde iDEAL betaling...");
                    setShowVipModal(false);
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isAr ? "الدفع الآمن عبر iDEAL (٢.٩٩ € / شهر)" : isNl ? "Veilig betalen met iDEAL (€ 2,99 / mnd)" : "Pay Securely via iDEAL (€ 2.99 / mo)"}</span>
                </button>

                <button
                  onClick={() => setShowVipModal(false)}
                  className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                >
                  {isAr ? "إغلاق" : isNl ? "Sluiten" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
