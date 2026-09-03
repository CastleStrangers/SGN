"use client";

import { useLocale } from "next-intl";
import { 
  DollarSign, Users, HeartHandshake, TrendingUp, CreditCard, 
  ArrowUpRight, Building2, Crown, CheckCircle2, Download
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

export default function RevenueDashboardPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const totalRev = "4485.00";
  const activeVip = "1500";
  const ownerShare = "3139.50";
  const fundShare = "1345.50";

  const transactions = [
    { id: "TX-9081", name: "Ahmad Al-Khatib", plan: isAr ? "SGN VIP (شهري)" : "SGN VIP (Monthly)", amount: "2.99", bank: "ING Bank (iDEAL)", date: "03/09/2026", status: "success" },
    { id: "TX-9080", name: "Damascus Grill Amsterdam", plan: isAr ? "باقة الأعمال الذهبية" : "Gold Business", amount: "49.00", bank: "Rabobank (iDEAL)", date: "02/09/2026", status: "success" },
    { id: "TX-9079", name: "Hiba Mansour", plan: isAr ? "SGN VIP (سنوي)" : "SGN VIP (Yearly)", amount: "29.00", bank: "ABN AMRO (iDEAL)", date: "02/09/2026", status: "success" },
    { id: "TX-9078", name: "EuroTex Vertalingen", plan: isAr ? "باقة الأعمال الفضية" : "Silver Business", amount: "15.00", bank: "SNS Bank (iDEAL)", date: "01/09/2026", status: "success" },
    { id: "TX-9077", name: "Fadi Al-Ali", plan: isAr ? "SGN VIP (شهري)" : "SGN VIP (Monthly)", amount: "2.99", bank: "bunq (iDEAL)", date: "01/09/2026", status: "success" },
  ];

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "التقارير المالية وإيرادات الاشتراكات" : isNl ? "Financieel Overzicht & Inkomsten" : "Financial Overview & Revenue"}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAr ? "متابعة الاشتراكات الشهرية، بوابة الدفع iDEAL، وعوائد صندوق الجالية." : isNl ? "Inzicht in abonnementen, iDEAL transacties en het gemeenschapsfonds." : "Tracking subscriptions, iDEAL transactions, and the community fund."}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? "تصدير التقرير المالي" : isNl ? "Exporteer rapport" : "Export Report"}</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isAr ? "إجمالي الدخل الشهري" : isNl ? "Totale Maandomzet" : "Total Monthly Revenue"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            € {isAr ? formatLocalizedDigits(totalRev, "ar") : totalRev}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% {isAr ? "مقارنة بالشهر الماضي" : "vs last month"}</span>
          </div>
        </div>

        {/* Card 2: Active VIP Members */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isAr ? "المشتركون النشطون (VIP)" : isNl ? "Actieve VIP Leden" : "Active VIP Members"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {isAr ? formatLocalizedDigits(activeVip, "ar") : activeVip}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {isAr ? "١٪ من إجمالي الجالية في هولندا" : "1% of community in NL"}
          </span>
        </div>

        {/* Card 3: Project Owner Share */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isAr ? "صافي عائد المشروع (٧٠٪)" : isNl ? "Netto Projectopbrengst" : "Net Owner Share (70%)"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            € {isAr ? formatLocalizedDigits(ownerShare, "ar") : ownerShare}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {isAr ? "عوائد استثمارية وتطوير" : "Infrastructure & operations"}
          </span>
        </div>

        {/* Card 4: Community Fund Share */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">
              {isAr ? "صندوق الجالية (٣٠٪)" : isNl ? "Gemeenschapsfonds" : "Community Fund (30%)"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            € {isAr ? formatLocalizedDigits(fundShare, "ar") : fundShare}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">
            {isAr ? "مخصص للمساعدات والأنشطة" : "Social & community programs"}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isAr ? "آخر عمليات الدفع المسجلة (iDEAL)" : isNl ? "Recente iDEAL Transacties" : "Recent iDEAL Transactions"}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? "عمليات دفع الاشتراكات المباشرة والموثقة" : "Direct verified subscription payments"}
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
            <CreditCard className="w-3.5 h-3.5" />
            <span>iDEAL Active</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase border-y border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 text-start">{isAr ? "رقم المعاملة" : "Transactie ID"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "المشترك" : "Lid / Bedrijf"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "الباقة" : "Pakket"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "المبلغ" : "Bedrag"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "طريقة الدفع" : "Betaalmethode"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "التاريخ" : "Datum"}</th>
                <th className="py-3 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400" dir="ltr">{tx.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{tx.name}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{tx.plan}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white" dir="ltr">
                    € {isAr ? formatLocalizedDigits(tx.amount, "ar") : tx.amount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{tx.bank}</td>
                  <td className="py-3.5 px-4 text-slate-400" dir="ltr">
                    {isAr ? formatLocalizedDigits(tx.date, "ar") : tx.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isAr ? "ناجحة" : isNl ? "Geslaagd" : "Success"}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
