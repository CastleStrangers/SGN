"use client";

import React from "react";

const PROVINCES = [
  { id: "Groningen", name: "Groningen", path: "M435,53l-4,10l-1,9l3,3l5,3l5-1l9,1l11-4l7,4l4,1l-2,4l1,5l5,2l5,11l7,4l-4,4l-1,7l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6L435,53z" },
  { id: "Friesland", name: "Friesland", path: "M368,141l-10-6l-12-1l-6-8l2-6l-5-4l4-1l1-3l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2l-15-5l-1-3l-12-1l2-7l-3-10l3-5l3-3l5,1l6,6l14,3l4,6l6-1l3,5l5,1l7,0l12-3l11-2l14,2l10,11l14,6l12,1l8,13l1,5l4,1l7-4l11,4l-9-1l-5,1l-5-3l-3-3l1-9l4-10l-4-10l-5-11l-5-2l-1-5l2-4l-4-1l-7-4l-11,4l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l12,1l1,3l15,5l11,2l0,10l8,0l-2,8l6,4l3,2l11-2l1,4l5,2l10-3l4,3l11-2l-1,3l-4,1l5,4l-2,6l6,8l12,1l10,6l-1,10l-2,4l-7,4l-5-1l-12,13l-4,14l2,10l-4,13l4,5l-2,6l6,3l-3,4l-5,1l-13,11l-10-13l-4-2l1-10l-2-4l1-7l4-4l-7-4l1,10l2,4l-1,10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l-1,10l-2,4l-7,4l-5-1l-12,13l-4,14l2,10l-4,13l4,5l-2,6l6,3l-3,4l-5,1l-13,11l-13-11l-4-2l1-10l-2-4l1-7l4-4l-7-4l-5-11l-5-2l-1-5l2-4l-4-1l-7-4l-11,4l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l12,1l1,3l15,5l11,2l0,10l8,0l-2,8l6,4l3,2l11-2l1,4l5,2l10-3l4,3l11-2l-1,3l-4,1l5,4l-2,6l6,8l12,1l10,6L368,141z" },
  { id: "Drenthe", name: "Drenthe", path: "M435,160l-3,11l3,8l5,3l11,1l5,6l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l12-1l7,4l3-2l4,4l12-3l3-12l8-1l2-8l-3-5l6-3l1-7l-3-3l6-10l-10,0l2-8l-3-1l-2-9l-11,0l-5-4l-3-8l-10,0l-5-7l-12,0L435,160z" },
  { id: "Overijssel", name: "Overijssel", path: "M403,248l-11-2l-5-7l-9,0l-10,6l-12,1l-8-5l-13,5l-12-3l-3,8l-11,0l1,12l-7,10l2,8l-4,5l3,12l-3,11l5,6l-1,10l12,5l8,0l3,11l10,3l6-2l11,4l8-4l10-1l1,8l10,2l5,11l12-1l7-10l2-4l-1-11l4-5l-2-12l10-2l2-10l-5-4l1-10l-4-5l1-10l-5-6l-11-1l-5-3l-3-8l3-11L403,248z" },
  { id: "Flevoland", name: "Flevoland", path: "M328,197l12,3l13-5l8,5l12-1l10-6l9,0l5,7l11,2l3-11l-3-8l-3-12l-6-3l2-6l-4-5l4-13l-2-10l4-14l12-13l5,1l7-4l2-4l1-10l-13,1l-4,10l-10-3l-1,5l-6-1l-5,5l-7-1l-6,6l1,11l-4,11l4,8l-4,4l5,7l-3,8l5,3l-3,6L328,197z" },
  { id: "Gelderland", name: "Gelderland", path: "M386,346l-11-4l-6,2l-10-3l-3-11l-8,0l-12-5l1-10l-3-11l3-11l-3-12l4-5l-2-8l7-10l-1-12l-11-5l-5-1l-10,3l-1,10l-7,4l-11,0l-2,10l-11,2l-4-1l-1,5l-10,3l-5-3l-1,10l-12-1l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l7,4l-2,11l10,4l3-1l5,3l11-1l3,8l12,0l6,5l10-1l7,10l12-1l5,11l10-2l2,12l-4,5l1,11l-2,4l-7,10l-12,1l-5-11l-10,2l-1,8l-10,1l-8,4L386,346z" },
  { id: "Utrecht", name: "Utrecht", path: "M282,246l11-2l2-10l11,0l7-4l1-10l10-3l5,1l11,5l1,12l-7,10l2,8l-4,5l3,11l-1,10l-1,11l-8-3l-4,1l-8-3l-1-11l-8-3l1-7l-4-1l2-8l-6-5l3-5l-1-11l-5-3l3-12L282,246z" },
  { id: "Noord-Holland", name: "Noord-Holland", path: "M229,267l10-3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,1l7-6l5-5l6,1l1-5l10,3l4-10l13-1l-12-2l-14,2l-11,2l-12,3l-7,0l-5-1l-3-5l-6,1l-4-6l-14-3l-6-6l-5-1l-3,3l-3,5l3,10l-2,7l-12,1l-1-3l-15,5l-11,2l0,10l-8,0l2-8l-6-4l-3-2l-11,2l-1-4l-5-2l-10,3l-4-3l-11,2l1-3l4-1l-5-4l2-6l-6-8l-12-1l-10-6l1,10l2,4l7-4l2-4l-1-10l-11,4l-4,1l-5,4l2,6l-6,8l-12-1l-10-6l1,10l2,4l7-4l2-4l-1-10l4,2l10,13l13-11l5-1l-3-4l6-3l4-7l-1-7l10-10l-6-6l4-11l-3-11l5-11l-8-12l-14-11l-14-6l-10-8l-25-3l-13,6l1,10l2,4l7-4l5,1l12-13l4-14l-2-10l4-13l-4-5l2-6l-6-3l3-4l5-1l13-11l13,11l4,2l-1,10l2,4l-1,7l-4,4l7,4l-1,10l-2,4l1,10l-4,2l-10-13L229,267z" },
  { id: "Zuid-Holland", name: "Zuid-Holland", path: "M229,267l10,3l1-5l4,1l11-2l2-10l11,0l7-4l1-10l10-3l5,3l-3,12l5,3l1,11l-3,5l6,5l-2,8l4,1l-1,7l8,3l1,11l8,3l4-1l8,3l1,11l-11,4l-3,11l-12,0l-6,11l-10-3l-2,10l-11,0l1-11l-5-3l-3-11l-13,5l-8-5l-12,1l-10,6l-9,0L229,267z" },
  { id: "Zeeland", name: "Zeeland", path: "M163,401l13-5l3,11l5,3l-1,11l11,0l2-10l10,3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l-10,4l3,10l-11,2l-4-3l-10,3l-5-2l-1-4l-11,2l-3-2l-6-4l2-8l-8,0l0-10l-11-2L163,401z" },
  { id: "Noord-Brabant", name: "Noord-Brabant", path: "M271,412l11-4l1,11l8,3l4-1l8,3l1,11l11,4l10,1l7-10l12-1l7,10l12,1l5,11l10-2l-2,12l-10,2l2,11l1,10l-10,3l-1,11l-11,0l-2-10l-10-3l-6,11l-12,0l-3,11l-11,4l-3-11l-4-5l2-11l-10-4l2-11l-7-4l-1-11l-8-3l1-7L271,412z" },
  { id: "Limburg", name: "Limburg", path: "M439,462l1,11l-4,5l2,12l-10,2l-2,10l5,4l-1,10l4,5l-1,10l5,4l2,10l7,1l3-1l4,8l-12,5l-13-5l-3-11l-5-3l1-11l-11,0l-2,10l-10-3l6-11l12,0l3-11l11-4l3,11l4,5l-2,11l10-2l-2-11l10-2l2-12l4-5l-1-11l4-5l-1-11L439,462z" },
];

interface NLMapProps {
  selectedProvince: string;
  onProvinceSelect: (id: string) => void;
}

export const NLMap: React.FC<NLMapProps> = ({ selectedProvince, onProvinceSelect }) => {
  return (
    <div className="relative w-full aspect-[4/5] bg-white rounded-3xl border border-slate-100 p-4 shadow-inner">
      <svg viewBox="0 0 600 700" className="w-full h-full drop-shadow-lg">
        {PROVINCES.map((p) => (
          <path
            key={p.id}
            d={p.path}
            onClick={() => onProvinceSelect(selectedProvince === p.id ? "" : p.id)}
            className={`cursor-pointer transition-all duration-300 stroke-white stroke-[2] hover:opacity-90 hover:fill-orange-100/50
              ${selectedProvince === p.id ? "fill-orange-500 scale-[1.02]" : "fill-slate-200"}`}
            style={{ transformOrigin: "center", transformBox: "fill-box" }}
          >
            <title>{p.name}</title>
          </path>
        ))}
      </svg>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 left-6 flex flex-wrap gap-2 justify-center pointer-events-none">
        {PROVINCES.map(p => (
          <div key={p.id} className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-tighter border transition-colors
            ${selectedProvince === p.id ? "bg-orange-500 text-white border-orange-500" : "bg-white/80 text-slate-400 border-slate-100"}`}>
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
};
