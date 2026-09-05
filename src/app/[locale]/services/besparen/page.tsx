"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  TrendingDown,
  Zap,
  Shield,
  Wifi,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  Calendar,
  DollarSign,
  AlertCircle,
  PiggyBank,
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface DealCard {
  id: string;
  category: "energy" | "health" | "internet";
  title: string;
  provider: string;
  badge: string;
  avgSavingYear: number;
  perks: string[];
  deadline?: string;
}

const DEALS: DealCard[] = [
  {
    id: "deal-energy-1",
    category: "energy",
    title: "العقد الجماعي للطاقة الخضراء والغاز ٢٠٢٦",
    provider: "SGN Collectief x Vattenfall/Eneco",
    badge: "توفير يصل لـ ٦٠٠€",
    avgSavingYear: 580,
    perks: ["سعر ثابت ومحمي ضد تقلبات الشتاء", "مكافأة ترحيبية نقدية عند التبديل", "دعم فني وخدمة زبائن بالعربي والهولندي"],
    deadline: "متاح الآن",
  },
  {
    id: "deal-health-1",
    category: "health",
    title: "باقة التأمين الصحي الجماعي مع تغطية الأسنان",
    provider: "SGN Collectief x VGZ/Zilveren Kruis",
    badge: "خصم جماعي ٨٪",
    avgSavingYear: 240,
    perks: ["خصم خاص على التأمين الأساسي والتكميلي", "تغطية ممتازة للعلاج الطبيعي وطب الأسنان", "استشارات طبية فورية باللغة العربية"],
    deadline: "فترة التبديل: نوفمبر - ديسمبر",
  },
  {
    id: "deal-internet-1",
    category: "internet",
    title: "باقة الألياف الضوئية الفائقة (Glasvezel) والراوتر",
    provider: "SGN Collectief x KPN/Odido",
    badge: "أول ٦ أشهر بنصف السعر",
    avgSavingYear: 280,
    perks: ["سرعات فائقة حتى 1 Gbit/s بدون انقطاع", "تركيب مجاني في منزلك بواسطة فني معتمد", "اشتراك تلفزيون وقنوات مشمولة مجاناً"],
    deadline: "عرض مستمر",
  },
];

export default function BesparenPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  // Calculator state
  const [familyMembers, setFamilyMembers] = useState(3);
  const [currentEnergyBill, setCurrentEnergyBill] = useState(240); // monthly
  const [currentHealthPremium, setCurrentHealthPremium] = useState(165); // per adult monthly
  const [currentInternetBill, setCurrentInternetBill] = useState(65); // monthly

  // Calculation of estimated savings
  const energySaving = useMemo(() => {
    // Average 18-22% savings with collective negotiation
    return Math.round(currentEnergyBill * 12 * 0.2);
  }, [currentEnergyBill]);

  const healthSaving = useMemo(() => {
    const adultCount = Math.min(Math.max(1, familyMembers - 1), 2);
    // Collective 7-9% discount on supplementary + collective deals
    return Math.round(adultCount * currentHealthPremium * 12 * 0.08);
  }, [familyMembers, currentHealthPremium]);

  const internetSaving = useMemo(() => {
    // Deal welcome bonus + 6 months promo discount
    return Math.round(currentInternetBill * 12 * 0.28);
  }, [currentInternetBill]);

  const totalYearlySaving = energySaving + healthSaving + internetSaving;

  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "", interests: ["energy", "health"] });

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-8 md:p-12 shadow-2xl border border-blue-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <PiggyBank className="w-4 h-4" />
              {isAr ? "مبادرة التوفير الجماعي للعائلات ٢٠٢٦" : isNl ? "Collectief Besparen 2026" : "Collective Savings 2026"}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {isAr
                ? "حاسبة التوفير والمشتريات الجماعية (SGN Besparen)"
                : isNl
                ? "Collectief Besparen op Vaste Lasten"
                : "Collective Household Savings Hub"}
            </h1>
            <p className="text-blue-100/90 text-base md:text-lg leading-relaxed">
              {isAr
                ? "قوة الجالية في التفاوض الجماعي: وفّر بين ٥٠٠ و ١٥٠٠ يورو سنوياً على فواتير الطاقة والغاز، التأمين الصحي الإلزامي، وباقات الإنترنت المنزلية."
                : isNl
                ? "Door de krachten van de gemeenschap te bundelen, onderhandelen we collectieve kortingen op energie, zorgverzekering en telecom voor elk gezin."
                : "Harness collective community power to save €500 to €1500 yearly on energy contracts, mandatory health insurance, and home fiber internet."}
            </p>
          </div>
        </div>

        {/* CALCULATOR & LIVE PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? "احسب توفير عائلتك السنوي المتوقع" : "Bereken je jaarlijkse besparing"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isAr ? "حرّك المؤشرات بناءً على نفقاتك الشهرية الحالية" : "Pas de schuifregelaars aan op je huidige situatie"}
                </p>
              </div>
            </div>

            {/* Slider 1: Family members */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  {isAr ? "عدد أفراد العائلة:" : "Aantal gezinsleden:"}
                </span>
                <span className="text-sm font-black text-blue-600 font-mono">
                  {formatLocalizedDigits(familyMembers.toString(), locale)} {isAr ? "أفراد" : "personen"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 2: Monthly Energy bill */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {isAr ? "فاتورة الكهرباء والغاز الشهرية الحالية:" : "Huidige energiekosten per maand:"}
                </span>
                <span className="text-sm font-black text-blue-600 font-mono">
                  €{formatLocalizedDigits(currentEnergyBill.toString(), locale)} / {isAr ? "شهر" : "mnd"}
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="600"
                step="10"
                value={currentEnergyBill}
                onChange={(e) => setCurrentEnergyBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 3: Monthly Health Insurance */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  {isAr ? "قسط التأمين الصحي للبالغ الواحد شهرياً:" : "Zorgpremie per volwassene:"}
                </span>
                <span className="text-sm font-black text-blue-600 font-mono">
                  €{formatLocalizedDigits(currentHealthPremium.toString(), locale)} / {isAr ? "شهر" : "mnd"}
                </span>
              </div>
              <input
                type="range"
                min="140"
                max="240"
                step="5"
                value={currentHealthPremium}
                onChange={(e) => setCurrentHealthPremium(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Slider 4: Monthly Internet & TV */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-indigo-500" />
                  {isAr ? "فاتورة الإنترنت المنزلي والتلفزيون:" : "Internet & TV per maand:"}
                </span>
                <span className="text-sm font-black text-blue-600 font-mono">
                  €{formatLocalizedDigits(currentInternetBill.toString(), locale)} / {isAr ? "شهر" : "mnd"}
                </span>
              </div>
              <input
                type="range"
                min="35"
                max="120"
                step="5"
                value={currentInternetBill}
                onChange={(e) => setCurrentInternetBill(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-500/30 space-y-6">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              {isAr ? "المحصلة السنوية لتوفير العائلة" : "Geschatte jaarlijkse besparing"}
            </span>

            <div className="bg-indigo-900/40 p-6 rounded-2xl border border-indigo-400/20 text-center space-y-1">
              <span className="text-xs text-indigo-200">{isAr ? "إجمالي التوفير السنوي التقريبي:" : "Totaal per jaar:"}</span>
              <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono">
                €{formatLocalizedDigits(totalYearlySaving.toString(), locale)}
              </div>
              <span className="text-[11px] text-indigo-300 block pt-1">
                {isAr
                  ? `بمعدل توفير حوالي €${Math.round(totalYearlySaving / 12)} شهرياً في جيبك`
                  : `Dat is gemiddeld €${Math.round(totalYearlySaving / 12)} extra per maand`}
              </span>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {isAr ? "توفير عقود الطاقة والغاز:" : "Besparing energie:"}
                </span>
                <span className="font-bold text-emerald-300 font-mono">€{energySaving} / {isAr ? "سنة" : "jaar"}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  {isAr ? "توفير التأمين الصحي الجماعي:" : "Besparing zorgverzekering:"}
                </span>
                <span className="font-bold text-emerald-300 font-mono">€{healthSaving} / {isAr ? "سنة" : "jaar"}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" />
                  {isAr ? "توفير عروض الإنترنت فايبر:" : "Besparing internet & TV:"}
                </span>
                <span className="font-bold text-emerald-300 font-mono">€{internetSaving} / {isAr ? "سنة" : "jaar"}</span>
              </div>
            </div>

            <a
              href="#join-collective"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? "سجّل الآن للاستفادة من التوفير الجماعي" : "Meld je gratis aan voor collectief"}
            </a>
          </div>
        </div>

        {/* ACTIVE COLLECTIVE DEALS */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isAr ? "العروض الجماعية النشطة للجالية" : "Lopende collectieve aanbiedingen"}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr
                ? "عقود موثوقة ومفاوضة رسمياً لضمان أعلى فائدة وأقل سعر ممكن لعائلاتنا في هولندا"
                : "Exclusief onderhandeld voor leden van de Syrische gemeenschap in Nederland"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEALS.map((deal) => (
              <div
                key={deal.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold border border-blue-200/50">
                      {deal.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">{deal.deadline}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{deal.title}</h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{deal.provider}</p>

                  <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                    {deal.perks.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#join-collective"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  {isAr ? "الانضمام للعقد الجماعي" : "Meedoen met collectief"}
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div id="join-collective" className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isAr ? "طلب الانضمام للمشتريات والعقود الجماعية" : "Aanmelden voor Collectieve Inkoop"}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr
                ? "التسجيل مجاني وبدون أي التزام. سيتواصل معك مستشار الجالية لإتمام مقارنة عقودك الحالية وتوفير المبلغ."
                : "Geheel gratis en vrijblijvend. We nemen contact op om jouw besparing te regelen."}
            </p>
          </div>

          {registered ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-2 border border-emerald-200/50">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-base">
                {isAr ? "تم تسجيل طلبك بنجاح!" : "Aanmelding succesvol ontvangen!"}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                {isAr
                  ? "سيتواصل معك فريق الاستشارات في الجالية عبر واتساب خلال 24 ساعة بمقارنة دقيقة لعقودك الحالية."
                  : "Onze adviseurs nemen binnen 24 uur contact met je op."}
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setRegistered(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isAr ? "الاسم الكامل:" : "Volledige naam:"}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? "رقم الهاتف / واتساب:" : "Telefoon / WhatsApp:"}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+31 6 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {isAr ? "المدينة والرمز البريدي:" : "Woonplaats & Postcode:"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1012 AB Amsterdam"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isAr ? "تأكيد طلب المراجعة والتوفير" : "Aanvraag versturen"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
