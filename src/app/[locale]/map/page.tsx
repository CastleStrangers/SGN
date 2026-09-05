"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  MapPin, Users, Building2, Tag, Calendar, Sparkles, 
  ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Phone, MessageCircle
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface ProvinceData {
  id: string;
  nameAr: string;
  nameNl: string;
  nameEn: string;
  capital: string;
  membersCount: number;
  centersCount: number;
  partnersCount: number;
  highlightAr: string;
  highlightEn: string;
  highlightNl: string;
  centers: { nameAr: string; nameNl: string; address: string; phone: string }[];
  partners: { nameAr: string; nameNl: string; discountAr: string; discountEn: string; discountNl: string }[];
}

const PROVINCES: ProvinceData[] = [
  {
    id: "zuid-holland",
    nameAr: "جنوب هولندا (Zuid-Holland)",
    nameNl: "Zuid-Holland",
    nameEn: "South Holland (Zuid-Holland)",
    capital: "Den Haag / Rotterdam",
    membersCount: 163,
    centersCount: 4,
    partnersCount: 5,
    highlightAr: "المركز الرئيسي لإدارة الجالية ومقر الجمعية ومكاتب التنسيق القانوني.",
    highlightEn: "Primary headquarters of SGN, main legal bureau, and community operations.",
    highlightNl: "Hoofdkantoor van de vereniging, juridisch advies en coördinatiecentrum.",
    centers: [
      { nameAr: "مقر الأمانة العامة للجالية السورية", nameNl: "SGN Hoofdkantoor", address: "Laan van Meerdervoort 53-D, 2517 AE Den Haag", phone: "+31 6 84 60 34 06" },
      { nameAr: "المركز الثقافي والتعليمي بروتردام", nameNl: "Cultureel Centrum Rotterdam", address: "Rotterdam Centrum", phone: "+31 10 234 5678" },
    ],
    partners: [
      { nameAr: "مطعم ومشاوي دمشق الشام", nameNl: "Damascus Grill Restaurant", discountAr: "خصم ١٥٪ للأعضاء", discountEn: "15% off for members", discountNl: "15% korting voor leden" },
      { nameAr: "مكتب يوروتكس للترجمة المحلفة", nameNl: "EuroTex Beëdigde Vertalingen", discountAr: "خصم ٢٠٪ على الوثائق", discountEn: "20% off translations", discountNl: "20% korting op vertalingen" },
    ],
  },
  {
    id: "noord-holland",
    nameAr: "شمال هولندا (Noord-Holland)",
    nameNl: "Noord-Holland",
    nameEn: "North Holland (Noord-Holland)",
    capital: "Amsterdam / Haarlem",
    membersCount: 78,
    centersCount: 3,
    partnersCount: 4,
    highlightAr: "تجمع ريادي للشركات التقنية، رواد الأعمال، والأنشطة الشبابية.",
    highlightEn: "Hub for entrepreneurs, tech professionals, and youth creative initiatives.",
    highlightNl: "Centrum voor tech-professionals, ondernemers en jeugdinitiatieven.",
    centers: [
      { nameAr: "ملتقى شباب الجالية بأمستردام", nameNl: "Jongerenforum Amsterdam", address: "Amsterdam Nieuw-West", phone: "+31 20 678 9012" },
    ],
    partners: [
      { nameAr: "حلويات الشرق الشامية", nameNl: "Al-Sharq Patisserie", discountAr: "خصم ١٠٪ على الحلويات", discountEn: "10% off sweets", discountNl: "10% korting op gebak" },
    ],
  },
  {
    id: "noord-brabant",
    nameAr: "شمال برابانت (Noord-Brabant)",
    nameNl: "Noord-Brabant",
    nameEn: "North Brabant (Noord-Brabant)",
    capital: "Eindhoven / Tilburg",
    membersCount: 45,
    centersCount: 2,
    partnersCount: 3,
    highlightAr: "مركز الكوادر الهندسية والتقنية في منطقة آيندهوفن التكنولوجية.",
    highlightEn: "Hub for engineering talents and technical specialists around Eindhoven.",
    highlightNl: "Regio voor technisch talent en ingenieurs in de Brainport Eindhoven.",
    centers: [
      { nameAr: "رابطة الطلاب والمهندسين السوريين", nameNl: "Syrische Ingenieurskring", address: "Eindhoven University Area", phone: "+31 40 555 7788" },
    ],
    partners: [
      { nameAr: "ورشة النور لصيانة السيارات والفحص", nameNl: "Al-Noor Garage & APK", discountAr: "خصم ٢٠٪ على فحص APK", discountEn: "20% off APK checks", discountNl: "20% korting op APK" },
    ],
  },
  {
    id: "utrecht",
    nameAr: "أوترخت (Utrecht)",
    nameNl: "Utrecht",
    nameEn: "Utrecht Province",
    capital: "Utrecht",
    membersCount: 21,
    centersCount: 2,
    partnersCount: 2,
    highlightAr: "قلب هولندا الجغرافي ونقطة التقاء الفعاليات المركزية والندوات.",
    highlightEn: "Geographic heart of NL, ideal for central gatherings and cultural symposiums.",
    highlightNl: "Centraal ontmoetingspunt voor landelijke lezingen en culturele bijeenkomsten.",
    centers: [
      { nameAr: "ديوان الجالية بمدينة أوترخت", nameNl: "Gemeenschapshuis Utrecht", address: "Utrecht Overvecht", phone: "+31 30 888 4433" },
    ],
    partners: [
      { nameAr: "مخبز البركة السوري", nameNl: "Al-Baraka Bakkerij", discountAr: "خصم ١٥٪ على المعجنات", discountEn: "15% off bakery", discountNl: "15% korting op bakkerij" },
    ],
  },
  {
    id: "gelderland",
    nameAr: "غيلدرلاند (Gelderland)",
    nameNl: "Gelderland",
    nameEn: "Gelderland Province",
    capital: "Arnhem / Nijmegen",
    membersCount: 31,
    centersCount: 2,
    partnersCount: 2,
    highlightAr: "حضور بارز في المدن الجامعية ودعم العائلات السورية المقيمة.",
    highlightEn: "Strong presence in university cities and active family support networks.",
    highlightNl: "Actieve gemeenschap in universiteitssteden en gezinsondersteuning.",
    centers: [
      { nameAr: "لجنة المساندة والتكامل الإنساني", nameNl: "Integratie Comité Arnhem", address: "Arnhem Zuid", phone: "+31 26 444 3322" },
    ],
    partners: [],
  },
  {
    id: "limburg",
    nameAr: "ليمبورخ (Limburg)",
    nameNl: "Limburg",
    nameEn: "Limburg Province",
    capital: "Maastricht",
    membersCount: 32,
    centersCount: 1,
    partnersCount: 2,
    highlightAr: "جنوب هولندا والحدود المشتركة مع بلجيكا وألمانيا.",
    highlightEn: "Southern border region connecting cross-border diaspora activities.",
    highlightNl: "Zuidelijke regio met grensinitiatieven richting België en Duitsland.",
    centers: [
      { nameAr: "ملتقى ماستريخت للثقافة والتراث", nameNl: "Maastricht Cultuurforum", address: "Maastricht", phone: "+31 43 222 1100" },
    ],
    partners: [],
  },
  {
    id: "overijssel",
    nameAr: "أوفريسل (Overijssel)",
    nameNl: "Overijssel",
    nameEn: "Overijssel Province",
    capital: "Zwolle / Enschede",
    membersCount: 14,
    centersCount: 1,
    partnersCount: 1,
    highlightAr: "أنشطة طلابية ورواد أعمال في منطقة تفينته الشرقية.",
    highlightEn: "Active student presence around University of Twente in Enschede.",
    highlightNl: "Studentengemeenschap en innovatieve initiatieven in Twente.",
    centers: [],
    partners: [],
  },
  {
    id: "groningen",
    nameAr: "خرونينغن (Groningen)",
    nameNl: "Groningen",
    nameEn: "Groningen Province",
    capital: "Groningen",
    membersCount: 15,
    centersCount: 1,
    partnersCount: 1,
    highlightAr: "شمال هولندا، مركز علمي وأكاديمي متميز للجالية.",
    highlightEn: "Northern academic hub hosting researchers and university students.",
    highlightNl: "Academisch centrum in het noorden met veel Syrische studenten.",
    centers: [],
    partners: [],
  },
  {
    id: "friesland",
    nameAr: "فرايزلاند (Friesland)",
    nameNl: "Friesland",
    nameEn: "Friesland Province",
    capital: "Leeuwarden",
    membersCount: 8,
    centersCount: 1,
    partnersCount: 0,
    highlightAr: "تنسيق ومساندة العائلات في شمال غرب هولندا.",
    highlightEn: "Support network for Syrian families in the northwestern region.",
    highlightNl: "Steunpunt voor families in het noordwesten.",
    centers: [],
    partners: [],
  },
  {
    id: "zeeland",
    nameAr: "زيلاند (Zeeland)",
    nameNl: "Zeeland",
    nameEn: "Zeeland Province",
    capital: "Middelburg",
    membersCount: 8,
    centersCount: 1,
    partnersCount: 1,
    highlightAr: "تجمعات ساحلية مميزة وأنشطة تكافلية بين العائلات.",
    highlightEn: "Coastal communities with warm family and mutual support initiatives.",
    highlightNl: "Hechte gemeenschap in de Zeeuwse regio.",
    centers: [],
    partners: [],
  },
  {
    id: "drenthe",
    nameAr: "درينته (Drenthe)",
    nameNl: "Drenthe",
    nameEn: "Drenthe Province",
    capital: "Assen",
    membersCount: 7,
    centersCount: 0,
    partnersCount: 0,
    highlightAr: "تنسيق مستمر مع البلديات لتسهيل اندماج القادمين الجدد.",
    highlightEn: "Local initiatives facilitating integration for recent newcomers.",
    highlightNl: "Lokale begeleiding voor integratie van nieuwkomers.",
    centers: [],
    partners: [],
  },
  {
    id: "flevoland",
    nameAr: "فليفولاند (Flevoland)",
    nameNl: "Flevoland",
    nameEn: "Flevoland Province",
    capital: "Almere / Lelystad",
    membersCount: 3,
    centersCount: 1,
    partnersCount: 1,
    highlightAr: "أحدث مقاطعة هولندية، وتجمع شبابي متنامي بالقرب من أمستردام.",
    highlightEn: "Youngest Dutch province with a growing diaspora demographic.",
    highlightNl: "Jongste provincie met een snelgroeiende gemeenschap nabij de Randstad.",
    centers: [],
    partners: [],
  },
];

export default function InteractiveCommunityMapPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("zuid-holland");
  const selectedProvince = PROVINCES.find((p) => p.id === selectedProvinceId) || PROVINCES[0];

  const totalRegisteredMembers = PROVINCES.reduce((acc, p) => acc + p.membersCount, 0);

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
              <MapPin className="w-4 h-4 text-[#c8a84e]" />
              <span>
                {isAr
                  ? "الخريطة التفاعلية للجالية السورية في هولندا"
                  : isNl
                  ? "Interactieve Kaart Syrische Gemeenschap in NL"
                  : "Interactive Syrian Community Map of the Netherlands"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {isAr ? "خريطة التواجد والمراكز عبر المقاطعات الـ ١٢" : isNl ? "Spreiding & Ontmoetingsplekken in 12 Provincies" : "Community Hubs Across all 12 Dutch Provinces"}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isAr
                ? "استكشف خارطة انتشار أبناء الجالية السورية في هولندا، ومواقع المكاتب الرسمية، المراكز الثقافية، وشبكة الخصومات المعتمدة في كل مقاطعة."
                : isNl
                ? "Ontdek de aanwezigheid van de Syrische gemeenschap, officiële locaties, cultuurcentra en partnervoorzieningen per provincie."
                : "Explore diaspora distribution, community centers, verified partner discounts, and official offices across all Dutch provinces."}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs sm:text-sm font-semibold text-emerald-200">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-[#c8a84e]" />
                <span>
                  {isAr ? "إجمالي الأعضاء الموثقين: " : "Registered members: "}
                  <strong className="text-white font-black">
                    {isAr ? formatLocalizedDigits(totalRegisteredMembers, "ar") : totalRegisteredMembers}
                  </strong>
                </span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Building2 className="w-4 h-4 text-emerald-300" />
                <span>
                  {isAr ? "١٢ مقاطعة مغطاة بالكامل" : "12 Provinces Covered"}
                </span>
              </span>
            </div>
          </div>

          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Interactive Layout: Provinces Grid + Selected Province Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Province Selector Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              {isAr ? "اختر المقاطعة لاستعراض البيانات:" : "Select a Province:"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[620px] overflow-y-auto pr-1">
              {PROVINCES.map((prov) => {
                const isSelected = prov.id === selectedProvinceId;
                const name = isAr ? prov.nameAr : isNl ? prov.nameNl : prov.nameEn;
                const memberCountFormatted = isAr ? formatLocalizedDigits(prov.membersCount, "ar") : prov.membersCount;

                return (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvinceId(prov.id)}
                    className={`w-full text-start p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-[#1a5632] text-white border-[#1a5632] shadow-md scale-[1.01]"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-black tracking-wide">{name}</h4>
                      <p className={`text-[11px] ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                        {prov.capital}
                      </p>
                    </div>

                    <div className="text-end shrink-0">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50"
                        }`}
                      >
                        {memberCountFormatted} {isAr ? "عضو" : "members"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Province Detailed Information (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProvince.capital}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {isAr ? selectedProvince.nameAr : isNl ? selectedProvince.nameNl : selectedProvince.nameEn}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "الأعضاء" : "Members"}</span>
                  <span className="text-lg font-black text-[#1a5632] dark:text-emerald-400">
                    {isAr ? formatLocalizedDigits(selectedProvince.membersCount, "ar") : selectedProvince.membersCount}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[90px]">
                  <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "المراكز" : "Hubs"}</span>
                  <span className="text-lg font-black text-[#c8a84e]">
                    {isAr ? formatLocalizedDigits(selectedProvince.centersCount, "ar") : selectedProvince.centersCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Highlights Note */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                {isAr ? selectedProvince.highlightAr : isNl ? selectedProvince.highlightNl : selectedProvince.highlightEn}
              </p>
            </div>

            {/* Community Centers & Offices */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span>{isAr ? "المراكز والمكاتب الرسمية المعتمدة:" : "Official Centers & Offices:"}</span>
              </h3>

              {selectedProvince.centers.length > 0 ? (
                <div className="space-y-2">
                  {selectedProvince.centers.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          {isAr ? c.nameAr : c.nameNl}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span dir="ltr">{c.address}</span>
                        </p>
                      </div>

                      <a
                        href={`tel:${c.phone}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:text-emerald-600 transition-colors shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{c.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center text-xs text-slate-400">
                  {isAr ? "يتم التنسيق حالياً لافتتاح نقطة تواصل إضافية في هذه المقاطعة." : "Additional coordination points are being arranged in this province."}
                </div>
              )}
            </div>

            {/* Discount Partners */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#c8a84e]" />
                  <span>{isAr ? "المتاجر والشركاء في شبكة الخصومات:" : "Discount Network Partners:"}</span>
                </h3>

                <Link
                  href={`/${locale}/services/discounts`}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {isAr ? "عرض كل الشركاء &larr;" : "View all partners &rarr;"}
                </Link>
              </div>

              {selectedProvince.partners.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProvince.partners.map((p, i) => {
                    const discount = isAr ? p.discountAr : isNl ? p.discountNl : p.discountEn;
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 space-y-1"
                      >
                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-md">
                          {discount}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                          {isAr ? p.nameAr : p.nameNl}
                        </h4>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center text-xs text-slate-400">
                  {isAr ? "لا توجد متاجر مسجلة حالياً في هذه المقاطعة. هل أنت صاحب متجر؟ انضم لشبكتنا الآن!" : "No registered partners in this province yet."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
