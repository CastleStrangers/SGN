"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  CreditCard,
  Percent,
  Sparkles,
  QrCode,
  Store,
  Utensils,
  ShoppingBag,
  Wrench,
  FileText,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Share2,
  BadgeCheck,
  Zap,
  Building2,
  Star,
  Coins,
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface PartnerStore {
  id: string;
  name: { ar: string; nl: string; en: string };
  category: "supermarket" | "restaurant" | "auto" | "services" | "fashion";
  discount: number; // percentage
  city: string;
  address: string;
  cashbackType: "instant" | "cashback";
  rating: number;
  highlight: { ar: string; nl: string; en: string };
}

const PARTNERS: PartnerStore[] = [
  {
    id: "p-1",
    name: {
      ar: "سوبرماركت الشام والبركة",
      nl: "Supermarkt Al-Sham & Al-Baraka",
      en: "Al-Sham & Al-Baraka Supermarket",
    },
    category: "supermarket",
    discount: 10,
    city: "Utrecht",
    address: "Kanaalstraat 142, 3531 CR Utrecht",
    cashbackType: "instant",
    rating: 4.9,
    highlight: {
      ar: "خصم ١٠٪ فوري على كافة المواد الغذائية والتموينية واللحوم الطازجة",
      nl: "10% directe korting op alle levensmiddelen en vers vlees",
      en: "10% instant discount on all groceries and fresh meat",
    },
  },
  {
    id: "p-2",
    name: {
      ar: "مطعم ومشاوي الياسمين الدمشقي",
      nl: "Damascus Yasmin Restaurant & Grill",
      en: "Damascus Jasmine Restaurant & Grill",
    },
    category: "restaurant",
    discount: 15,
    city: "Rotterdam",
    address: "West-Kruiskade 88, 3014 AP Rotterdam",
    cashbackType: "instant",
    rating: 4.8,
    highlight: {
      ar: "خصم ١٥٪ على الفاتورة الإجمالية وضيافة مجانية لحاملي البطاقة",
      nl: "15% korting op de totale rekening + gratis dessert",
      en: "15% off the total bill + complimentary treat for members",
    },
  },
  {
    id: "p-3",
    name: {
      ar: "كراج ونظام فحص السيارات السريع (APK)",
      nl: "Auto Garage & APK Service West",
      en: "Auto Garage & APK Fast Service",
    },
    category: "auto",
    discount: 20,
    city: "Amsterdam",
    address: "Basisweg 32, 1043 AP Amsterdam",
    cashbackType: "instant",
    rating: 4.9,
    highlight: {
      ar: "خصم ٢٠٪ على أجور الصيانة الدورية وفحص APK بـ ٢٥ يورو فقط",
      nl: "20% korting op onderhoud en APK keuring voor slechts €25",
      en: "20% off periodic maintenance and APK inspection for €25 only",
    },
  },
  {
    id: "p-4",
    name: {
      ar: "مكتب المترجم المحلف والخدمات القانونية",
      nl: "Beëdigd Vertaler & Juridisch Adviesbureau",
      en: "Sworn Translator & Legal Consultancy",
    },
    category: "services",
    discount: 15,
    city: "Den Haag",
    address: "Theresiastraat 95, 2593 AC Den Haag",
    cashbackType: "cashback",
    rating: 5.0,
    highlight: {
      ar: "استرداد ١٥٪ كاش باك على ترجمة الوثائق الرسمية والشهادات الجامعية",
      nl: "15% cashback op beëdigde vertalingen van officiële documenten",
      en: "15% cashback on sworn translations of official documents",
    },
  },
  {
    id: "p-5",
    name: {
      ar: "مفروشات وأقمشة الشرق الراقية",
      nl: "Orient Woonmode & Gordijnen",
      en: "Orient Home Furnishings & Curtains",
    },
    category: "fashion",
    discount: 12,
    city: "Arnhem",
    address: "Steenstraat 54, 6828 CM Arnhem",
    cashbackType: "instant",
    rating: 4.7,
    highlight: {
      ar: "خصم ١٢٪ على الأقمشة، السجاد، وتفصيل الستائر لفرش المنازل الجديدة",
      nl: "12% korting op stoffen, tapijten en maatwerk gordijnen",
      en: "12% discount on home fabrics, carpets, and custom curtains",
    },
  },
  {
    id: "p-6",
    name: {
      ar: "حلويات الشام الأصيلة وقوالب الكيك",
      nl: "Patisserie Sham Sweets & Cakes",
      en: "Traditional Sham Sweets & Pastry",
    },
    category: "restaurant",
    discount: 10,
    city: "Eindhoven",
    address: "Kruisstraat 67, 5612 CD Eindhoven",
    cashbackType: "instant",
    rating: 4.9,
    highlight: {
      ar: "خصم ١٠٪ على الحلويات العربية الفاخرة وتواصي المناسبات الخاصة",
      nl: "10% korting op luxe Oosterse zoetigheden en feestbestellingen",
      en: "10% discount on gourmet Arabic sweets and party catering",
    },
  },
];

export default function CashbackPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [activeTab, setActiveTab] = useState<"pass" | "partners" | "calculator" | "join">("pass");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Member card personal details for preview
  const [memberName, setMemberName] = useState("محمد سليم عزيزة");
  const [memberCity, setMemberCity] = useState("Utrecht");
  const [memberId, setMemberId] = useState("SGN-2026-8849");

  // Calculator inputs
  const [monthlySupermarket, setMonthlySupermarket] = useState(450);
  const [monthlyDining, setMonthlyDining] = useState(150);
  const [yearlyAutoServices, setYearlyAutoServices] = useState(600);

  // Computed savings
  const computedSavings = useMemo(() => {
    const supermarketSaving = monthlySupermarket * 12 * 0.1; // 10% avg
    const diningSaving = monthlyDining * 12 * 0.15; // 15% avg
    const autoServicesSaving = yearlyAutoServices * 0.18; // 18% avg
    const total = Math.round(supermarketSaving + diningSaving + autoServicesSaving);
    const membershipCost = 25; // 25 euro / year nominal solidarity fee
    const netProfit = total - membershipCost;
    return { supermarketSaving, diningSaving, autoServicesSaving, total, netProfit };
  }, [monthlySupermarket, monthlyDining, yearlyAutoServices]);

  const filteredPartners = useMemo(() => {
    if (selectedCategory === "all") return PARTNERS;
    return PARTNERS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm font-semibold">
            <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              {isAr
                ? "بطاقة العضوية الذهبية وشبكة الكاش باك للجالية"
                : isNl
                ? "SGN Gouden Ledenpas & Cashback Netwerk"
                : "SGN Golden Member Card & Cashback Network"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? (
              <>
                وفّر حتى{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500">
                  ١,٢٠٠ يورو سنوياً
                </span>{" "}
                مع بطاقة العضوية
              </>
            ) : isNl ? (
              <>
                Bespaar tot{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500">
                  € 1.200 per jaar
                </span>{" "}
                met uw ledenpas
              </>
            ) : (
              <>
                Save up to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500">
                  €1,200 per year
                </span>{" "}
                with your membership card
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {isAr
              ? "شبكة تخفيضات تضامنية متكاملة تضم عشرات المتاجر والمطاعم ومقدمي الخدمات المعتمدين في هولندا. أبرز بطاقتك الرقمية عند الدفع واستفد فوراً من الخصومات أو الاسترداد المالي المباشر."
              : isNl
              ? "Een solidair voordeelnetwerk met tientallen aangesloten winkels, restaurants en dienstverleners in Nederland. Toon uw digitale pas en profiteer direct van exclusieve kortingen."
              : "A solidarity discount network featuring dozens of verified stores, restaurants, and service providers across the Netherlands. Present your digital pass and enjoy instant discounts."}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl max-w-2xl mx-auto">
          {[
            {
              id: "pass",
              icon: CreditCard,
              label: isAr ? "بطاقتي الرقمية" : isNl ? "Mijn Digitale Pas" : "My Digital Pass",
            },
            {
              id: "partners",
              icon: Store,
              label: isAr ? "شبكة المتاجر والشركاء" : isNl ? "Winkels & Partners" : "Partner Network",
            },
            {
              id: "calculator",
              icon: Calculator,
              label: isAr ? "حاسبة التوفير السنوي" : isNl ? "Bespaar Calculator" : "Savings Calculator",
            },
            {
              id: "join",
              icon: Building2,
              label: isAr ? "انضمام المتاجر" : isNl ? "Partner Worden" : "Become a Partner",
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Digital Card Generator & Pass */}
        {activeTab === "pass" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Card preview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-amber-950/80 to-slate-950 text-white shadow-2xl border border-amber-500/30">
                {/* Decorative background sheen */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

                <div className="relative z-10 space-y-8">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg">
                        <CreditCard className="w-6 h-6 text-slate-950" />
                      </div>
                      <div>
                        <div className="font-extrabold tracking-wide text-lg text-amber-300">
                          {isAr ? "بطاقة عضوية الجالية السورية" : "SGN GOLDEN MEMBER PASS"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {isAr ? "مجلس الجالية السورية في هولندا" : "Syrian Community in the Netherlands"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? "عضوية ذهبية مفعّلة" : "ACTIVE VIP"}</span>
                    </div>
                  </div>

                  {/* Chip & NFC symbol */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 flex items-center justify-center shadow-inner">
                      <div className="w-8 h-6 border border-amber-600/40 rounded flex items-center justify-center">
                        <div className="w-4 h-3 bg-amber-400/40 rounded-sm" />
                      </div>
                    </div>
                    <Zap className="w-6 h-6 text-amber-400/60" />
                  </div>

                  {/* Card Number & Name */}
                  <div className="space-y-4">
                    <div className="font-mono text-2xl tracking-widest text-slate-100 drop-shadow">
                      {formatLocalizedDigits(memberId, locale)}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-400">
                          {isAr ? "اسم حامل البطاقة" : "Card Holder"}
                        </div>
                        <div className="text-lg font-bold text-white tracking-wide">{memberName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-slate-400">
                          {isAr ? "المدينة / الإقامة" : "City"}
                        </div>
                        <div className="text-sm font-semibold text-amber-200">{memberCity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-slate-400">
                          {isAr ? "صالحة حتى" : "Expires"}
                        </div>
                        <div className="text-sm font-mono font-semibold text-emerald-400">
                          {formatLocalizedDigits("12/2027", locale)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom QR scan strip */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        {isAr
                          ? "مقبولة في أكثر من ٨٥ نقطة بيع معتمدة"
                          : isNl
                          ? "Geldig bij 85+ aangesloten locaties"
                          : "Accepted at 85+ verified partner stores"}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded-xl shadow">
                      <QrCode className="w-8 h-8 text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => alert(isAr ? "تم حفظ البطاقة في المحفظة الرقمية بنجاح!" : "Saved to Digital Wallet!")}
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? "حفظ البطاقة في Apple / Google Wallet" : "Add to Apple/Google Wallet"}</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert(isAr ? "تم نسخ رابط التحقق من البطاقة" : "Verification link copied!");
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isAr ? "مشاركة" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Right/Customize Pass */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isAr ? "بيانات بطاقتك الشخصية" : "Personalize Your Pass"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isAr
                    ? "تظهر هذه المعلومات مباشرة على بطاقتك الرقمية وعلى شاشة الكاشير عند المسح."
                    : "This data appears directly on your digital member card."}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? "الاسم الكامل (كما في الهوية)" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? "المدينة الهولندية" : "City"}
                  </label>
                  <input
                    type="text"
                    value={memberCity}
                    onChange={(e) => setMemberCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? "رقم العضوية التعريفي" : "Member ID"}
                  </label>
                  <input
                    type="text"
                    value={memberId}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 text-slate-500 text-sm font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                  <BadgeCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>{isAr ? "ميزات العضوية الفعالة" : "Included Benefits"}</span>
                </div>
                <ul className="text-xs text-amber-900/80 dark:text-amber-300/90 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "خصم فوري يتراوح بين ٥٪ و ٢٠٪ عند الدفع" : "5% to 20% instant discount at checkout"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "استرداد نقدي ربع سنوي يتحول لحسابك البنكي IBAN" : "Quarterly cashback deposited into your IBAN"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isAr ? "عروض حصرية وخصومات خاصة بالأعياد والمناسبات" : "Exclusive seasonal and holiday deals"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Partner Network */}
        {activeTab === "partners" && (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "all", label: isAr ? "كافة المتاجر والشركاء" : "All Partners" },
                { id: "supermarket", label: isAr ? "بقالية وسوبرماركت" : "Supermarkets" },
                { id: "restaurant", label: isAr ? "مطاعم وحلويات" : "Restaurants" },
                { id: "auto", label: isAr ? "صيانة سيارات وفحص" : "Auto & APK" },
                { id: "services", label: isAr ? "ترجمة وخدمات" : "Legal & Services" },
                { id: "fashion", label: isAr ? "مفروشات وأثاث" : "Home & Living" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Partner Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <Percent className="w-3.5 h-3.5" />
                        <span>
                          {isAr
                            ? `خصم ${formatLocalizedDigits(partner.discount, locale)}٪`
                            : `${partner.discount}% Discount`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{formatLocalizedDigits(partner.rating.toFixed(1), locale)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        {isAr ? partner.name.ar : isNl ? partner.name.nl : partner.name.en}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{partner.address}</p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {isAr ? partner.highlight.ar : isNl ? partner.highlight.nl : partner.highlight.en}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {partner.cashbackType === "instant"
                        ? isAr
                          ? "خصم فوري مباشر"
                          : "Directe Kassakorting"
                        : isAr
                        ? "استرداد كاش باك"
                        : "Cashback"}
                    </span>
                    <button
                      onClick={() =>
                        alert(
                          isAr
                            ? `أبرز بطاقتك الرقمية في المتجر للحصول على الخصم فوراً!`
                            : `Toon uw ledenpas aan de kassa voor directe korting!`
                        )
                      }
                      className="inline-flex items-center gap-1 text-slate-900 dark:text-white font-bold hover:text-amber-600"
                    >
                      <span>{isAr ? "طريقة الاستخدام" : "Hoe te gebruiken"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Savings Calculator */}
        {activeTab === "calculator" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-1">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isAr ? "حاسبة التوفير السنوي التقديري" : "Annual Cashback & Savings Calculator"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                {isAr
                  ? "احسب كم ستوفر عائلتك عند توجيه مشترياتك العادية إلى شبكة المتاجر والشركاء المعتمدين."
                  : "Calculate how much your household can save by shopping with our verified partner network."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input 1 */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? "مشتريات السوبرماركت" : "Supermarket (monthly)"}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {isAr ? "متوسط الإنفاق الشهري" : "Monthly average"}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="150"
                    max="1000"
                    step="50"
                    value={monthlySupermarket}
                    onChange={(e) => setMonthlySupermarket(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {formatLocalizedDigits(monthlySupermarket, locale)} € / {isAr ? "شهرياً" : "pm"}
                </div>
              </div>

              {/* Input 2 */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Utensils className="w-4 h-4 text-orange-600" />
                  <span>{isAr ? "المطاعم والحلويات" : "Dining & Sweets"}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {isAr ? "متوسط الإنفاق الشهري" : "Monthly average"}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="25"
                    value={monthlyDining}
                    onChange={(e) => setMonthlyDining(Number(e.target.value))}
                    className="w-full accent-orange-600"
                  />
                </div>
                <div className="text-lg font-black text-orange-600 dark:text-orange-400">
                  {formatLocalizedDigits(monthlyDining, locale)} € / {isAr ? "شهرياً" : "pm"}
                </div>
              </div>

              {/* Input 3 */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>{isAr ? "صيانة السيارات والخدمات" : "Auto & Services"}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {isAr ? "الإنفاق السنوي التقريبي" : "Approx. annual spend"}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="200"
                    max="2500"
                    step="100"
                    value={yearlyAutoServices}
                    onChange={(e) => setYearlyAutoServices(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                  {formatLocalizedDigits(yearlyAutoServices, locale)} € / {isAr ? "سنوياً" : "yr"}
                </div>
              </div>
            </div>

            {/* Result banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-right">
                <div className="text-xs uppercase tracking-wider text-amber-100 font-bold">
                  {isAr ? "إجمالي الوفر الصافي السنوي" : "Net Annual Savings"}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {formatLocalizedDigits(computedSavings.netProfit, locale)} €
                </div>
                <p className="text-xs text-amber-100">
                  {isAr
                    ? "بعد خصم رسم العضوية التكافلي الرمزي (٢٥€ سنوياً)"
                    : "After deducting the €25 annual solidarity membership contribution"}
                </p>
              </div>

              <button
                onClick={() => setActiveTab("pass")}
                className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-sm shadow-md hover:bg-amber-50 transition-all shrink-0"
              >
                {isAr ? "احصل على بطاقتك الآن" : "Claim Your Pass Now"}
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Partner Join Request */}
        {activeTab === "join" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-1">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isAr ? "انضمام المتاجر والشركات إلى الشبكة" : "Join the Partner Network"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isAr
                  ? "هل تمتلك متجراً، مطعماً، أو شركة خدمات في هولندا؟ انضم إلى شبكة شركاء الجالية واكسب آلاف الزبائن الأوفياء."
                  : "Do you own a business in the Netherlands? Join our partner network and reach thousands of verified community members."}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  isAr
                    ? "شكراً لطلبك! سيتواصل معك فريق العلاقات الاقتصادية بالجالية خلال ٢٤ ساعة."
                    : "Thank you! Our partnership team will contact you within 24 hours."
                );
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isAr ? "اسم المتجر أو الشركة" : "Business Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? "مثال: سوبرماركت الفردوس" : "e.g. Damascus Market"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? "المدينة ورقم الغرفة التجارية (KvK)" : "City & KvK Number"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Amsterdam - 12345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {isAr ? "نسبة الخصم المقترحة" : "Proposed Discount %"}
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="10">١٠٪ خصم فوري لحاملي البطاقة</option>
                    <option value="15">١٥٪ خصم فوري</option>
                    <option value="20">٢٠٪ خصم فوري</option>
                    <option value="cashback">استرداد نقدي (Cashback)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {isAr ? "رقم الهاتف / الواتساب للتواصل" : "Phone / WhatsApp"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+31 6 ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{isAr ? "إرسال طلب الانضمام كشريك" : "Submit Partnership Application"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
