"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";

interface NetherlandsMapProps {
  data: { name: string; count: number }[];
  /** Extra tailwind classes applied to the outer SVG wrapper div */
  mapClassName?: string;
}

const PROVINCES = [
  { id: "Groningen",      path: "M435,53l-4,10l-1,9l3,3l5,3l5-1l9,1l11-4l7,4l4,1l-2,4l1,5l5,2l5,11l7,4l-4,4l-1,7l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6L435,53z", x: 475, y: 80,  ar: "خرونينغن",    en: "Groningen",     nl: "Groningen" },
  { id: "Friesland",      path: "M368,141l-10-6l-12-1l-6-8l2-6l-5-4l4-1l1-3l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2l-15-5l-1-3l-12-1l2-7l-3-10l3-5l3-3l5,1l6,6l14,3l4,6l6-1l3,5l5,1l7,0l12-3l11-2l14,2l10,11l14,6l12,1l8,13l1,5l4,1l7-4l11,4l-9-1l-5,1l-5-3l-3-3l1-9l4-10l-4-10l-5-11l-5-2l-1-5l2-4l-4-1l-7-4l-11,4l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l12,1l1,3l15,5l11,2l0,10l8,0l-2,8l6,4l3,2l11-2l1,4l5,2l10-3l4,3l11-2l-1,3l-4,1l5,4l-2,6l6,8l12,1l10,6L368,141z", x: 330, y: 110, ar: "فريزلاند",    en: "Friesland",     nl: "Friesland" },
  { id: "Drenthe",        path: "M435,160l-3,11l3,8l5,3l11,1l5,6l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l12-1l7,4l3-2l4,4l12-3l3-12l8-1l2-8l-3-5l6-3l1-7l-3-3l6-10l-10,0l2-8l-3-1l-2-9l-11,0l-5-4l-3-8l-10,0l-5-7l-12,0L435,160z", x: 485, y: 200, ar: "درينته",      en: "Drenthe",       nl: "Drenthe" },
  { id: "Overijssel",     path: "M403,248l-11-2l-5-7l-9,0l-10,6l-12,1l-8-5l-13,5l-12-3l-3,8l-11,0l1,12l-7,10l2,8l-4,5l3,12l-3,11l5,6l-1,10l12,5l8,0l3,11l10,3l6-2l11,4l8-4l10-1l1,8l10,2l5,11l12-1l7-10l2-4l-1-11l4-5l-2-12l10-2l2-10l-5-4l1-10l-4-5l1-10l-5-6l-11-1l-5-3l-3-8l3-11L403,248z", x: 450, y: 300, ar: "أوفرايسل",   en: "Overijssel",    nl: "Overijssel" },
  { id: "Flevoland",      path: "M328,197l12,3l13-5l8,5l12-1l10-6l9,0l5,7l11,2l3-11l-3-8l-3-12l-6-3l2-6l-4-5l4-13l-2-10l4-14l12-13l5,1l7-4l2-4l1-10l-13,1l-4,10l-10-3l-1,5l-6-1l-5,5l-7-1l-6,6l1,11l-4,11l4,8l-4,4l5,7l-3,8l5,3l-3,6L328,197z", x: 350, y: 220, ar: "فليفولاند",   en: "Flevoland",     nl: "Flevoland" },
  { id: "Gelderland",     path: "M386,346l-11-4l-6,2l-10-3l-3-11l-8,0l-12-5l1-10l-3-11l3-11l-3-12l4-5l-2-8l7-10l-1-12l-11-5l-5-1l-10,3l-1,10l-7,4l-11,0l-2,10l-11,2l-4-1l-1,5l-10,3l-5-3l-1,10l-12-1l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l7,4l-2,11l10,4l3-1l5,3l11-1l3,8l12,0l6,5l10-1l7,10l12-1l5,11l10-2l2,12l-4,5l1,11l-2,4l-7,10l-12,1l-5-11l-10,2l-1,8l-10,1l-8,4L386,346z", x: 380, y: 380, ar: "خيلدرلاند",   en: "Gelderland",    nl: "Gelderland" },
  { id: "Utrecht",        path: "M282,246l11-2l2-10l11,0l7-4l1-10l10-3l5,1l11,5l1,12l-7,10l2,8l-4,5l3,11l-1,10l-1,11l-8-3l-4,1l-8-3l-1-11l-8-3l1-7l-4-1l2-8l-6-5l3-5l-1-11l-5-3l3-12L282,246z", x: 300, y: 320, ar: "أوتريخت",    en: "Utrecht",       nl: "Utrecht" },
  { id: "Noord-Holland",  path: "M229,267l10-3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,1l7-6l5-5l6,1l1-5l10,3l4-10l13-1l-12-2l-14,2l-11,2l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l-12,1l-1-3l-15,5l-11,2l0,10l-8,0l2-8l-6-4l-3-2l-11,2l-1-4l-5-2l-10,3l-4-3l-11,2l1-3l4-1l-5-4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l2-4l-1-10l-11,4l-4,1l-5,4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l-2-4l-1-10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l-5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l1,10l2,4l7-4l5,1l12-13l4-14l-2-10l4-13l-4-5l2-6l-6-3l3-4l5-1l13-11l13,11l4,2l-1,10l2,4l-1,7l-4,4l7,4l-1,10l-2,4l1,10l-4,2l-10-13L229,267z", x: 235, y: 190, ar: "شمال هولندا",  en: "North Holland",  nl: "Noord-Holland" },
  { id: "Zuid-Holland",   path: "M229,267l10,3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,3l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l8,3l4-1l8,3l1,11l-11,4l-3,11l-12,0l-6,11l-10-3l-2,10l-11,0l1-11l-5-3l-3-11l-13,5l-8-5l-12,1l-10,6l-9,0L229,267z", x: 200, y: 320, ar: "جنوب هولندا",  en: "South Holland",  nl: "Zuid-Holland" },
  { id: "Zeeland",        path: "M163,401l13-5l3,11l5,3l-1,11l11,0l2-10l10,3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l-10,4l3,10l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2L163,401z", x: 100, y: 430, ar: "زيلاند",     en: "Zeeland",       nl: "Zeeland" },
  { id: "Noord-Brabant",  path: "M271,412l11-4l1,11l8,3l4-1l8,3l1,11l11,4l10,1l7-10l12-1l7,10l12,1l5,11l10-2l-2,12l-10,2l2,11l1,10l-10,3l-1,11l-11,0l-2-10l-10-3l-6,11l-12,0l-3,11l-11,4l-3-11l-4-5l2-11l-10-4l2-11l-7-4l-1-11l-8-3l1-7L271,412z", x: 270, y: 460, ar: "شمال برابنت", en: "North Brabant",  nl: "Noord-Brabant" },
  { id: "Limburg",        path: "M439,462l1,11l-4,5l2,12l-10,2l-2,10l5,4l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l-12,5l-13-5l-3-11l-5-3l1-11l-11,0l-2,10l-10-3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l10-2l-2-11l10-2l2-12l4-5l-1-11l4-5l-1-11L439,462z", x: 400, y: 560, ar: "ليمبورخ",    en: "Limburg",       nl: "Limburg" },
];

// ── Classification tiers: 5 distinct colors ──────────────────────────────────
const TIERS = [
  { id: 5, base: "#6d28d9", hover: "#7c3aed", ring: "#a78bfa", label: { ar: "كثافة عالية جداً", en: "Very High", nl: "Zeer Hoog" } },
  { id: 4, base: "#0369a1", hover: "#0284c7", ring: "#38bdf8", label: { ar: "كثافة عالية",       en: "High",      nl: "Hoog"      } },
  { id: 3, base: "#166534", hover: "#15803d", ring: "#4ade80", label: { ar: "كثافة متوسطة",     en: "Medium",    nl: "Gemiddeld" } },
  { id: 2, base: "#92400e", hover: "#b45309", ring: "#fbbf24", label: { ar: "كثافة منخفضة",     en: "Low",       nl: "Laag"      } },
  { id: 1, base: "#9f1239", hover: "#be123c", ring: "#fb7185", label: { ar: "كثافة منخفضة جداً", en: "Very Low",  nl: "Zeer Laag" } },
  { id: 0, base: "#334155", hover: "#475569", ring: "#94a3b8", label: { ar: "لا يوجد",          en: "No Data",   nl: "Geen Data" } },
] as const;

type Tier = typeof TIERS[number];

function getTier(count: number, max: number): Tier {
  if (count === 0 || max === 0) return TIERS[5];
  const r = count / max;
  if (r >= 0.7)  return TIERS[0];
  if (r >= 0.4)  return TIERS[1];
  if (r >= 0.2)  return TIERS[2];
  if (r >= 0.08) return TIERS[3];
  return                 TIERS[4];
}

export default function NetherlandsMap({ data, mapClassName = "max-h-[400px]" }: NetherlandsMapProps) {
  const locale = useLocale() as "ar" | "en" | "nl";
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const total   = useMemo(() => data.reduce((s, p) => s + p.count, 0), [data]);
  const max     = useMemo(() => Math.max(...data.map((p) => p.count), 1),    [data]);

  const byId = useMemo(() => {
    const m: Record<string, number> = {};
    data.forEach((p) => { m[p.name] = p.count; });
    return m;
  }, [data]);

  const count = (id: string) => byId[id] ?? 0;
  const pct   = (n: number)  => total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - r.left + 16, y: e.clientY - r.top + 16 });
  };

  // Build legend: tier ranges from actual data
  const tierRanges = useMemo(() => {
    const ranges: Record<number, { min: number; max: number }> = {};
    data.forEach((p) => {
      const t = getTier(p.count, max);
      if (!ranges[t.id]) ranges[t.id] = { min: p.count, max: p.count };
      else {
        ranges[t.id].min = Math.min(ranges[t.id].min, p.count);
        ranges[t.id].max = Math.max(ranges[t.id].max, p.count);
      }
    });
    return ranges;
  }, [data, max]);

  const activeProvince = PROVINCES.find((p) => p.id === hovered);
  const activeCount    = hovered ? count(hovered) : 0;
  const activePct      = pct(activeCount);
  const activeTier     = getTier(activeCount, max);

  return (
    <div
      className="relative w-full h-full flex flex-col bg-slate-950 rounded-3xl overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* ── Map ── */}
      <div className={`flex-1 flex items-center justify-center p-3 min-h-0 ${mapClassName}`}>
        <svg
          viewBox="0 0 600 700"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {PROVINCES.map((p) => {
            const c       = count(p.id);
            const tier    = getTier(c, max);
            const isHov   = hovered === p.id;
            // ▶ fill & filter fully inside style so CSS transitions pick them up
            return (
              <g
                key={p.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <path
                  d={p.path}
                  strokeLinejoin="round"
                  style={{
                    fill:         isHov ? tier.hover : tier.base,
                    stroke:       isHov ? tier.ring  : "#0f172a",
                    strokeWidth:  isHov ? 3 : 1,
                    filter:       isHov
                      ? `drop-shadow(0 0 10px ${tier.ring}99)`
                      : "none",
                    transform:    isHov ? "scale(1.012)" : "scale(1)",
                    transformBox:    "fill-box",
                    transformOrigin: "center",
                    transition:   "fill 0.2s ease, stroke 0.2s ease, filter 0.2s ease, transform 0.2s ease",
                  }}
                />
              </g>
            );
          })}

          {/* ── Count + % badges ── */}
          {PROVINCES.map((p) => {
            const c    = count(p.id);
            if (c === 0) return null;
            const tier = getTier(c, max);
            const isHov= hovered === p.id;
            const pctVal = pct(c);

            return (
              <g key={`lbl-${p.id}`} style={{ pointerEvents: "none" }}>
                {/* Glow ring on hover */}
                {isHov && (
                  <circle
                    cx={p.x} cy={p.y - 2} r="26"
                    fill={tier.ring} opacity="0.18"
                    style={{ animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }}
                  />
                )}
                {/* Badge background */}
                <rect
                  x={p.x - 24} y={p.y - 20}
                  width="48" height="34" rx="8"
                  style={{
                    fill:    isHov ? tier.hover : tier.base,
                    stroke:  tier.ring,
                    strokeWidth: isHov ? 1.5 : 0.8,
                    opacity: isHov ? 1 : 0.9,
                    transition: "fill 0.2s ease",
                  }}
                />
                {/* Count number */}
                <text
                  x={p.x} y={p.y - 8}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#ffffff" fontSize="11" fontWeight="900"
                >
                  {c}
                </text>
                {/* Percentage */}
                <text
                  x={p.x} y={p.y + 8}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={tier.ring} fontSize="8.5" fontWeight="700"
                >
                  {pctVal}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap justify-center gap-2 px-4 pb-4 pt-0">
        {TIERS.filter((t) => t.id > 0 && tierRanges[t.id]).map((tier) => {
          const rng = tierRanges[tier.id];
          const pMin = pct(rng.min);
          const pMax = pct(rng.max);
          return (
            <div
              key={tier.id}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: tier.base + "33", border: `1px solid ${tier.base}66` }}
            >
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: tier.base }}
              />
              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap">
                {tier.label[locale]}
                {rng && (
                  <span className="text-slate-400 font-normal ms-1">
                    ({rng.min}–{rng.max} · {pMin}–{pMax}%)
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Tooltip ── */}
      {hovered && activeCount > 0 && activeProvince && (
        <div
          style={{
            position:        "absolute",
            left:            tooltipPos.x,
            top:             tooltipPos.y,
            backgroundColor: activeTier.base + "f2",
            borderColor:     activeTier.ring + "66",
            pointerEvents:   "none",
            zIndex:          50,
          }}
          className="backdrop-blur-md border rounded-2xl py-3 px-4 shadow-2xl min-w-[140px]"
        >
          {/* Province name */}
          <p className="text-sm font-black text-white leading-tight">
            {activeProvince[locale]}
          </p>
          {/* Tier label badge */}
          <div
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 mt-1 mb-2"
            style={{ backgroundColor: activeTier.ring + "33" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeTier.ring }}
            />
            <span className="text-[10px] font-bold" style={{ color: activeTier.ring }}>
              {activeTier.label[locale]}
            </span>
          </div>
          {/* Stats row */}
          <div className="flex items-end gap-3">
            <div>
              <p className="text-[10px] text-white/60 font-medium">
                {locale === "ar" ? "العدد" : locale === "nl" ? "Aantal" : "Count"}
              </p>
              <p className="text-2xl font-black text-white leading-none">{activeCount}</p>
            </div>
            <div className="pb-0.5">
              <p className="text-[10px] text-white/60 font-medium">
                {locale === "ar" ? "النسبة" : locale === "nl" ? "Aandeel" : "Share"}
              </p>
              <p className="text-xl font-black leading-none" style={{ color: activeTier.ring }}>
                {activePct}%
              </p>
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width:           `${activePct}%`,
                backgroundColor: activeTier.ring,
              }}
            />
          </div>
          <p className="text-[9px] text-white/40 mt-1">
            {locale === "ar" ? `من إجمالي ${total} عضو` : locale === "nl" ? `van ${total} leden` : `of ${total} members`}
          </p>
        </div>
      )}
    </div>
  );
}
