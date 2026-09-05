"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  HeartHandshake, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, 
  CheckCircle2, Users, Euro, Copy, Check, ExternalLink, Building2,
  Heart, AlertCircle
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface CampaignItem {
  id: string;
  titleAr: string;
  titleEn: string;
  titleNl: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionNl: string;
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  urgent?: boolean;
}

const CAMPAIGNS: CampaignItem[] = [
  {
    id: "repatriation",
    titleAr: "صندوق طوارئ الجالية ونقل الجثامين والدفن الإسلامي",
    titleEn: "Community Emergency, Repatriation & Funeral Fund",
    titleNl: "Gemeenschaps Noodfonds, Repatriëring & Uitvaart",
    descriptionAr: "تأمين التكاليف الطارئة لنقل المتوفين من أبناء الجالية إلى سوريا أو مراسم الدفن الشرعي والإسلامي في المقابر المخصصة في هولندا، ومساندة العائلات في أوقات الشدة.",
    descriptionEn: "Covers emergency costs for repatriating deceased community members or arranging dignified Islamic funerals in the Netherlands, supporting grieving families.",
    descriptionNl: "Dekt noodkosten voor repatriëring of waardige islamitische uitvaarten in Nederland ter ondersteuning van nabestaanden.",
    targetAmount: 25000,
    raisedAmount: 18450,
    donorsCount: 342,
    urgent: true,
  },
  {
    id: "legal",
    titleAr: "صندوق المساندة القانونية للم الشمل وقضايا الهجرة المعقدة",
    titleEn: "Legal Aid & Family Reunification Support Fund",
    titleNl: "Juridisch Steunfonds voor Gezinshereniging",
    descriptionAr: "تغطية رسوم المحامين والطعون القانونية للعائلات السورية المتعثرة مادياً في قضايا لم الشمل المعلقة لدى محكمة الاستئناف ودائرة الهجرة IND.",
    descriptionEn: "Subsidizing legal fees and court appeals for low-income families with stalled IND family reunification cases.",
    descriptionNl: "Subsidieert advocaatkosten en beroepsprocedures voor vastgelopen IND-gezinsherenigingszaken bij kwetsbare gezinnen.",
    targetAmount: 15000,
    raisedAmount: 9200,
    donorsCount: 185,
  },
  {
    id: "education",
    titleAr: "صندوق دعم الطلاب والتعليم العالي والاندماج الأكاديمي",
    titleEn: "Syrian Students Higher Education & Integration Fund",
    titleNl: "Fonds voor Studenten & Hoger Onderwijs",
    descriptionAr: "مساعدة الطلاب السوريين في الجامعات والمعاهد الهولندية في تأمين الكتب، متطلبات التخرج، وتعديل الشهادات الجامعية عبر نوفييك (Nuffic).",
    descriptionEn: "Empowers Syrian students in Dutch universities with study materials, graduation requisites, and Nuffic diploma evaluation fees.",
    descriptionNl: "Ondersteunt Syrische studenten in het hoger onderwijs met studiematerialen en diplomawaardering via Nuffic.",
    targetAmount: 12000,
    raisedAmount: 7600,
    donorsCount: 140,
  },
];

export default function SolidarityHubPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [activeCampaign, setActiveCampaign] = useState<CampaignItem | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedIban, setCopiedIban] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const officialIban = "NL90 ABNA 0148 7498 95";

  const handleCopyIban = () => {
    navigator.clipboard.writeText(officialIban.replace(/\s+/g, ""));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Back Navigation */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الرئيسية" : isNl ? "Terug naar Home" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5632] via-[#144226] to-[#0d2d1a] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 border border-white/10">
              <HeartHandshake className="w-4 h-4 text-[#c8a84e]" />
              <span>
                {isAr
                  ? "صندوق التكافل الاجتماعي والمساندة الإنسانية (ANBI)"
                  : isNl
                  ? "Solidariteitsfonds & Maatschappelijke Steun (ANBI)"
                  : "Social Solidarity & Humanitarian Relief Fund (ANBI)"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {isAr ? "يدٌ واحدة لحماية ومساندة أبناء الجالية" : isNl ? "Samen Sterk voor Elkaar in Nederland" : "Standing Together in Times of Need"}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isAr
                ? "مبادرة تكافلية رسمية ومرخصة تضمن الوقوف مع العائلات السورية في هولندا في أصعب الظروف الطارئة. رقابة مالية كاملة وشفافية مطلقة تحت مظلة المنفعة العامة."
                : isNl
                ? "Een officieel en transparant initiatief om Syrische gezinnen in Nederland te ondersteunen bij noodsituaties, juridische kwesties en uitvaarten."
                : "A certified community solidarity platform providing direct assistance in emergencies, funeral repatriations, and urgent legal family defense."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>KvK: 96718943</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Building2 className="w-4 h-4 text-[#c8a84e]" />
                <span>RSIN: 867730286 (ANBI)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 font-mono" dir="ltr">
                ABN AMRO: {officialIban}
              </span>
            </div>
          </div>

          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAMPAIGNS.map((camp) => {
            const title = isAr ? camp.titleAr : isNl ? camp.titleNl : camp.titleEn;
            const desc = isAr ? camp.descriptionAr : isNl ? camp.descriptionNl : camp.descriptionEn;
            const percentage = Math.min(100, Math.round((camp.raisedAmount / camp.targetAmount) * 100));

            const targetFormatted = isAr ? formatLocalizedDigits(camp.targetAmount, "ar") : camp.targetAmount.toLocaleString("en-US");
            const raisedFormatted = isAr ? formatLocalizedDigits(camp.raisedAmount, "ar") : camp.raisedAmount.toLocaleString("en-US");
            const donorsFormatted = isAr ? formatLocalizedDigits(camp.donorsCount, "ar") : camp.donorsCount;
            const percentFormatted = isAr ? formatLocalizedDigits(percentage, "ar") : percentage;

            return (
              <div
                key={camp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {camp.urgent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-200/50">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? "أولوية إنسانية عاجلة" : "Urgent Priority"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/50">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{isAr ? "حملة مستمرة" : "Ongoing Campaign"}</span>
                      </span>
                    )}

                    <span className="text-xs font-black text-slate-400 font-mono">
                      {percentFormatted}%
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                    {desc}
                  </p>
                </div>

                {/* Progress Bar & Numbers */}
                <div className="space-y-3 pt-2">
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#c8a84e] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "تم جمعه" : "Raised"}</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        € {raisedFormatted}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "المساهمون" : "Donors"}</span>
                      <span className="font-black text-slate-700 dark:text-slate-200">
                        {donorsFormatted}
                      </span>
                    </div>

                    <div className="text-end">
                      <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "الهدف" : "Target"}</span>
                      <span className="font-black text-slate-500 dark:text-slate-400">
                        € {targetFormatted}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCampaign(camp)}
                    className="w-full py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{isAr ? "ساهم وتبرع للحملة" : isNl ? "Doneer Direct" : "Donate Now"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Donation Modal with iDEAL & Bank Details */}
        {activeCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              dir={dir}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative"
            >
              <button
                onClick={() => {
                  setActiveCampaign(null);
                  setDonationSuccess(false);
                }}
                className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>

              {!donationSuccess ? (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {isAr ? "صندوق التكافل الإنساني المعتمد" : "ANBI Certified Campaign"}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {isAr ? activeCampaign.titleAr : activeCampaign.titleEn}
                    </h3>
                  </div>

                  {/* Preset Amounts */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? "اختر مبلغ المساهمة:" : "Select Donation Amount:"}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[15, 25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount("");
                          }}
                          className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            selectedAmount === amt && !customAmount
                              ? "bg-[#1a5632] text-white border-[#1a5632] shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          € {isAr ? formatLocalizedDigits(amt, "ar") : amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bank Details & QR */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isAr ? "الحساب البنكي الرسمي (ABN AMRO)" : "Official IBAN"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {copiedIban ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIban ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "نسخ الآيبان" : "Copy IBAN")}</span>
                      </button>
                    </div>

                    <p className="font-mono font-black text-sm text-slate-900 dark:text-white tracking-wider" dir="ltr">
                      {officialIban}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAr
                        ? "يمكنك التحويل المباشر عبر تطبيق البنك الهولندي مع كتابة اسم الحملة في الملاحظات، أو المتابعة للدفع الإلكتروني."
                        : "Transfer directly with your Dutch banking app or proceed with instant checkout."}
                    </p>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCampaign(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationSuccess(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>{isAr ? "تأكيد المساهمة عبر iDEAL" : "Proceed with iDEAL"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isAr ? "جزاكم الله خيراً وتقبل تبرعكم" : "Thank you for your generous support!"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {isAr
                        ? "تم تسجيل نيتكم للتبرع لحساب الجمعية المعتمد. سيصلكم إشعار وتأكيد رسمي بالخصم الضريبي على البريد الإلكتروني فور معالجة التحويل."
                        : "Your contribution has been noted. An official ANBI tax deductible receipt will be sent upon clearance."}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveCampaign(null);
                      setDonationSuccess(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    {isAr ? "إغلاق" : "Close"}
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
