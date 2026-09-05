"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  Calculator, ShieldAlert, ArrowLeft, ArrowRight, HeartPulse, Home, 
  Baby, GraduationCap, CheckCircle2, AlertTriangle, ExternalLink, 
  HelpCircle, RefreshCw, Printer, Info, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

type ToeslagType = "all" | "zorg" | "huur" | "kind" | "opvang";

export default function ToeslagenCalculatorPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";
  const dir = isAr ? "rtl" : "ltr";

  // State: Household & Income
  const [hasPartner, setHasPartner] = useState(false);
  const [annualIncome, setAnnualIncome] = useState<number>(24000);
  const [partnerIncome, setPartnerIncome] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(680);
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [childcareHours, setChildcareHours] = useState<number>(40);
  const [childcareHourlyRate, setChildcareHourlyRate] = useState<number>(10.25);
  const [hasSocialAssistance, setHasSocialAssistance] = useState(false); // Bijstand

  const totalIncome = hasPartner ? annualIncome + partnerIncome : annualIncome;

  // 2026 Calculations based on Belastingdienst estimates & standard formulas
  const calculations = useMemo(() => {
    // 1. Zorgtoeslag (Healthcare Allowance)
    let monthlyZorg = 0;
    const zorgThreshold = hasPartner ? 47500 : 37500;
    const maxZorg = hasPartner ? 235 : 123;
    if (totalIncome < 26000) {
      monthlyZorg = maxZorg;
    } else if (totalIncome < zorgThreshold) {
      const reductionFactor = (totalIncome - 26000) / (zorgThreshold - 26000);
      monthlyZorg = Math.max(0, Math.round(maxZorg * (1 - reductionFactor)));
    }

    // 2. Huurtoeslag (Rent Allowance)
    let monthlyHuur = 0;
    const maxRentCap = 880;
    const minRentFloor = 250;
    if (monthlyRent > minRentFloor && monthlyRent <= 950) {
      const eligibleRent = Math.min(monthlyRent, maxRentCap) - minRentFloor;
      const incomeFactor = Math.max(0, 1 - (totalIncome / (hasPartner ? 46000 : 36000)));
      monthlyHuur = Math.round(eligibleRent * 0.75 * incomeFactor);
    }

    // 3. Kindgebonden budget (Child Budget)
    let monthlyKind = 0;
    if (childrenCount > 0) {
      const basePerChild = 145; // avg per child / month
      const totalChildBase = childrenCount * basePerChild;
      if (totalIncome <= 28000) {
        monthlyKind = totalChildBase;
      } else if (totalIncome <= 55000) {
        const reduction = (totalIncome - 28000) * 0.06 / 12;
        monthlyKind = Math.max(0, Math.round(totalChildBase - reduction));
      }
    }

    // 4. Kinderopvangtoeslag (Childcare Allowance)
    let monthlyOpvang = 0;
    if (childrenCount > 0 && childcareHours > 0) {
      const totalCost = childcareHours * childcareHourlyRate;
      let rate = 0.94;
      if (totalIncome > 28000) {
        rate = Math.max(0.33, 0.94 - ((totalIncome - 28000) / 100000) * 0.6);
      }
      monthlyOpvang = Math.round(totalCost * rate);
    }

    const totalMonthly = monthlyZorg + monthlyHuur + monthlyKind + monthlyOpvang;
    const totalAnnual = totalMonthly * 12;

    const isHighIncomeRisk = totalIncome > 32000 && (monthlyZorg > 0 || monthlyHuur > 0);
    const hasUncertainIncome = !hasSocialAssistance && totalIncome > 28000;

    return {
      monthlyZorg,
      monthlyHuur,
      monthlyKind,
      monthlyOpvang,
      totalMonthly,
      totalAnnual,
      isHighIncomeRisk,
      hasUncertainIncome
    };
  }, [totalIncome, hasPartner, monthlyRent, childrenCount, childcareHours, childcareHourlyRate, hasSocialAssistance]);

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الخدمات" : isNl ? "Terug naar Diensten" : "Back to Services"}</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isAr ? "طباعة التقرير" : isNl ? "Rapport afdrukken" : "Print Report"}</span>
          </button>
        </div>

        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isAr ? "حاسبة المساعدات الهولندية الرسمية ٢٠٢٦" : isNl ? "Nederlandse Toeslagen Calculator 2026" : "Dutch Allowances Calculator 2026"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "احسب استحقاقك الشهري من مصلحة الضرائب" : isNl ? "Bereken uw maandelijkse toeslagen" : "Calculate Your Monthly Dutch Allowances"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {isAr 
              ? "أداة دقيقة ومحدثة لحساب إعانة التأمين الصحي، إعانة السكن، وميزانية الأطفال لعام ٢٠٢٦ مع نصائح لتفادي فخ إعادة الأموال."
              : isNl
              ? "Nauwkeurige berekening van zorgtoeslag, huurtoeslag en kindgebonden budget volgens de actuele normen van de Belastingdienst."
              : "Accurate calculation of healthcare, rent, and child allowances according to current Dutch Belastingdienst standards."}
          </p>
        </div>

        {/* Safety Warning Card (Terugbetalen Alert) */}
        {calculations.isHighIncomeRisk && (
          <div className="p-4 md:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs md:text-sm">
              <h3 className="font-black text-amber-900 dark:text-amber-200">
                {isAr ? "تنبيه هام: انتبه من فخ إعادة الأموال (Terugbetalen)!" : isNl ? "Let op: Voorkom terugbetalen aan de Belastingdienst!" : "Caution: Prevent having to pay back to Belastingdienst!"}
              </h3>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {isAr 
                  ? "دخلك السنوي المقدر يقترب من الحد الأعلى المسموح به لبعض الإعانات. إذا زاد دخلك خلال السنة (مثل مكافآت، ساعات إضافية، أو عمل شريكك)، سارع لتعديل الدخل عبر Mijn Toeslagen فوراً لتجنب مطالبة الضرائب بإرجاع آلاف اليوروهات في التسوية السنوية."
                  : isNl
                  ? "Uw geschatte jaarinkomen ligt dicht bij de inkomensgrens. Geef wijzigingen in inkomen direct door via Mijn Toeslagen om hoge terugvorderingen achteraf te voorkomen."
                  : "Your estimated income is near the allowance limit. Report any salary changes promptly via Mijn Toeslagen to avoid large repayment demands."}
              </p>
            </div>
          </div>
        )}

        {/* Main Grid: Inputs on Left/Right, Live Summary on other side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? "بيانات الدخل والأسرة والسكن" : isNl ? "Inkomen & Gegevens" : "Income & Household Data"}</span>
            </h2>

            {/* Partner Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {isAr ? "هل لديك شريك مالي / زوج(ة)؟" : isNl ? "Heeft u een toeslagpartner?" : "Do you have a fiscal partner / spouse?"}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? "الشريك المالي يؤثر على حساب حدود الدخل في الضرائب" : "Toeslagpartner telt mee voor het gezamenlijk inkomen"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasPartner(!hasPartner)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasPartner ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      hasPartner ? (isAr ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Income Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? "دخلك الإجمالي السنوي (€/السنة)" : isNl ? "Uw toetsingsinkomen (€/jaar)" : "Your Gross Annual Income (€/year)"}
                </label>
                <input
                  type="number"
                  step="500"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  {isAr ? "الراتب السنوي الإجمالي قبل خصم الضرائب (Bruto)" : "Verzamelinkomen op jaarbasis (Bruto)"}
                </span>
              </div>

              {hasPartner && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isAr ? "دخل الشريك الإجمالي السنوي (€/السنة)" : isNl ? "Inkomen partner (€/jaar)" : "Partner's Annual Income (€/year)"}
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={partnerIncome}
                    onChange={(e) => setPartnerIncome(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            {/* Social Assistance (Bijstand) Quick Preset */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bijstand"
                checked={hasSocialAssistance}
                onChange={(e) => {
                  setHasSocialAssistance(e.target.checked);
                  if (e.target.checked) {
                    setAnnualIncome(hasPartner ? 23000 : 16000);
                    setPartnerIncome(0);
                  }
                }}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="bijstand" className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                {isAr ? "نتلقى إعانة بلدية (Bijstandsuitkering) - تحديد الدخل تلقائياً" : isNl ? "Wij ontvangen een bijstandsuitkering" : "Receiving municipal social assistance (Bijstand)"}
              </label>
            </div>

            {/* Rent Input */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {isAr ? "الإيجار الشهري الأساسي (€/الشهر)" : isNl ? "Kale huurprijs per maand (€)" : "Basic Monthly Rent (€/month)"}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="10"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="w-24 text-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-xs text-slate-900 dark:text-white">
                  € {formatLocalizedDigits(monthlyRent, locale)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {isAr ? "الإيجار الأساسي الصافي دون تكاليف الخدمات والغاز (Kale huur)" : "Kale huur exclusief servicekosten"}
              </span>
            </div>

            {/* Children Inputs */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isAr ? "عدد الأطفال المعالين (تحت سن ١٨ عاماً)" : isNl ? "Aantal kinderen (onder 18 jaar)" : "Number of dependent children (under 18)"}
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChildrenCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        childrenCount === num
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {formatLocalizedDigits(num, locale)}
                    </button>
                  ))}
                </div>
              </div>

              {childrenCount > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                    {isAr ? "إعانة الحضانة (Kinderopvangtoeslag) إن وجدت" : isNl ? "Kinderopvangtoeslag (indien van toepassing)" : "Childcare allowance (if applicable)"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isAr ? "ساعات الحضانة شهرياً" : isNl ? "Opvanguren per maand" : "Childcare hours per month"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="230"
                        value={childcareHours}
                        onChange={(e) => setChildcareHours(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {isAr ? "سعر الساعة (€/ساعة)" : isNl ? "Uurtarief (€/uur)" : "Hourly Rate (€/hour)"}
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={childcareHourlyRate}
                        onChange={(e) => setChildcareHourlyRate(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                  {isAr ? "إجمالي الدعم الشهري التقديري" : isNl ? "Totaal geschat toeslagenbedrag" : "Estimated Total Monthly Support"}
                </span>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  € {formatLocalizedDigits(calculations.totalMonthly, locale)}
                  <span className="text-base font-normal text-emerald-200 ml-2 mr-2">
                    {isAr ? "/ شهرياً" : isNl ? "/ maand" : "/ month"}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80">
                  {isAr ? "ما يعادل تقريباً" : isNl ? "Circa" : "Approximately"}{" "}
                  <span className="font-bold text-white">
                    € {formatLocalizedDigits(calculations.totalAnnual, locale)}
                  </span>{" "}
                  {isAr ? "سنوياً من الضرائب الهولندية" : isNl ? "per jaar" : "annually from Belastingdienst"}
                </p>
              </div>

              {/* Allowances Breakdown List */}
              <div className="space-y-3 pt-4 border-t border-white/15">
                {/* 1. Zorgtoeslag */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{isAr ? "إعانة التأمين الصحي" : "Zorgtoeslag"}</span>
                      <span className="text-[10px] text-emerald-200/70">{isAr ? "لدعم تكلفة التأمين الصحي" : "Zorgverzekering"}</span>
                    </div>
                  </div>
                  <span className="font-black text-sm text-white">
                    € {formatLocalizedDigits(calculations.monthlyZorg, locale)}
                  </span>
                </div>

                {/* 2. Huurtoeslag */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                      <Home className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{isAr ? "إعانة السكن والإيجار" : "Huurtoeslag"}</span>
                      <span className="text-[10px] text-emerald-200/70">{isAr ? "مساعدة في الإيجار الشهري" : "Woonkosten"}</span>
                    </div>
                  </div>
                  <span className="font-black text-sm text-white">
                    € {formatLocalizedDigits(calculations.monthlyHuur, locale)}
                  </span>
                </div>

                {/* 3. Kindgebonden budget */}
                {childrenCount > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                        <Baby className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{isAr ? "ميزانية دعم الأطفال" : "Kindgebonden budget"}</span>
                        <span className="text-[10px] text-emerald-200/70">{isAr ? "لكل طفل تحت ١٨ عاماً" : "Opgroeien van kinderen"}</span>
                      </div>
                    </div>
                    <span className="font-black text-sm text-white">
                      € {formatLocalizedDigits(calculations.monthlyKind, locale)}
                    </span>
                  </div>
                )}

                {/* 4. Kinderopvangtoeslag */}
                {childrenCount > 0 && calculations.monthlyOpvang > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{isAr ? "إعانة الحضانة ورعاية الطفل" : "Kinderopvangtoeslag"}</span>
                        <span className="text-[10px] text-emerald-200/70">{isAr ? "تغطية ساعات الحضانة للوالدين" : "Kinderopvang"}</span>
                      </div>
                    </div>
                    <span className="font-black text-sm text-white">
                      € {formatLocalizedDigits(calculations.monthlyOpvang, locale)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action: Official Belastingdienst link */}
              <div className="pt-2">
                <a
                  href="https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/toeslagen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 p-3 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black transition-all shadow-md"
                >
                  <span>{isAr ? "التقديم الرسمي عبر Mijn Toeslagen (DigiD)" : isNl ? "Aanvragen via Mijn Toeslagen (DigiD)" : "Apply on Mijn Toeslagen (DigiD)"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Community FAQ & Tips */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? "نصائح ذهبية لأبناء الجالية" : isNl ? "Handige Tips & Adviezen" : "Golden Advice"}</span>
              </h3>

              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr 
                      ? "دائماً قدّر دخلك السنوي بزيادة بسيطة (مثلاً €١,٠٠٠ إلى €٢,٠٠٠ أعلى من المتوقع) لتتجنب دفع فروقات في نهاية العام."
                      : "Schat uw inkomen liever iets te hoog in dan te laag om terugbetaling te voorkomen."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr 
                      ? "إعانة الأطفال العادية (Kinderbijslag) تأتي تلقائياً كل ٣ أشهر من SVB ولا تحتاج لطلب عبر الضرائب."
                      : "De gewone kinderbijslag wordt automatisch per kwartaal uitbetaald door de SVB."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {isAr 
                      ? "إذا سكن معك صديق أو قريب مسجل على نفس العنوان، فقد يعتبر شريكاً مالياً ويؤثر على إعانة السكن."
                      : "Medebewoners op hetzelfde adres kunnen invloed hebben op uw huurtoeslag."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
