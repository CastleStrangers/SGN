"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, AreaChart, Area, CartesianGrid
} from "recharts";
import {
  Loader2, Users, MapPin, RefreshCw, Activity, Calendar
} from "lucide-react";

// Local translation dictionary for robust locale support
const LOCAL_TRANSLATIONS = {
  ar: {
    title: "لوحة إحصائيات الأعضاء",
    subtitle: "تحليل ديموغرافي تفاعلي لقاعدة بيانات أعضاء الجالية السورية في هولندا",
    totalMembers: "إجمالي الأعضاء المسجلين",
    topProvince: "المقاطعة الأكثر نشاطاً",
    genderRatio: "توزيع الجنسين",
    male: "ذكور",
    female: "إناث",
    provincesTitle: "توزيع الأعضاء حسب المقاطعات الهولندية",
    governoratesTitle: "أصول الأعضاء حسب المحافظات السورية",
    ageTrendTitle: "التوزيع السكاني حسب الفئات العمرية",
    loading: "جاري تحميل الإحصائيات والمخططات البيانية...",
    error: "فشل في تحميل الإحصائيات، يرجى المحاولة لاحقاً.",
    noData: "لا توجد بيانات متاحة حالياً.",
    activeMembers: "عضو نشط",
    under25: "أقل من 25 سنة",
    age25to34: "25 - 34 سنة",
    age35to44: "35 - 44 سنة",
    age45to54: "45 - 54 سنة",
    above55: "55 سنة فما فوق",
    dutchMetrics: "مقاطعات هولندا",
    syrianMetrics: "محافظات سوريا",
    refresh: "تحديث البيانات المباشرة",
    realtime: "مباشر",
    ratioTooltip: "توزيع الذكور والإناث",
    memberCount: "عضو",
    ratioSummary: "نسبة الإناث إلى الذكور"
  },
  nl: {
    title: "Leden Statistieken Dashboard",
    subtitle: "Real-time interactieve demografische analyse van geregistreerde SGN-leden",
    totalMembers: "Totaal Aantal Leden",
    topProvince: "Actiefste Provincie",
    genderRatio: "Gender Verhouding",
    male: "Mannen",
    female: "Vrouwen",
    provincesTitle: "Ledenverdeling per Nederlandse Provincie",
    governoratesTitle: "Herkomst per Syrisch Gouvernement",
    ageTrendTitle: "Leeftijdsopbouw per Categorie",
    loading: "Statistieken en diagrammen laden...",
    error: "Laden van statistieken mislukt, probeer het later opnieuw.",
    noData: "Geen gegevens beschikbaar.",
    activeMembers: "Actief lid",
    under25: "Jonger dan 25 jaar",
    age25to34: "25 - 34 jaar",
    age35to44: "35 - 44 jaar",
    age45to54: "45 - 54 jaar",
    above55: "55 jaar en ouder",
    dutchMetrics: "NL Provincies",
    syrianMetrics: "Syrische Gouvernementen",
    refresh: "Live Gegevens Vernieuwen",
    realtime: "Live",
    ratioTooltip: "Mannen vs Vrouwen verhouding",
    memberCount: "leden",
    ratioSummary: "Verhouding V / M"
  },
  en: {
    title: "Members Statistics Dashboard",
    subtitle: "Real-time interactive demographic analysis of registered SGN members",
    totalMembers: "Total Registered Members",
    topProvince: "Top Active Province",
    genderRatio: "Gender Ratio",
    male: "Male",
    female: "Female",
    provincesTitle: "Members Distribution by Dutch Province",
    governoratesTitle: "Origin by Syrian Governorate",
    ageTrendTitle: "Age Distribution by Category",
    loading: "Loading statistics and charts...",
    error: "Failed to load statistics, please try again later.",
    noData: "No data available.",
    activeMembers: "Active member",
    under25: "Under 25 years",
    age25to34: "25 - 34 years",
    age35to44: "35 - 44 years",
    age45to54: "45 - 54 years",
    above55: "55 years and older",
    dutchMetrics: "Dutch Provinces",
    syrianMetrics: "Syrian Governorates",
    refresh: "Refresh Live Data",
    realtime: "Live",
    ratioTooltip: "Male vs Female distribution",
    memberCount: "members",
    ratioSummary: "Ratio F / M"
  }
};

interface MemberStats {
  total: number;
  topProvince: string;
  genderData: { name: string; count: number; percentage: number }[];
  provinceData: { name: string; count: number }[];
  governorateData: { name: string; count: number }[];
  birthYearData: { birthYear: number; count: number }[];
  ageGroupData: { name: string; count: number }[];
}

export default function MemberStatsDashboard() {
  const locale = useLocale();
  const t = LOCAL_TRANSLATIONS[locale as "ar" | "en" | "nl"] || LOCAL_TRANSLATIONS.ar;
  const isRtl = locale === "ar";

  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard/member-stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#0B0F19] rounded-3xl min-h-[80vh] text-gray-400">
        <Loader2 className="w-12 h-12 animate-spin text-[#00D2FF] mb-4" />
        <p className="text-sm font-medium">{t.loading}</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-[#0B0F19] rounded-3xl min-h-[80vh] text-red-400 p-6">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-bold mb-4">{t.error}</p>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.refresh}</span>
        </button>
      </div>
    );
  }

  // Formatting calculations for Top KPIs
  const maleObj = stats.genderData.find(g => g.name === "male");
  const femaleObj = stats.genderData.find(g => g.name === "female");
  const malePercent = maleObj ? maleObj.percentage : 0;
  const femalePercent = femaleObj ? femaleObj.percentage : 0;
  const ratioString = `${femalePercent}% / ${malePercent}%`;

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1F2937] border border-gray-700 p-3 rounded-xl shadow-xl text-xs text-gray-200">
          <p className="font-bold mb-1 text-gray-300">{label}</p>
          <p className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill || payload[0].stroke }} />
            <span>{payload[0].value} {t.memberCount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getAgeLabel = (key: string) => {
    switch (key) {
      case "under25": return t.under25;
      case "age25to34": return t.age25to34;
      case "age35to44": return t.age35to44;
      case "age45to54": return t.age45to54;
      case "above55": return t.above55;
      default: return key;
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[#0B0F19] text-gray-100 p-6 md:p-8 rounded-3xl min-h-screen border border-gray-800 shadow-2xl space-y-8 select-none">
      
      {/* Header section with live indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <span className="flex items-center gap-1 bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {t.realtime}
            </span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mt-1.5 font-medium">
            {t.subtitle}
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 self-start bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-5.5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 shadow-lg shadow-black/35 hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#00D2FF]" : ""}`} />
          <span>{t.refresh}</span>
        </button>
      </div>

      {/* Top Stats KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Total Registered Members */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 flex items-center justify-between gap-4 transition-all duration-300 hover:border-blue-500/30 hover:shadow-blue-500/5 group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.totalMembers}</p>
            <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#3B82F6] to-[#00D2FF] bg-clip-text text-transparent tracking-tight">
              {stats.total.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-500 font-semibold">{t.activeMembers}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 2: Top Active Province */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 flex items-center justify-between gap-4 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/5 group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.topProvince}</p>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight truncate max-w-[180px]">
              {stats.topProvince}
            </p>
            <p className="text-[10px] text-[#00D2FF] font-semibold">{t.dutchMetrics}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-7 h-7" />
          </div>
        </div>

        {/* KPI 3: Gender Ratio Summary */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 flex items-center justify-between gap-4 transition-all duration-300 hover:border-rose-500/30 hover:shadow-rose-500/5 group">
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.genderRatio}</p>
              <span className="text-xs font-black text-white">{ratioString}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3.5 overflow-hidden flex shadow-inner">
              <div className="bg-[#F43F5E]" style={{ width: `${femalePercent}%` }} title={`${t.female}: ${femalePercent}%`} />
              <div className="bg-[#3B82F6]" style={{ width: `${malePercent}%` }} title={`${t.male}: ${malePercent}%`} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />{t.female} ({femalePercent}%)</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />{t.male} ({malePercent}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Visuals: Donut Gender and Area Age Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart: Gender Split */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between hover:border-gray-600/50 transition-colors duration-300">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{t.genderRatio}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">{t.ratioTooltip}</p>
          </div>

          <div className="h-[210px] w-full flex items-center justify-center relative">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genderData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    <Cell fill="#3B82F6" /> {/* Male */}
                    <Cell fill="#F43F5E" /> {/* Female */}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const label = data.name === "male" ? t.male : t.female;
                        const color = data.name === "male" ? "#3B82F6" : "#F43F5E";
                        return (
                          <div className="bg-[#1F2937] border border-gray-700 p-2.5 rounded-lg text-xs">
                            <p className="flex items-center gap-1.5 font-bold" style={{ color }}>
                              <span>{label}</span>
                              <span>({data.percentage}%)</span>
                            </p>
                            <p className="text-gray-300 mt-0.5 font-medium">{data.count} {t.memberCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Overlay total number inside the Donut hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">{t.realtime}</span>
              <span className="text-2xl font-black text-white">{stats.total}</span>
            </div>
          </div>

          <div className="flex justify-around items-center border-t border-gray-800 pt-4 mt-2 text-xs font-semibold text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6/50]" />
              <span>{t.male}: {maleObj?.count || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E/50]" />
              <span>{t.female}: {femaleObj?.count || 0}</span>
            </div>
          </div>
        </div>

        {/* Glowing Area Chart: Age distribution groups */}
        <div className="lg:col-span-2 bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between hover:border-gray-600/50 transition-colors duration-300">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{t.ageTrendTitle}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">{t.subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="h-[210px] w-full mt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ageColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.25} />
                  <XAxis
                    dataKey="name"
                    tickFormatter={getAgeLabel}
                    stroke="#718096"
                    tick={{ fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis stroke="#718096" allowDecimals={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#1F2937] border border-gray-700 p-3 rounded-xl shadow-xl text-xs text-gray-200">
                            <p className="font-bold text-emerald-400 mb-1">{getAgeLabel(data.name)}</p>
                            <p className="font-semibold">{data.count} {t.memberCount}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#ageColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Visuals: Two Horizontal Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Horizontal Bar Chart: Syrian Governorates Origin */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 hover:border-gray-600/50 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{t.governoratesTitle}</h3>
              <p className="text-[10px] text-[#10B981] font-bold mt-0.5">{t.syrianMetrics}</p>
            </div>
            <div className="text-xs bg-[#10B981]/15 text-[#10B981] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
              <span>{stats.governorateData.length}</span>
              <span>{t.syrianMetrics}</span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            {mounted && stats.governorateData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.governorateData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" horizontal={false} opacity={0.25} />
                  <XAxis type="number" stroke="#718096" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="#718096" width={75} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#10B981" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">{t.noData}</div>
            )}
          </div>
        </div>

        {/* Horizontal Bar Chart: Dutch Provinces Distribution */}
        <div className="bg-[#1F2937]/90 border border-gray-700/60 shadow-xl backdrop-blur-md rounded-2xl p-6 hover:border-gray-600/50 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">{t.provincesTitle}</h3>
              <p className="text-[10px] text-[#00D2FF] font-bold mt-0.5">{t.dutchMetrics}</p>
            </div>
            <div className="text-xs bg-[#00D2FF]/15 text-[#00D2FF] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
              <span>{stats.provinceData.length}</span>
              <span>{t.dutchMetrics}</span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            {mounted && stats.provinceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.provinceData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" horizontal={false} opacity={0.25} />
                  <XAxis type="number" stroke="#718096" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="#718096" width={95} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#00D2FF" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">{t.noData}</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
