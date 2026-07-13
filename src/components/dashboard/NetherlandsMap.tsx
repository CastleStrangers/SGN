"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

interface NetherlandsMapProps {
  data: { name: string; count: number }[];
}

const PROVINCES = [
  { id: "Groningen", name: "Groningen", path: "M435,53l-4,10l-1,9l3,3l5,3l5-1l9,1l11-4l7,4l4,1l-2,4l1,5l5,2l5,11l7,4l-4,4l-1,7l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6L435,53z", x: 475, y: 80, ar: "خرونينغن", en: "Groningen", nl: "Groningen" },
  { id: "Friesland", name: "Friesland", path: "M368,141l-10-6l-12-1l-6-8l2-6l-5-4l4-1l1-3l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2l-15-5l-1-3l-12-1l2-7l-3-10l3-5l3-3l5,1l6,6l14,3l4,6l6-1l3,5l5,1l7,0l12-3l11-2l14,2l10,11l14,6l12,1l8,13l1,5l4,1l7-4l11,4l-9-1l-5,1l-5-3l-3-3l1-9l4-10l-4-10l-5-11l-5-2l-1-5l2-4l-4-1l-7-4l-11,4l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l12,1l1,3l15,5l11,2l0,10l8,0l-2,8l6,4l3,2l11-2l1,4l5,2l10-3l4,3l11-2l-1,3l-4,1l5,4l-2,6l6,8l12,1l10,6l-1,10l-2,4l-7,4l-5-1l-12,13l-4,14l2,10l-4,13l4,5l-2,6l6,3l-3,4l-5,1l-13,11l-10-13l-4-2l1-10l-2-4l-1,10l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l-1,10l-2,4l-7,4l-5-1l-12,13l-4,14l2,10l-4,13l4,5l-2,6l6,3l-3,4l-5,1l-13,11l-13-11l-4-2l1-10l-2-4l1-7l4-4l-7-4l-5-11l-5-2l-1-5l2-4l-4-1l-7-4l-11,4l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l12,1l1,3l15,5l11,2l0,10l8,0l-2,8l6,4l3,2l11-2l1,4l5,2l10-3l4,3l11-2l-1,3l-4,1l5,4l-2,6l6,8l12,1l10,6L368,141z", x: 330, y: 110, ar: "فريزلاند", en: "Friesland", nl: "Friesland" },
  { id: "Drenthe", name: "Drenthe", path: "M435,160l-3,11l3,8l5,3l11,1l5,6l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l12-1l7,4l3-2l4,4l12-3l3-12l8-1l2-8l-3-5l6-3l1-7l-3-3l6-10l-10,0l2-8l-3-1l-2-9l-11,0l-5-4l-3-8l-10,0l-5-7l-12,0L435,160z", x: 485, y: 200, ar: "درينته", en: "Drenthe", nl: "Drenthe" },
  { id: "Overijssel", name: "Overijssel", path: "M403,248l-11-2l-5-7l-9,0l-10,6l-12,1l-8-5l-13,5l-12-3l-3,8l-11,0l1,12l-7,10l2,8l-4,5l3,12l-3,11l5,6l-1,10l12,5l8,0l3,11l10,3l6-2l11,4l8-4l10-1l1,8l10,2l5,11l12-1l7-10l2-4l-1-11l4-5l-2-12l10-2l2-10l-5-4l1-10l-4-5l1-10l-5-6l-11-1l-5-3l-3-8l3-11L403,248z", x: 450, y: 300, ar: "أوفرايسل", en: "Overijssel", nl: "Overijssel" },
  { id: "Flevoland", name: "Flevoland", path: "M328,197l12,3l13-5l8,5l12-1l10-6l9,0l5,7l11,2l3-11l-3-8l-3-12l-6-3l2-6l-4-5l4-13l-2-10l4-14l12-13l5,1l7-4l2-4l1-10l-13,1l-4,10l-10-3l-1,5l-6-1l-5,5l-7-1l-6,6l1,11l-4,11l4,8l-4,4l5,7l-3,8l5,3l-3,6L328,197z", x: 350, y: 220, ar: "فليفولاند", en: "Flevoland", nl: "Flevoland" },
  { id: "Gelderland", name: "Gelderland", path: "M386,346l-11-4l-6,2l-10-3l-3-11l-8,0l-12-5l1-10l-3-11l3-11l-3-12l4-5l-2-8l7-10l-1-12l-11-5l-5-1l-10,3l-1,10l-7,4l-11,0l-2,10l-11,2l-4-1l-1,5l-10,3l-5-3l-1,10l-12-1l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l7,4l-2,11l10,4l3-1l5,3l11-1l3,8l12,0l6,5l10-1l7,10l12-1l5,11l10-2l2,12l-4,5l1,11l-2,4l-7,10l-12,1l-5-11l-10,2l-1,8l-10,1l-8,4L386,346z", x: 380, y: 380, ar: "خيلدرلاند", en: "Gelderland", nl: "Gelderland" },
  { id: "Utrecht", name: "Utrecht", path: "M282,246l11-2l2-10l11,0l7-4l1-10l10-3l5,1l11,5l1,12l-7,10l2,8l-4,5l3,11l-1,10l-1,11l-8-3l-4,1l-8-3l-1-11l-8-3l1-7l-4-1l2-8l-6-5l3-5l-1-11l-5-3l3-12L282,246z", x: 300, y: 320, ar: "أوتريخت", en: "Utrecht", nl: "Utrecht" },
  { id: "Noord-Holland", name: "Noord-Holland", path: "M229,267l10-3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,1l7-6l5-5l6,1l1-5l10,3l4-10l13-1l-12-2l-14,2l-11,2l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l-12,1l-1-3l-15,5l-11,2l0,10l-8,0l2-8l-6-4l-3-2l-11,2l-1-4l-5-2l-10,3l-4-3l-11,2l1-3l4-1l-5-4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l2-4l-1-10l-11,4l-4,1l-5,4l-2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l-2-4l-1-10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l-5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l1,10l2,4l7-4l5,1l12-13l4-14l-2-10l4-13l-4-5l2-6l-6-3l3-4l5-1l13-11l13,11l4,2l-1,10l2,4l-1,7l-4,4l7,4l-1,10l-2,4l1,10l-4,2l-10-13L229,267z", x: 235, y: 190, ar: "شمال هولندا", en: "North Holland", nl: "Noord-Holland" },
  { id: "Zuid-Holland", name: "Zuid-Holland", path: "M229,267l10,3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,3l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l8,3l4-1l8,3l1,11l-11,4l-3,11l-12,0l-6,11l-10-3l-2,10l-11,0l1-11l-5-3l-3-11l-13,5l-8-5l-12,1l-10,6l-9,0L229,267z", x: 200, y: 320, ar: "جنوب هولندا", en: "South Holland", nl: "Zuid-Holland" },
  { id: "Zeeland", name: "Zeeland", path: "M163,401l13-5l3,11l5,3l-1,11l11,0l2-10l10,3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l-10,4l3,10l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2L163,401z", x: 100, y: 430, ar: "زيلاند", en: "Zeeland", nl: "Zeeland" },
  { id: "Noord-Brabant", name: "Noord-Brabant", path: "M271,412l11-4l1,11l8,3l4-1l8,3l1,11l11,4l10,1l7-10l12-1l7,10l12,1l5,11l10-2l-2,12l-10,2l2,11l1,10l-10,3l-1,11l-11,0l-2-10l-10-3l-6,11l-12,0l-3,11l-11,4l-3-11l-4-5l2-11l-10-4l2-11l-7-4l-1-11l-8-3l1-7L271,412z", x: 270, y: 460, ar: "شمال برابنت", en: "North Brabant", nl: "Noord-Brabant" },
  { id: "Limburg", name: "Limburg", path: "M439,462l1,11l-4,5l2,12l-10,2l-2,10l5,4l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l-12,5l-13-5l-3-11l-5-3l1-11l-11,0l-2,10l-10-3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l10-2l-2-11l10-2l2-12l4-5l-1-11l4-5l-1-11L439,462z", x: 400, y: 560, ar: "ليمبورخ", en: "Limburg", nl: "Limburg" },
];

export default function NetherlandsMap({ data }: NetherlandsMapProps) {
  const locale = useLocale();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getProvinceCount = (name: string) => {
    const item = data.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return item ? item.count : 0;
  };

  const maxCount = Math.max(...data.map((p) => p.count), 1);

  // Gradient color coding (monochromatic dark green theme matching SGN)
  const getProvinceColor = (name: string, isHovered: boolean) => {
    const count = getProvinceCount(name);
    if (count === 0) return "#f1f5f9"; // slate-100
    const ratio = count / maxCount;
    
    // Emerald scale
    let color = "#e6f4ea"; // default light green
    if (ratio > 0.8) color = "#166534"; // emerald-800
    else if (ratio > 0.5) color = "#15803d"; // emerald-700
    else if (ratio > 0.3) color = "#16a34a"; // emerald-600
    else if (ratio > 0.15) color = "#22c55e"; // emerald-500
    else if (ratio > 0.05) color = "#4ade80"; // emerald-400
    else color = "#86efac"; // emerald-300

    if (isHovered) {
      // Lighten or saturate on hover
      return color === "#166534" ? "#1e8247" : color === "#15803d" ? "#1d9b4c" : "#2be06b";
    }
    return color;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15
    });
  };

  const activeProvince = PROVINCES.find((p) => p.id === hovered);
  const activeProvinceLabel = activeProvince ? (activeProvince[locale as "ar" | "en" | "nl"] || activeProvince.name) : "";
  const activeProvinceCount = hovered ? getProvinceCount(hovered) : 0;

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center p-2 bg-slate-900 rounded-3xl overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      <svg
        viewBox="0 0 600 700"
        className="w-full h-full max-h-[350px] drop-shadow-2xl transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {PROVINCES.map((p) => {
          const isHovered = hovered === p.id;
          const fill = getProvinceColor(p.id, isHovered);

          return (
            <g
              key={p.id}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <path
                d={p.path}
                fill={fill}
                stroke="#ffffff"
                strokeWidth={isHovered ? "3.0" : "1.5"}
                strokeLinejoin="round"
                className="transition-all duration-300 origin-center [transform-box:fill-box]"
                style={{
                  transform: isHovered ? "scale(1.015)" : "scale(1)",
                  filter: isHovered ? "drop-shadow(0px 8px 16px rgba(0,0,0,0.5))" : "none",
                }}
              />
            </g>
          );
        })}

        {/* Text Labels overlaid on the map */}
        {PROVINCES.map((p) => {
          const count = getProvinceCount(p.id);
          if (count === 0) return null;
          const isHovered = hovered === p.id;

          return (
            <g key={p.id} className="pointer-events-none">
              {/* Pulse circle for hovered active province */}
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y - 4}
                  r="30"
                  fill="#ffffff"
                  opacity="0.15"
                  className="animate-ping"
                />
              )}
              {/* Text background bubble */}
              <rect
                x={p.x - 22}
                y={p.y - 14}
                width="44"
                height="22"
                rx="6"
                fill="#000000"
                opacity={isHovered ? "0.85" : "0.65"}
              />
              {/* Count Text */}
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="900"
              >
                {count}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Glassmorphic Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
          className="pointer-events-none z-50 bg-black/85 backdrop-blur-md border border-white/20 text-white rounded-2xl py-2.5 px-4 shadow-2xl flex flex-col gap-0.5 text-right font-sans"
        >
          <span className="text-sm font-black tracking-wide text-emerald-400">
            {activeProvinceLabel}
          </span>
          <span className="text-xs text-gray-300 font-bold">
            {locale === "ar" ? "العدد:" : locale === "nl" ? "Aantal:" : "Count:"} <strong className="text-base text-white font-black">{activeProvinceCount}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
