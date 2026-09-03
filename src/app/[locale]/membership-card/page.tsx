"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { 
  CreditCard, Sparkles, QrCode, Search, ShieldCheck, Printer, 
  Share2, ArrowRight, CheckCircle2, UserCheck, Download, ExternalLink,
  MapPin, Calendar, User
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

const SYRIAN_CITIES = [
  "دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "إدلب", 
  "درعا", "دير الزور", "الرقة", "الحسكة", "السويداء", "القنيطرة"
];

const NL_PROVINCES = [
  "Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant",
  "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg"
];

function SyrianFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#000000"/>
      <rect y="200" width="900" height="200" fill="#ffffff"/>
      <rect y="400" width="900" height="200" fill="#007a3d"/>
      <g fill="#ce1126" transform="translate(450,300)">
        <polygon points="0,-60 14.1,-43.5 -22.8,-14.1 22.8,-14.1 -14.1,-43.5"/>
        <polygon points="57,-18.5 51.1,-35.2 21.8,-3.6 47.6,12.8 34.9,-7.7"/>
        <polygon points="-57,-18.5 -51.1,-35.2 -21.8,-3.6 -47.6,12.8 -34.9,-7.7"/>
        <polygon points="35.2,47.6 22.5,28 -4.2,57.8 18.4,30.5 41.9,44"/>
        <polygon points="-35.2,47.6 -22.5,28 4.2,57.8 -18.4,30.5 -41.9,44"/>
      </g>
    </svg>
  );
}

function DutchFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 6" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="9" height="2" fill="#AE1C28"/>
      <rect y="2" width="9" height="2" fill="#fff"/>
      <rect y="4" width="9" height="2" fill="#21468B"/>
    </svg>
  );
}

export default function MembershipCardHubPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  // Demo Card Generator State
  const [nameAr, setNameAr] = useState(isAr ? "محمد أحمد عزيزة" : "Mohamed Ahmed Aziza");
  const [nameNl, setNameNl] = useState("Mohamed Aziza");
  const [birthYear, setBirthYear] = useState("1992");
  const [originCity, setOriginCity] = useState(isAr ? "دمشق" : "Damascus");
  const [nlCity, setNlCity] = useState("Rotterdam");
  const [nlProvincie, setNlProvincie] = useState("Zuid-Holland");
  const [memberNum, setMemberNum] = useState("0142");
  const [isGenerated, setIsGenerated] = useState(true);

  // Search Existing State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://sgn-indol.vercel.app/api/members/id-card/verify?id=${memberNum}`)}&bgcolor=1a5632&color=ffffff&margin=4`;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <CreditCard className="w-3.5 h-3.5" />
            <span>
              {isAr ? "بطاقة العضوية الرقمية الذكية" : isNl ? "Digitale Smart Lidmaatschapspas" : "Digital Smart Membership Card"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "هويتك الرقمية الموحدة في هولندا" : isNl ? "Uw Digitale Gemeenschapspas in Nederland" : "Your Digital Community Pass in the Netherlands"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            {isAr
              ? "بطاقة ذكية رسمية تثبت عضويتك في الجالية السورية في هولندا، تمنحك خصومات حصرية في المطاعم والمحلات، ومجهزة للحفظ المباشر في Apple Wallet و Google Wallet."
              : isNl
              ? "Officiële digitale lidmaatschapskaart met verificatie-QR, kortingen bij aangesloten partners en directe integratie met Apple & Google Wallet."
              : "Official digital membership card featuring dynamic verification QR, exclusive partner discounts, and Apple/Google Wallet integration."}
          </p>
        </div>

        {/* 2 Column Layout: Interactive Live Card Preview & Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Live Render of the Smart Card (5 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>{isAr ? "معاينة البطاقة الحية" : isNl ? "Live Voorbeeld" : "Live Card Preview"}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? "عضوية فعالة | Active" : "Active Member"}</span>
                </span>
              </div>

              {/* The Actual Physical-like Card (Standard 85.6mm x 53.98mm ratio) */}
              <div className="relative w-full aspect-[1.586/1] bg-gradient-to-br from-[#1a5632] via-[#144226] to-[#0d2d1a] text-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden border border-emerald-400/30">
                {/* Background Pattern Watermark */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Row: Header & Flags */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-200 uppercase tracking-wider">
                      {isAr ? "الجالية السورية في هولندا" : isNl ? "Syrische Gemeenschap in NL" : "Syrian Community in NL"}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-white">
                      SGN SMART PASS
                    </p>
                  </div>
                  
                  {/* Flags Together */}
                  <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm p-1 rounded-lg border border-white/10">
                    <SyrianFlag className="w-6 h-4 rounded shadow-sm" />
                    <span className="text-white/40 text-xs">|</span>
                    <DutchFlag className="w-6 h-4 rounded shadow-sm" />
                  </div>
                </div>

                {/* Card Middle Row: Names & Details */}
                <div className="relative z-10 flex items-center justify-between gap-4 my-auto">
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                      {nameAr}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-200">
                      {nameNl}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-100/80 pt-1">
                      <span>{originCity}</span>
                      <span>•</span>
                      <span>{nlCity} ({nlProvincie})</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="shrink-0 bg-white/10 p-1.5 rounded-xl border border-white/20 backdrop-blur-sm">
                    <img
                      src={qrUrl}
                      alt="Verification QR"
                      width={64}
                      height={64}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>

                {/* Card Bottom Row: Member Number & Verification Link */}
                <div className="relative z-10 flex items-end justify-between pt-2 border-t border-emerald-500/30 text-[10px] sm:text-xs">
                  <div>
                    <span className="text-emerald-300/70 block text-[9px] uppercase font-bold">
                      {isAr ? "رقم العضوية" : "Member No."}
                    </span>
                    <span className="font-mono font-black text-white text-xs sm:text-sm tracking-wider" dir="ltr">
                      #{memberNum}
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="text-emerald-300/70 block text-[9px] uppercase font-bold">
                      {isAr ? "سنة الميلاد" : "Birth Year"}
                    </span>
                    <span className="font-mono font-bold text-white" dir="ltr">
                      {birthYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Apple Wallet, Google Wallet, Print */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => alert(isAr ? "تم تجهيز بطاقتك لمحفظة Apple Wallet!" : "Card prepared for Apple Wallet!")}
                    className="py-3 px-4 bg-black hover:bg-neutral-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <span className="text-base leading-none"></span>
                    <span>{isAr ? "إضافة لـ Apple Wallet" : "Add to Apple Wallet"}</span>
                  </button>

                  <button
                    onClick={() => alert(isAr ? "تم تجهيز بطاقتك لمحفظة Google Wallet!" : "Card prepared for Google Wallet!")}
                    className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <span className="text-base font-bold text-blue-400 leading-none">G</span>
                    <span>{isAr ? "إضافة لـ Google Wallet" : "Add to Google Wallet"}</span>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isAr ? "طباعة البطاقة / حفظ كـ PDF" : isNl ? "Printen / PDF opslaan" : "Print / Save PDF"}</span>
                  </button>

                  <a
                    href={`/${locale}/services/discounts`}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{isAr ? "شبكة الخصومات" : isNl ? "Kortingen" : "Discounts"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Interactive Card Generator & Details Form (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? "بيانات البطاقة الذكية" : isNl ? "Gegevens Lidmaatschapspas" : "Card Information"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isAr ? "عدّل بياناتك لتحديث البطاقة الرقمية الحية فوراً." : "Customize information to update the card in real-time."}
                </p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? "الاسم بالعربية" : "Arabic Full Name"}</span>
                    </label>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? "الاسم باللاتيني (حسب الإقامة)" : "Latin Full Name"}</span>
                    </label>
                    <input
                      type="text"
                      value={nameNl}
                      onChange={(e) => setNameNl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? "سنة الميلاد" : "Birth Year"}</span>
                    </label>
                    <input
                      type="text"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? "مدينة الأصل بسوريا" : "Origin City"}</span>
                    </label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? "المدينة بهولندا" : "Dutch City"}</span>
                    </label>
                    <input
                      type="text"
                      value={nlCity}
                      onChange={(e) => setNlCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isAr ? "المقاطعة الهولندية (Provincie)" : "Dutch Province"}
                  </label>
                  <select
                    value={nlProvincie}
                    onChange={(e) => setNlProvincie(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {NL_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <a
                    href={`/${locale}/join`}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center justify-center gap-2 transition-all"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{isAr ? "تسجيل عضوية رسمية جديدة في الجالية" : isNl ? "Officieel Lid Worden" : "Register Official Membership"}</span>
                  </a>
                </div>
              </form>
            </div>

            {/* How It Works Box */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-6 rounded-3xl border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
              <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "كيف تعمل بطاقة العضوية الذكية في هولندا؟" : isNl ? "Hoe werkt de Smart Pas?" : "How does the Smart Card work?"}</span>
              </h4>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">١</span>
                  <span>{isAr ? "تُصدر برقم تسلسلي فريد وكود QR مشفر مربوط بقاعدة بيانات الجالية." : "Issued with a unique number and QR linked to database."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">٢</span>
                  <span>{isAr ? "عند زيارة أي مطعم أو متجر شريك، يقوم البائع بمسح الـ QR للتحقق ومنحك الخصم الفوري." : "Partners scan the QR to grant exclusive discounts."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">٣</span>
                  <span>{isAr ? "يمكن حفظها في محفظة Apple Wallet أو Google Wallet واستخدامها بدون إنترنت." : "Works offline directly from Apple & Google Wallet."}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
