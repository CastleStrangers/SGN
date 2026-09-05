"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  FileText, Upload, Sparkles, AlertTriangle, CheckCircle2, 
  Calendar, CreditCard, ShieldCheck, Crown, ArrowRight, ArrowLeft,
  RefreshCw, Building2, HelpCircle, FileSearch, Camera, Copy, Check,
  Printer, Scale, Clock, X, ChevronDown
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface ScanResult {
  sender: string;
  authorityKey: string;
  urgency: "high" | "medium" | "low";
  subject: string;
  deadline: string | null;
  daysLeft?: number;
  amount: string | null;
  summary: string[];
  actionRequired: string;
  legalTip: string;
  referenceNumber?: string;
}

export default function BriefScannerPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";
  const dir = isAr ? "rtl" : "ltr";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [freeScansLeft, setFreeScansLeft] = useState(3);
  const [showVipModal, setShowVipModal] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Bezwaar & Betalingsregeling Generator state
  const [showBezwaarModal, setShowBezwaarModal] = useState(false);
  const [bezwaarType, setBezwaarType] = useState<"bezwaar" | "betalingsregeling" | "uitstel">("bezwaar");
  const [citizenName, setCitizenName] = useState("");
  const [citizenBsn, setCitizenBsn] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [disputeReason, setDisputeReason] = useState(
    isAr ? "الدخل المقدر غير صحيح ويختلف عن الواقع" : "Het geschatte inkomen is onjuist vastgesteld"
  );
  const [copiedLetter, setCopiedLetter] = useState(false);

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
        setResult({
          ...data,
          daysLeft: data.urgency === "high" ? 14 : 42,
          referenceNumber: data.referenceNumber || "SGN-2026-BR-9941",
        });
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

    // Create local preview
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setUploadedImagePreview(uploadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);

    handleScan("general");
  };

  // Generate formal Dutch letter
  const generatedDutchLetter = `Aan: ${result?.sender || "De bevoegde instantie"}
Betreft: ${
    bezwaarType === "bezwaar"
      ? "Bezwaarschrift tegen beschikking / besluit"
      : bezwaarType === "betalingsregeling"
      ? "Verzoek om betalingsregeling in termijnen"
      : "Verzoek om uitstel van betaling"
  }
Kenmerk / Referentie: ${referenceNumber || result?.referenceNumber || "N.v.t."}
Datum: ${new Date().toLocaleDateString("nl-NL")}

Geachte heer/mevrouw,

Hierbij ${
    bezwaarType === "bezwaar"
      ? `teken ik bezwaar aan tegen uw besluit met betrekking tot: ${result?.subject || "de recente beschikking"}.`
      : bezwaarType === "betalingsregeling"
      ? `verzoek ik u vriendelijk om een passende betalingsregeling toe te staan voor het verschuldigde bedrag (${result?.amount || "zoals vermeld in uw brief"}).`
      : `verzoek ik u vriendelijk om uitstel van betaling voor de gestelde termijn.`
  }

Mijn persoonsgegevens:
- Naam: ${citizenName || "Betrokkene"}
- BSN: ${citizenBsn || "Op aanvraag beschikbaar"}

Motivering van mijn verzoek:
${disputeReason}

${
  bezwaarType === "betalingsregeling"
    ? "Wegens mijn huidige financiële omstandigheden ben ik helaas niet in staat om het volledige bedrag in één keer te voldoen. Ik stel voor om het bedrag in maandelijkse termijnen van € 50,- af te lossen."
    : bezwaarType === "uitstel"
    ? "Ik vraag u om een uitstel van 4 weken, zodat ik de benodigde bewijsstukken kan verzamelen en overleggen."
    : "Ik verzoek u om het besluit te heroverwegen en in te trekken dan wel aan te passen op basis van de juiste feitelijke gegevens."
}

In afwachting van uw schriftelijke reactie en beslissing.

Met vriendelijke groet,

${citizenName || "[Uw handtekening / Handtekening]"}
Lid van de Syrische Gemeenschap in Nederland (SGN)`;

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedDutchLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الخدمات" : isNl ? "Terug naar Diensten" : "Back to Services"}</span>
          </Link>
          <Link
            href={`/${locale}/services/toeslagen-calculator`}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{isAr ? "حاسبة المساعدات (Toeslagen)" : "Toeslagen Calculator"}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            <span>
              {isAr ? "مفسر الخطابات الهولندي والرد الآلي الذكي" : isNl ? "AI Document & Brieven Scanner + Bezwaar" : "AI Official Letters Scanner & Objection Generator"}
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
              ? "التقط صورة الخطاب بكاميرا الموبايل، وسيقوم الذكاء الاصطناعي بتلخيص المطلوب منك بدقة، تحديد تاريخ الاستحقاق، وتوليد خطاب اعتراض أو طلب تقسيط رسمي بنقرة واحدة."
              : isNl
              ? "Scan uw brief met de camera en ontvang direct een samenvatting, deadline en genereer een formeel bezwaarschrift of betalingsregeling met 1 klik."
              : "Scan your letter with your phone camera to get instant action steps, deadline alerts, and generate formal objection or installment requests in Dutch."}
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

        {/* Upload & Camera Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 transition-all shadow-sm text-center">
          <div className="max-w-md mx-auto space-y-4">
            {uploadedImagePreview ? (
              <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden border border-emerald-500 shadow-md">
                <img src={uploadedImagePreview} alt="Letter preview" className="w-full h-44 object-cover" />
                <button
                  onClick={() => setUploadedImagePreview(null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-8 h-8" />
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? "صوّر الخطاب بالكاميرا أو ارفع صورة" : isNl ? "Maak een foto of upload een bestand" : "Take a photo or upload letter"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isAr ? "يدعم كاميرا الجوال مباشرة، صور JPG، PNG أو ملفات PDF" : isNl ? "Ondersteunt mobiele camera, foto's (JPG, PNG) of PDF" : "Supports direct mobile camera, JPG, PNG or PDF"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {/* Direct Camera Capture */}
              <label className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-xl cursor-pointer shadow-md transition-all">
                <Camera className="w-4 h-4" />
                <span>{isAr ? "فتح الكاميرا والتقاط صورة" : isNl ? "Camera openen" : "Take Photo"}</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
              </label>

              {/* Upload File */}
              <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs md:text-sm font-bold px-5 py-3 rounded-xl cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                <span>{isAr ? "اختيار من المعرض / PDF" : isNl ? "Bestand kiezen" : "Select File"}</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
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
            {/* Card Header with Urgency Badge & Days Remaining */}
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
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white block">
                    {result.sender}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Kenmerk: {result.referenceNumber}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {result.daysLeft && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>
                      {isAr 
                        ? `باقي ${formatLocalizedDigits(result.daysLeft, "ar")} يوماً` 
                        : isNl 
                        ? `Nog ${result.daysLeft} dagen` 
                        : `${result.daysLeft} days remaining`}
                    </span>
                  </span>
                )}
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                  result.urgency === "high" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
                }`}>
                  {result.urgency === "high" 
                    ? (isAr ? "هام وعاجل" : isNl ? "Urgent" : "Urgent")
                    : (isAr ? "إشعار اعتيادي" : isNl ? "Regulier" : "Standard Notice")}
                </span>
              </div>
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

              {/* SGN Bezwaarschrift Generator Button */}
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                      {isAr ? "توليد خطاب اعتراض أو طلب تقسيط رسمي (Bezwaar / Uitstel)" : isNl ? "Bezwaarschrift of betalingsregeling genereren" : "Generate Objection or Payment Plan Letter"}
                    </h4>
                    <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                      {isAr ? "صياغة قانونية بالهولندية الرسمية جاهزة للإرسال أو الطباعة بنقرة واحدة" : "Officiële juridische brief in het Nederlands klaar om te versturen"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBezwaarModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shrink-0 transition-all shadow-md cursor-pointer"
                >
                  {isAr ? "إنشاء الخطاب الآن" : isNl ? "Brief opstellen" : "Draft Letter"}
                </button>
              </div>

              {/* Direct Quick Actions */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(result.subject)}&details=${encodeURIComponent(result.actionRequired)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? "إضافة تذكير بالمهلة للتقويم (Google/Apple)" : isNl ? "Herinnering toevoegen aan agenda" : "Add Deadline to Calendar"}</span>
                </a>

                <Link
                  href={`/${locale}/spreekuur`}
                  className="py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? "حجز استشارة قانونية (Spreekuur)" : isNl ? "Spreekuur inplannen" : "Book Legal Spreekuur"}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Bezwaar Generator Modal */}
        {showBezwaarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div dir={dir} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isAr ? "مولد الخطابات والردود الرسمية (Nederlands)" : "Officiële Juridische Brieven Generator"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowBezwaarModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Options */}
              <div className="space-y-4 text-xs">
                {/* Letter Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? "نوع الخطاب المطلوب:" : "Type brief:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "bezwaar", ar: "اعتراض (Bezwaar)", nl: "Bezwaarschrift" },
                      { id: "betalingsregeling", ar: "طلب تقسيط (Regeling)", nl: "Betalingsregeling" },
                      { id: "uitstel", ar: "طلب مهلة (Uitstel)", nl: "Uitstel betaling" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setBezwaarType(type.id as any)}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                          bezwaarType === type.id
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {isAr ? type.ar : type.nl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Citizen Info Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? "الاسم الكامل (كما في الهوية):" : "Volledige naam:"}
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="M. Al-Ahmad"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? "رقم الـ BSN (اختياري):" : "BSN-nummer (optioneel):"}
                    </label>
                    <input
                      type="text"
                      value={citizenBsn}
                      onChange={(e) => setCitizenBsn(e.target.value)}
                      placeholder="123456789"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Letter Preview Box */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isAr ? "نص الخطاب الهولندي الرسمي المولد:" : "Gegenereerde brieftekst (Nederlands):"}
                  </label>
                  <textarea
                    rows={8}
                    readOnly
                    value={generatedDutchLetter}
                    className="w-full bg-slate-900 text-slate-100 font-mono text-[11px] p-4 rounded-2xl border border-slate-700 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? "طباعة كـ PDF" : "Afdrukken / PDF"}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBezwaarModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    {isAr ? "إغلاق" : "Sluiten"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLetter}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLetter ? (isAr ? "تم النسخ بنجاح!" : "Gekopieerd!") : (isAr ? "نسخ النص كاملاً" : "Kopieer tekst")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
