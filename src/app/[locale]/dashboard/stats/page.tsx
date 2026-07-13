"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  ResponsiveContainer, LineChart, Line, CartesianGrid, Treemap
} from "recharts";
import {
  Loader2, RefreshCw, Printer, Calendar, Info
} from "lucide-react";
import Image from "next/image";
import NetherlandsMap from "@/components/dashboard/NetherlandsMap";

interface MemberStats {
  total: number;
  topProvince: string;
  genderData: { name: string; count: number; percentage: number }[];
  provinceData: { name: string; count: number }[];
  governorateData: { name: string; count: number }[];
  birthYearData: { birthYear: number; count: number }[];
  ageGroupData: { name: string; count: number }[];
}

interface BirthYearRow {
  birthYear: number;
  count: number;
  rowSpan5: number;
  sum5: number;
  rowSpan10: number;
  sum10: number;
}

export default function MemberStatsDashboard() {
  const locale = useLocale();
  const t = useTranslations("stats");
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

  // Multi-language text map for standard formatting
  const columns = {
    index: locale === "ar" ? "م" : locale === "nl" ? "Nr" : "No",
    governorate: locale === "ar" ? "المحافظة/سوريا" : locale === "nl" ? "Gouvernement/Syrië" : "Governorate/Syria",
    province: locale === "ar" ? "المقاطعة/هولندا" : locale === "nl" ? "Provincie/Nederland" : "Province/Netherlands",
    gender: locale === "ar" ? "الجنس" : locale === "nl" ? "Geslacht" : "Gender",
    birthYear: locale === "ar" ? "سنة الولادة" : locale === "nl" ? "Geboortejaar" : "Birth Year",
    sum1: locale === "ar" ? "مجموع كل 1 سنة" : locale === "nl" ? "Totaal per 1 jaar" : "Sum per 1 year",
    sum5: locale === "ar" ? "مجموع كل 5 سنوات" : locale === "nl" ? "Totaal per 5 jaar" : "Sum per 5 years",
    sum10: locale === "ar" ? "مجموع كل 10 سنوات" : locale === "nl" ? "Totaal per 10 jaar" : "Sum per 10 years",
    count: locale === "ar" ? "العدد" : locale === "nl" ? "Aantal" : "Count",
    total: locale === "ar" ? "المجموع" : locale === "nl" ? "Totaal" : "Total",
    male: locale === "ar" ? "ذكر" : locale === "nl" ? "Man" : "Male",
    female: locale === "ar" ? "أنثى" : locale === "nl" ? "Vrouw" : "Female",
    printReport: locale === "ar" ? "طباعة التقرير" : locale === "nl" ? "Rapport afdrukken" : "Print Report",
    orgStats: locale === "ar" ? "إحصائيات تنظيمية" : locale === "nl" ? "Organisatorische statistieken" : "Organizational Stats",
    govChartTitle: locale === "ar" ? "حسب المحافظات السورية" : locale === "nl" ? "Per Syrisch Gouvernement" : "By Syrian Governorate",
    provChartTitle: locale === "ar" ? "إحصائية حسب المقاطعات في هولندا" : locale === "nl" ? "Statistiek per Nederlandse Provincie" : "Stats by Dutch Province",
    birthChartTitle: locale === "ar" ? "إحصاء حسب المواليد" : locale === "nl" ? "Statistiek per geboortejaar" : "Stats by Birth Year",
    pageNumber: locale === "ar" ? "صفحة" : locale === "nl" ? "Pagina" : "Page",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl min-h-[60vh] text-gray-400 border shadow-sm">
        <Loader2 className="w-12 h-12 animate-spin text-[#1a5632] mb-4" />
        <p className="text-sm font-bold text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl min-h-[60vh] text-red-500 p-6 border shadow-sm">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-bold mb-4">{t("error")}</p>
        <button
          onClick={() => { setLoading(true); fetchStats(); }}
          className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition duration-300 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t("refresh")}</span>
        </button>
      </div>
    );
  }

  // Calculate 5-year and 10-year rolling sums for page 3
  const computeBirthYearTable = (data: { birthYear: number; count: number }[]): BirthYearRow[] => {
    const sorted = [...data].sort((a, b) => a.birthYear - b.birthYear);
    const getBin5 = (year: number) => year < 1955 ? 1950 : Math.floor(year / 5) * 5;
    const getBin10 = (year: number) => year < 1960 ? 1950 : Math.floor(year / 10) * 10;

    const result: BirthYearRow[] = sorted.map(d => ({
      birthYear: d.birthYear,
      count: d.count,
      rowSpan5: 0,
      sum5: 0,
      rowSpan10: 0,
      sum10: 0
    }));

    const bin5Map: Record<number, number[]> = {};
    result.forEach((r, idx) => {
      const bin = getBin5(r.birthYear);
      if (!bin5Map[bin]) bin5Map[bin] = [];
      bin5Map[bin].push(idx);
    });

    Object.entries(bin5Map).forEach(([_, indices]) => {
      const sum = indices.reduce((acc, idx) => acc + result[idx].count, 0);
      const firstIdx = indices[0];
      result[firstIdx].rowSpan5 = indices.length;
      result[firstIdx].sum5 = sum;
    });

    const bin10Map: Record<number, number[]> = {};
    result.forEach((r, idx) => {
      const bin = getBin10(r.birthYear);
      if (!bin10Map[bin]) bin10Map[bin] = [];
      bin10Map[bin].push(idx);
    });

    Object.entries(bin10Map).forEach(([_, indices]) => {
      const sum = indices.reduce((acc, idx) => acc + result[idx].count, 0);
      const firstIdx = indices[0];
      result[firstIdx].rowSpan10 = indices.length;
      result[firstIdx].sum10 = sum;
    });

    return result;
  };

  const birthRows = computeBirthYearTable(stats.birthYearData);

  const maleObj = stats.genderData.find(g => g.name === "male");
  const femaleObj = stats.genderData.find(g => g.name === "female");
  const maleCount = maleObj ? maleObj.count : 0;
  const femaleCount = femaleObj ? femaleObj.count : 0;

  // Custom Treemap Content Renderer
  const CustomizedTreemapContent = (props: any) => {
    const { x, y, width, height, index, name, count } = props;
    const colors = [
      "#d97706", "#7c2d12", "#1e3a8a", "#ea580c", "#6b21a8",
      "#581c87", "#15803d", "#166534", "#0369a1", "#1e40af"
    ];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[index % colors.length],
            stroke: "#fff",
            strokeWidth: 1.5,
            strokeOpacity: 1,
          }}
        />
        {width > 60 && height > 24 && (
          <text
            x={x + 6}
            y={y + 16}
            fill="#fff"
            fontSize={10}
            fontWeight="bold"
          >
            {name}, {count}
          </text>
        )}
      </g>
    );
  };

  // Copy HTML into new print window for exact A4 paper printing
  const handlePrint = (elementId: string, title: string, orientation: "portrait" | "landscape") => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const contentHtml = element.innerHTML;
    const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "2-digit", day: "2-digit" });

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page {
              size: A4 ${orientation};
              margin: 10mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: white;
              color: black;
              direction: ${isRtl ? "rtl" : "ltr"};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1.5px solid #cbd5e1 !important;
              padding: 4px 6px !important;
              font-size: 11px !important;
              text-align: center;
            }
            th {
              background-color: #f1f5f9 !important;
              font-weight: bold;
            }
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body onload="setTimeout(function(){ window.print(); window.close(); }, 500);">
          <div class="p-2">
            ${contentHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const todayStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "nl-NL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-12 pb-16">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          <span>{t("refresh")}</span>
        </button>
      </div>

      {/* ==================== PAGE 1 REPORT CARD ==================== */}
      <div className="bg-white rounded-3xl border shadow-md overflow-hidden p-6 relative group">
        <div className="flex justify-between items-center mb-4 no-print border-b pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">PAGE 1 REPORT</span>
          <button
            onClick={() => handlePrint("report-page-1", "SGN_Governorates_Demographics", "portrait")}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{columns.printReport}</span>
          </button>
        </div>

        <div id="report-page-1" className="bg-white print-page-content text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
            <span className="text-xs text-gray-500">{todayStr}</span>
            <span className="text-base font-extrabold tracking-widest text-gray-700">SGN</span>
            <span className="text-xs font-bold text-[#1a5632]">{columns.orgStats}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table (Left column) */}
            <div className="lg:col-span-5 space-y-4">
              <table className="min-w-full border-collapse border border-gray-300 text-center text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 font-bold w-12">{columns.index}</th>
                    <th className="border border-gray-300 p-2 font-bold">{columns.governorate}</th>
                    <th className="border border-gray-300 p-2 font-bold w-20">{stats.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.governorateData.map((g, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-1.5">{idx + 1}</td>
                      <td className="border border-gray-300 p-1.5 font-medium">{g.name}</td>
                      <td className="border border-gray-300 p-1.5 font-bold">{g.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Logo and Chart (Right column) */}
            <div className="lg:col-span-7 flex flex-col items-center gap-6">
              {/* Logo */}
              <div className="flex justify-end w-full">
                <div className="relative w-20 h-20 border rounded-full p-1 bg-white shadow-sm shrink-0">
                  <img src="/logo.png" alt="SGN Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              {/* Title & Bar Chart */}
              <div className="w-full">
                <h3 className="text-center text-xs font-bold text-[#1a5632] bg-emerald-50 py-1.5 px-3 rounded-lg mb-4 inline-block mx-auto w-auto">
                  {columns.govChartTitle}
                </h3>
                <div className="h-[250px] w-full">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.governorateData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#718096" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#718096" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Bottom Gender Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-gray-500 mb-2 uppercase">{columns.gender}</span>
                  <div className="h-[120px] w-[120px]">
                    {mounted && (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.genderData}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={3}
                          >
                            <Cell fill="#3B82F6" />
                            <Cell fill="#F43F5E" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="flex gap-4 text-[10px] font-semibold mt-2">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />{columns.male}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />{columns.female}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <table className="min-w-full border-collapse border border-gray-300 text-center text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 font-bold w-12">{columns.index}</th>
                        <th className="border border-gray-300 p-2 font-bold">{columns.gender}</th>
                        <th className="border border-gray-300 p-2 font-bold w-24">{stats.total}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2 font-medium">{columns.male}</td>
                        <td className="border border-gray-300 p-2 font-bold">{maleCount}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">2</td>
                        <td className="border border-gray-300 p-2 font-medium">{columns.female}</td>
                        <td className="border border-gray-300 p-2 font-bold">{femaleCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-8 text-[10px] text-gray-400">
            <span>1/1</span>
            <span>SGN</span>
          </div>
        </div>
      </div>

      {/* ==================== PAGE 2 REPORT CARD ==================== */}
      <div className="bg-white rounded-3xl border shadow-md overflow-hidden p-6 relative group">
        <div className="flex justify-between items-center mb-4 no-print border-b pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">PAGE 2 REPORT</span>
          <button
            onClick={() => handlePrint("report-page-2", "SGN_Provinces_Distribution", "landscape")}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{columns.printReport}</span>
          </button>
        </div>

        <div id="report-page-2" className="bg-white print-page-content text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
            <span className="text-xs text-gray-500">{todayStr}</span>
            <span className="text-base font-extrabold tracking-widest text-gray-700">SGN</span>
            <span className="text-xs font-bold text-[#1a5632]">{columns.orgStats}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table (Left column) */}
            <div className="lg:col-span-5 space-y-4">
              <table className="min-w-full border-collapse border border-gray-300 text-center text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 font-bold w-12">{columns.index}</th>
                    <th className="border border-gray-300 p-2 font-bold">{columns.province}</th>
                    <th className="border border-gray-300 p-2 font-bold w-20">{stats.total}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.provinceData.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-1.5">{idx + 1}</td>
                      <td className="border border-gray-300 p-1.5 font-medium">{p.name}</td>
                      <td className="border border-gray-300 p-1.5 font-bold">{p.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Logo and Chart (Right column) */}
            <div className="lg:col-span-7 flex flex-col items-center gap-6">
              {/* Logo */}
              <div className="flex justify-end w-full">
                <div className="relative w-20 h-20 border rounded-full p-1 bg-white shadow-sm shrink-0">
                  <img src="/logo.png" alt="SGN Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              {/* Title & Treemap Chart */}
              <div className="w-full">
                <h3 className="text-center text-xs font-bold text-[#1a5632] bg-emerald-50 py-1.5 px-3 rounded-lg mb-4 inline-block mx-auto w-auto">
                  {columns.provChartTitle}
                </h3>
                <div className="h-[250px] w-full border rounded-xl overflow-hidden shadow-inner bg-gray-50">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={stats.provinceData}
                        dataKey="count"
                        stroke="#fff"
                        content={<CustomizedTreemapContent />}
                      />
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-8 text-[10px] text-gray-400">
            <span>1/1</span>
            <span>SGN</span>
          </div>
        </div>
      </div>

      {/* ==================== PAGE 3 REPORT CARD ==================== */}
      <div className="bg-white rounded-3xl border shadow-md overflow-hidden p-6 relative group">
        <div className="flex justify-between items-center mb-4 no-print border-b pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">PAGE 3 REPORT</span>
          <button
            onClick={() => handlePrint("report-page-3", "SGN_Age_Demographics_Trend", "landscape")}
            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{columns.printReport}</span>
          </button>
        </div>

        <div id="report-page-3" className="bg-white print-page-content text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
            <span className="text-xs text-gray-500">{todayStr}</span>
            <span className="text-base font-extrabold tracking-widest text-gray-700">SGN</span>
            <span className="text-xs font-bold text-[#1a5632]">{columns.orgStats}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Table (Left column, scrollable on screen, full height on print) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="max-h-[480px] overflow-y-auto border border-gray-300 rounded-xl pr-1 print:max-h-none print:overflow-visible">
                <table className="min-w-full border-collapse border border-gray-300 text-center text-[10px]">
                  <thead className="sticky top-0 bg-white shadow-sm">
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-1.5 font-bold w-10">{columns.index}</th>
                      <th className="border border-gray-300 p-1.5 font-bold w-20">{columns.birthYear}</th>
                      <th className="border border-gray-300 p-1.5 font-bold">{columns.sum1}</th>
                      <th className="border border-gray-300 p-1.5 font-bold">{columns.sum5}</th>
                      <th className="border border-gray-300 p-1.5 font-bold">{columns.sum10}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {birthRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-1">{idx + 1}</td>
                        <td className="border border-gray-300 p-1 font-medium">{r.birthYear}</td>
                        <td className="border border-gray-300 p-1 font-bold">{r.count}</td>
                        
                        {r.rowSpan5 > 0 ? (
                          <td className="border border-gray-300 p-1 font-bold align-middle bg-[#f8fafc]" rowSpan={r.rowSpan5}>
                            {r.sum5}
                          </td>
                        ) : null}

                        {r.rowSpan10 > 0 ? (
                          <td className="border border-gray-300 p-1 font-bold align-middle bg-[#f1f5f9]" rowSpan={r.rowSpan10}>
                            {r.sum10}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logo and Chart (Right column) */}
            <div className="lg:col-span-6 flex flex-col items-center gap-6">
              {/* Logo */}
              <div className="flex justify-end w-full">
                <div className="relative w-20 h-20 border rounded-full p-1 bg-white shadow-sm shrink-0">
                  <img src="/logo.png" alt="SGN Logo" className="w-full h-full object-contain rounded-full" />
                </div>
              </div>

              {/* Title & Line Chart */}
              <div className="w-full">
                <h3 className="text-center text-xs font-bold text-[#1a5632] bg-emerald-50 py-1.5 px-3 rounded-lg mb-4 inline-block mx-auto w-auto">
                  {columns.birthChartTitle}
                </h3>
                <div className="h-[280px] w-full">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.birthYearData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="birthYear" stroke="#718096" tick={{ fontSize: 9 }} />
                        <YAxis stroke="#718096" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 1.5 }}
                          activeDot={{ r: 3.5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-8 text-[10px] text-gray-400">
            <span>1/1</span>
            <span>SGN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
