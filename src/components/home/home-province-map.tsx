"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import NetherlandsMap from "@/components/dashboard/NetherlandsMap";
import { Users, MapPin, TrendingUp } from "lucide-react";

interface ProvinceData {
  name: string;
  count: number;
}

interface StatsResponse {
  total: number;
  provinceData: ProvinceData[];
}

const PROVINCE_LABELS: Record<string, { ar: string; en: string; nl: string }> = {
  "Groningen":    { ar: "خرونينغن",    en: "Groningen",    nl: "Groningen" },
  "Friesland":   { ar: "فريزلاند",    en: "Friesland",    nl: "Friesland" },
  "Drenthe":     { ar: "درينته",      en: "Drenthe",      nl: "Drenthe" },
  "Overijssel":  { ar: "أوفرايسل",   en: "Overijssel",   nl: "Overijssel" },
  "Flevoland":   { ar: "فليفولاند",   en: "Flevoland",    nl: "Flevoland" },
  "Gelderland":  { ar: "خيلدرلاند",  en: "Gelderland",   nl: "Gelderland" },
  "Utrecht":     { ar: "أوتريخت",    en: "Utrecht",      nl: "Utrecht" },
  "Noord-Holland": { ar: "شمال هولندا", en: "North Holland", nl: "Noord-Holland" },
  "Zuid-Holland":  { ar: "جنوب هولندا", en: "South Holland", nl: "Zuid-Holland" },
  "Zeeland":     { ar: "زيلاند",     en: "Zeeland",      nl: "Zeeland" },
  "Noord-Brabant": { ar: "شمال برابنت", en: "North Brabant", nl: "Noord-Brabant" },
  "Limburg":     { ar: "ليمبورخ",    en: "Limburg",      nl: "Limburg" },
};

export function HomeProvinceMap() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const t = useTranslations("communityStats");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/province-stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const topProvince = stats?.provinceData?.[0];
  const topProvinceLabel = topProvince
    ? (PROVINCE_LABELS[topProvince.name]?.[locale] || topProvince.name)
    : "—";

  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-4 pb-16 mt-0">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 shadow-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <MapPin className="w-3.5 h-3.5" />
          {locale === "ar" ? "التوزيع الجغرافي للأعضاء" : locale === "nl" ? "Geografische Verdeling" : "Geographic Distribution"}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {locale === "ar"
            ? "الجالية السورية في مقاطعات هولندا"
            : locale === "nl"
            ? "Syrische Gemeenschap in Nederlandse Provincies"
            : "Syrian Community Across Dutch Provinces"}
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm max-w-xl">
          {locale === "ar"
            ? "خريطة تفاعلية تُظهر توزيع أعضاء الجالية السورية في المقاطعات الهولندية الـ 12"
            : locale === "nl"
            ? "Interactieve kaart die de spreiding van Syrische gemeenschapsleden over de 12 provincies toont"
            : "Interactive map showing the spread of Syrian community members across the 12 Dutch provinces"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Map — bigger */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 h-[520px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">
                  {locale === "ar" ? "جاري تحميل الخريطة..." : locale === "nl" ? "Kaart laden..." : "Loading map..."}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full">
              <NetherlandsMap data={stats?.provinceData || []} mapClassName="h-full" />
            </div>
          )}
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          {/* Total members card */}
          <div className="bg-white dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {locale === "ar" ? "إجمالي الأعضاء" : locale === "nl" ? "Totaal leden" : "Total Members"}
              </p>
            </div>
            <p className="text-4xl font-black text-gray-900 dark:text-white">
              {loading ? "—" : (stats?.total || 0).toLocaleString()}
            </p>
          </div>

          {/* Top province card */}
          <div className="bg-white dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {locale === "ar" ? "أكثر مقاطعة أعضاءً" : locale === "nl" ? "Meeste leden" : "Top Province"}
              </p>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{topProvinceLabel}</p>
            {topProvince && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                {topProvince.count} {locale === "ar" ? "عضو" : locale === "nl" ? "leden" : "members"}
              </p>
            )}
          </div>

          {/* Top 5 provinces list */}
          <div className="bg-white dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              {locale === "ar" ? "أكبر 5 مقاطعات" : locale === "nl" ? "Top 5 provincies" : "Top 5 Provinces"}
            </h4>
            <div className="space-y-3">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                  ))
                : stats?.provinceData.slice(0, 5).map((p, i) => {
                    const label = PROVINCE_LABELS[p.name]?.[locale] || p.name;
                    const max = stats.provinceData[0]?.count || 1;
                    const pct = Math.round((p.count / max) * 100);
                    return (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className="text-xs font-black text-gray-400 w-4">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{label}</span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 ms-2 shrink-0">{p.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
