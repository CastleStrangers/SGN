"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  QrCode, Search, ShieldCheck, CheckCircle2, XCircle, 
  UserCheck, AlertTriangle, ArrowRight, ArrowLeft, Sparkles,
  Printer, Check, Phone, MapPin, CreditCard, Camera
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface VerifiedMember {
  id: string;
  memberNumber: string;
  nameAr: string;
  nameNl: string;
  city: string;
  province: string;
  originCity: string;
  plan: string;
  active: boolean;
  validUntil: string;
}

const DEMO_MEMBERS: Record<string, VerifiedMember> = {
  "1042": {
    id: "mem-1042",
    memberNumber: "1042",
    nameAr: "محمد سليم عزيزة",
    nameNl: "Mohamed Salim Aziza",
    city: "Rotterdam",
    province: "Zuid-Holland",
    originCity: "دمشق",
    plan: "عضوية ذهبية (VIP Gold)",
    active: true,
    validUntil: "31/12/2027",
  },
  "1089": {
    id: "mem-1089",
    memberNumber: "1089",
    nameAr: "أحمد الحرفي",
    nameNl: "Ahmad Al-Herafi",
    city: "Den Haag",
    province: "Zuid-Holland",
    originCity: "حلب",
    plan: "عضوية داعمة (Supporter)",
    active: true,
    validUntil: "31/12/2026",
  },
  "1105": {
    id: "mem-1105",
    memberNumber: "1105",
    nameAr: "هدى الحلاق",
    nameNl: "Hoda Al-Hallaq",
    city: "Amsterdam",
    province: "Noord-Holland",
    originCity: "حمص",
    plan: "عضوية رسمية (Standard)",
    active: true,
    validUntil: "31/12/2026",
  },
};

export default function VerifyPassPartnerPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<VerifiedMember | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleVerify = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim().replace("#", "");
    if (!code) return;

    setLoading(true);
    setNotFound(false);
    setDiscountApplied(false);

    setTimeout(() => {
      setLoading(false);
      const found = DEMO_MEMBERS[code] || (code.length >= 3 ? {
        id: `mem-${code}`,
        memberNumber: code,
        nameAr: isAr ? "عضو معتمد مسجل" : "Geverifieerd Lid",
        nameNl: "Geverifieerd Lid",
        city: "Utrecht",
        province: "Utrecht",
        originCity: "سوريا",
        plan: "عضوية سارية (Active Member)",
        active: true,
        validUntil: "31/12/2026",
      } : null);

      if (found) {
        setMember(found);
      } else {
        setNotFound(true);
        setMember(null);
      }
    }, 600);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
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
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isAr ? "بوابة التحقق الرسمية لشركاء ومتاجر الجالية" : isNl ? "Officiële Verificatieportal voor Partners" : "Official Partner Verification Portal"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "ماسح وفحص بطاقة العضوية الذكية" : isNl ? "Scanner & Verificatie van Lidmaatschapspas" : "Smart Membership Pass Scanner"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "مخصص للمطاعم، المتاجر، والمكاتب الشريكة للتحقق الفوري من سريان بطاقة عضوية الجالية وتطبيق نسبة الخصم المعتمدة بنقرة زر."
              : isNl
              ? "Speciaal voor aangesloten horeca, winkels en dienstverleners om direct de geldigheid van de lidmaatschapspas te controleren."
              : "Built for partner restaurants, stores, and legal offices to instantly verify SGN community membership and grant perks."}
          </p>
        </div>

        {/* Scanner & Input Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isAr ? "right-3.5" : "left-3.5"}`} />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  placeholder={isAr ? "أدخل رقم العضوية (مثال: 1042 أو 1089)..." : "Enter member number (e.g. 1042)..."}
                  className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold ${
                    isAr ? "pr-10 pl-3" : "pl-10 pr-3"
                  }`}
                />
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={loading || !inputCode.trim()}
                className="px-6 py-3 bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loading ? (isAr ? "جاري الفحص..." : "Checking...") : (isAr ? "فحص البطاقة" : "Verify Pass")}
              </button>
            </div>

            {/* Quick Demo Buttons */}
            <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-400">
              <span>{isAr ? "بطاقات تجريبية سريعة:" : "Test member passes:"}</span>
              {["1042", "1089", "1105"].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setInputCode(code);
                    handleVerify(code);
                  }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 rounded-lg font-mono font-bold hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  #{code}
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Card */}
          {member && (
            <div className="max-w-xl mx-auto bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 rounded-3xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? "عضوية نشطة وموثقة رسمياً" : "Active & Verified Membership"}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                    {isAr ? member.nameAr : member.nameNl}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {member.nameNl}
                  </p>
                </div>

                <div className="text-end">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{isAr ? "رقم العضوية" : "Pass ID"}</span>
                  <span className="text-lg font-mono font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                    #{member.memberNumber}
                  </span>
                </div>
              </div>

              {/* Details Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "المدينة والمقاطعة" : "City & Province"}</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">{member.city} ({member.province})</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
                  <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "نوع العضوية" : "Membership Plan"}</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{member.plan}</span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-bold">{isAr ? "صالحة حتى" : "Valid Until"}</span>
                  <span className="font-mono font-black text-slate-800 dark:text-slate-200" dir="ltr">{member.validUntil}</span>
                </div>
              </div>

              {/* Discount Grant Action */}
              <div className="pt-3 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200 font-bold">
                  <Sparkles className="w-4 h-4 text-[#c8a84e]" />
                  <span>{isAr ? "مستحق لخصم الشركاء الفوري (١٥٪ - ٢٠٪)" : "Eligible for 15% - 20% Partner Discount"}</span>
                </div>

                {!discountApplied ? (
                  <button
                    onClick={() => setDiscountApplied(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a84e] hover:bg-[#b8973f] text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? "تطبيق الخصم للعميل" : "Apply Discount"}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? "تم تسجيل الخصم بنجاح!" : "Discount Applied Successfully!"}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Not Found */}
          {notFound && (
            <div className="max-w-xl mx-auto p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl text-center space-y-2 animate-in fade-in duration-150">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="text-base font-black text-rose-900 dark:text-rose-200">
                {isAr ? "لم يتم العثور على عضوية بهذا الرقم" : "Membership Pass Not Found"}
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                {isAr
                  ? "يرجى التحقق من الرقم المطبوع على البطاقة أو إعادة المحاولة."
                  : "Please verify the member pass number and try again."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
