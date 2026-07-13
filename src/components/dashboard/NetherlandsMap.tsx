"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";

interface NetherlandsMapProps {
  data: { name: string; count: number }[];
}

const PROVINCES = [
  { id: "Groningen",     path: "M435,53l-4,10l-1,9l3,3l5,3l5-1l9,1l11-4l7,4l4,1l-2,4l1,5l5,2l5,11l7,4l-4,4l-1,7l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6L435,53z", x: 475, y: 80,  ar: "خرونينغن",   en: "Groningen",    nl: "Groningen" },
  { id: "Friesland",    path: "M368,141l-10-6l-12-1l-6-8l2-6l-5-4l4-1l1-3l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2l-15-5l-1-3l-12-1l2-7l-3-10l3-5l3-3l5,1l6,6l14,3l4,6l6-1l3,5l5,1l7,0l12-3l11-2l14,2l10,11l14,6l12,1l8,13l1,5l4,1l7-4l11,4L368,141z", x: 330, y: 110, ar: "فريزلاند",   en: "Friesland",   nl: "Friesland" },
  { id: "Drenthe",      path: "M435,160l-3,11l3,8l5,3l11,1l5,6l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l12-1l7,4l3-2l4,4l12-3l3-12l8-1l2-8l-3-5l6-3l1-7l-3-3l6-10l-10,0l2-8l-3-1l-2-9l-11,0l-5-4l-3-8l-10,0l-5-7l-12,0L435,160z", x: 485, y: 200, ar: "درينته",     en: "Drenthe",     nl: "Drenthe" },
  { id: "Overijssel",   path: "M403,248l-11-2l-5-7l-9,0l-10,6l-12,1l-8-5l-13,5l-12-3l-3,8l-11,0l1,12l-7,10l2,8l-4,5l3,12l-3,11l5,6l-1,10l12,5l8,0l3,11l10,3l6-2l11,4l8-4l10-1l1,8l10,2l5,11l12-1l7-10l2-4l-1-11l4-5l-2-12l10-2l2-10l-5-4l1-10l-4-5l1-10l-5-6l-11-1l-5-3l-3-8l3-11L403,248z", x: 450, y: 300, ar: "أوفرايسل",  en: "Overijssel",  nl: "Overijssel" },
  { id: "Flevoland",    path: "M328,197l12,3l13-5l8,5l12-1l10-6l9,0l5,7l11,2l3-11l-3-8l-3-12l-6-3l2-6l-4-5l4-13l-2-10l4-14l12-13l5,1l7-4l2-4l1-10l-13,1l-4,10l-10-3l-1,5l-6-1l-5,5l-7-1l-6,6l1,11l-4,11l4,8l-4,4l5,7l-3,8l5,3l-3,6L328,197z", x: 350, y: 220, ar: "فليفولاند",  en: "Flevoland",   nl: "Flevoland" },
  { id: "Gelderland",   path: "M386,346l-11-4l-6,2l-10-3l-3-11l-8,0l-12-5l1-10l-3-11l3-11l-3-12l4-5l-2-8l7-10l-1-12l-11-5l-5-1l-10,3l-1,10l-7,4l-11,0l-2,10l-11,2l-4-1l-1,5l-10,3l-5-3l-1,10l-12-1l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l7,4l-2,11l10,4l3-1l5,3l11-1l3,8l12,0l6,5l10-1l7,10l12-1l5,11l10-2l2,12l-4,5l1,11l-2,4l-7,10l-12,1l-5-11l-10,2l-1,8l-10,1l-8,4L386,346z", x: 380, y: 380, ar: "خيلدرلاند",  en: "Gelderland",  nl: "Gelderland" },
  { id: "Utrecht",      path: "M282,246l11-2l2-10l11,0l7-4l1-10l10-3l5,1l11,5l1,12l-7,10l2,8l-4,5l3,11l-1,10l-1,11l-8-3l-4,1l-8-3l-1-11l-8-3l1-7l-4-1l2-8l-6-5l3-5l-1-11l-5-3l3-12L282,246z", x: 300, y: 320, ar: "أوتريخت",   en: "Utrecht",     nl: "Utrecht" },
  { id: "Noord-Holland",path: "M229,267l10-3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,1l7-6l5-5l6,1l1-5l10,3l4-10l13-1l-12-2l-14,2l-11,2l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l-12,1l-1-3l-15,5l-11,2l0,10l-8,0l2-8l-6-4l-3-2l-11,2l-1-4l-5-2l-10,3l-4-3l-11,2l1-3l4-1l-5-4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l2-4l-1-10l-11,4l-4,1l-5,4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l-2-4l-1-10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l-5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l1,10l2,4l7-4l5,1l12-13l4-14l-2-10l4-13l-4-5l2-6l-6-3l3-4l5-1l13-11l13,11l4,2l-1,10l2,4l-1,7l-4,4l7,4l-1,10l-2,4l1,10l-4,2l-10-13L229,267z", x: 235, y: 190, ar: "شمال هولندا", en: "North Holland",nl: "Noord-Holland" },
  { id: "Zuid-Holland", path: "M229,267l10,3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,3l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l8,3l4-1l8,3l1,11l-11,4l-3,11l-12,0l-6,11l-10-3l-2,10l-11,0l1-11l-5-3l-3-11l-13,5l-8-5l-12,1l-10,6l-9,0L229,267z", x: 200, y: 320, ar: "جنوب هولندا", en: "South Holland",nl: "Zuid-Holland" },
  { id: "Zeeland",      path: "M163,401l13-5l3,11l5,3l-1,11l11,0l2-10l10,3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l-10,4l3,10l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2L163,401z", x: 100, y: 430, ar: "زيلاند",    en: "Zeeland",     nl: "Zeeland" },
  { id: "Noord-Brabant",path: "M271,412l11-4l1,11l8,3l4-1l8,3l1,11l11,4l10,1l7-10l12-1l7,10l12,1l5,11l10-2l-2,12l-10,2l2,11l1,10l-10,3l-1,11l-11,0l-2-10l-10-3l-6,11l-12,0l-3,11l-11,4l-3-11l-4-5l2-11l-10-4l2-11l-7-4l-1-11l-8-3l1-7L271,412z", x: 270, y: 460, ar: "شمال برابنت", en: "North Brabant",nl: "Noord-Brabant" },
  { id: "Limburg",      path: "M439,462l1,11l-4,5l2,12l-10,2l-2,10l5,4l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l-12,5l-13-5l-3-11l-5-3l1-11l-11,0l-2,10l-10-3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l10-2l-2-11l10-2l2-12l4-5l-1-11l4-5l-1-11L439,462z", x: 400, y: 560, ar: "ليمبورخ",   en: "Limburg",     nl: "Limburg" },
] as const;

// ─── Classification tiers ────────────────────────────────────────────────────
// 5 distinct color categories, each with a base + hover shade + label
const TIERS = [
  { id: 5, label: { ar: "كثافة عالية جداً", en: "Very High", nl: "Zeer Hoog" }, base: "#7c3aed", hover: "#9333ea", text: "#ffffff", badge: "bg-violet-600"  },
  { id: 4, label: { ar: "كثافة عالية",       en: "High",      nl: "Hoog"      }, base: "#0369a1", hover: "#0284c7", text: "#ffffff", badge: "bg-sky-700"     },
  { id: 3, label: { ar: "كثافة متوسطة",     en: "Medium",    nl: "Gemiddeld" }, base: "#15803d", hover: "#16a34a", text: "#ffffff", badge: "bg-emerald-700" },
  { id: 2, label: { ar: "كثافة منخفضة",     en: "Low",       nl: "Laag"      }, base: "#b45309", hover: "#d97706", text: "#ffffff", badge: "bg-amber-700"   },
  { id: 1, label: { ar: "كثافة منخفضة جداً", en: "Very Low",  nl: "Zeer Laag" }, base: "#be123c", hover: "#e11d48", text: "#ffffff", badge: "bg-rose-700"    },
  { id: 0, label: { ar: "لا يوجد بيانات",   en: "No Data",   nl: "Geen Data" }, base: "#334155", hover: "#475569", text: "#94a3b8", badge: "bg-slate-700"   },
] as const;

type TierDef = typeof TIERS[number];

/** Classify a province into tier 1-5 using natural quantile breaks */
function classifyProvince(count: number, sortedCounts: number[]): TierDef {
  if (count === 0 || sortedCounts.length === 0) return TIERS[5]; // id=0

  const max = sortedCounts[sortedCounts.length - 1];
  const ratio = count / max;

  if (ratio >= 0.7)  return TIERS[0]; // id=5 violet  – Very High
  if (ratio >= 0.4)  return TIERS[1]; // id=4 sky     – High
  if (ratio >= 0.2)  return TIERS[2]; // id=3 emerald – Medium
  if (ratio >= 0.08) return TIERS[3]; // id=2 amber   – Low
  return                     TIERS[4]; // id=1 rose    – Very Low
}

export default function NetherlandsMap({ data }: NetherlandsMapProps) {
  const locale = useLocale() as "ar" | "en" | "nl";
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Pre-compute sorted counts for classification
  const sortedCounts = useMemo(
    () => [...data.map((p) => p.count)].sort((a, b) => a - b),
    [data]
  );

  const getProvinceData = (id: string) =>
    data.find((p) => p.name.toLowerCase() === id.toLowerCase());

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left + 16, y: e.clientY - rect.top + 16 });
  };

  const activeP    = PROVINCES.find((p) => p.id === hovered);
  const activePData = hovered ? getProvinceData(hovered) : null;
  const activeTier  = activePData ? classifyProvince(activePData.count, sortedCounts) : null;
  const activeLabel = activeP ? (activeP[locale] || activeP.id) : "";

  // Build tier → { min, max } range for legend labels
  const tierRanges = useMemo(() => {
    const ranges: Record<number, { min: number; max: number }> = {};
    for (const p of data) {
      const tier = classifyProvince(p.count, sortedCounts);
      if (!ranges[tier.id]) ranges[tier.id] = { min: p.count, max: p.count };
      else {
        ranges[tier.id].min = Math.min(ranges[tier.id].min, p.count);
        ranges[tier.id].max = Math.max(ranges[tier.id].max, p.count);
      }
    }
    return ranges;
  }, [data, sortedCounts]);

  return (
    <div
      className="relative w-full h-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* ── SVG Map ── */}
      <div className="flex-1 flex items-center justify-center p-3 min-h-0">
        <svg
          viewBox="0 0 600 700"
          className="w-full h-full max-h-[360px] drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {PROVINCES.map((p) => {
            const pd      = getProvinceData(p.id);
            const count   = pd?.count ?? 0;
            const tier    = classifyProvince(count, sortedCounts);
            const isHover = hovered === p.id;
            const fill    = isHover ? tier.hover : tier.base;

            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <path
                  d={p.path}
                  fill={fill}
                  stroke={isHover ? "#ffffff" : "#1e293b"}
                  strokeWidth={isHover ? "3" : "1"}
                  strokeLinejoin="round"
                  style={{
                    transition: "all 0.25s ease",
                    transform: isHover ? "scale(1.012)" : "scale(1)",
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    filter: isHover ? "drop-shadow(0 6px 14px rgba(0,0,0,0.55))" : "none",
                  }}
                />
              </g>
            );
          })}

          {/* ── Number badges ── */}
          {PROVINCES.map((p) => {
            const pd    = getProvinceData(p.id);
            const count = pd?.count ?? 0;
            if (count === 0) return null;
            const tier    = classifyProvince(count, sortedCounts);
            const isHover = hovered === p.id;

            return (
              <g key={`lbl-${p.id}`} className="pointer-events-none">
                {isHover && (
                  <circle cx={p.x} cy={p.y - 4} r="28"
                    fill="#ffffff" opacity="0.12" className="animate-ping" />
                )}
                <rect
                  x={p.x - 22} y={p.y - 13}
                  width="44" height="22" rx="7"
                  fill={tier.base} opacity={isHover ? "1" : "0.92"}
                  stroke="#ffffff" strokeWidth="1.2"
                />
                <text
                  x={p.x} y={p.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#ffffff" fontSize="11" fontWeight="900"
                >
                  {count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center gap-2 px-4 pb-4 pt-1">
        {TIERS.filter((t) => t.id > 0).map((tier) => {
          const range = tierRanges[tier.id];
          return (
            <div key={tier.id} className="flex items-center gap-1.5 bg-slate-800/70 rounded-lg px-2.5 py-1.5">
              <span
                className="inline-block w-3.5 h-3.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: tier.base }}
              />
              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">
                {tier.label[locale]}
                {range ? ` (${range.min}–${range.max})` : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Floating Tooltip ── */}
      {hovered && activePData && activeTier && (
        <div
          style={{ position: "absolute", left: tooltipPos.x, top: tooltipPos.y }}
          className="pointer-events-none z-50 backdrop-blur-md border border-white/15 text-white rounded-2xl py-2.5 px-4 shadow-2xl"
          style={{
            position: "absolute",
            left: tooltipPos.x,
            top: tooltipPos.y,
            backgroundColor: activeTier.base + "ee",
          }}
        >
          <p className="text-sm font-black tracking-wide leading-tight">{activeLabel}</p>
          <p className="text-[11px] font-semibold text-white/80 mt-0.5">
            {activeTier.label[locale]}
          </p>
          <p className="text-xl font-black mt-1">
            {activePData.count}
            <span className="text-xs font-semibold ms-1 text-white/70">
              {locale === "ar" ? "عضو" : locale === "nl" ? "leden" : "members"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
