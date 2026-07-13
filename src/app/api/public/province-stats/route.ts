import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PROVINCE_MAP: Record<string, string> = {
  "zuid-holland": "Zuid-Holland",
  "noord-holland": "Noord-Holland",
  "utrecht": "Utrecht",
  "gelderland": "Gelderland",
  "noord-brabant": "Noord-Brabant",
  "overijssel": "Overijssel",
  "flevoland": "Flevoland",
  "groningen": "Groningen",
  "friesland": "Friesland",
  "drenthe": "Drenthe",
  "zeeland": "Zeeland",
  "limburg": "Limburg",
};

function normalizeProvince(p: string): string {
  if (!p) return "غير محدد";
  const trimmed = p.trim();
  const lower = trimmed.toLowerCase();
  if (PROVINCE_MAP[lower]) return PROVINCE_MAP[lower];
  return trimmed;
}

// Cache simple results for 10 minutes to avoid repeated DB queries
let cachedData: { data: any; time: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

export async function GET() {
  try {
    // Return cached data if fresh
    if (cachedData && Date.now() - cachedData.time < CACHE_TTL) {
      return NextResponse.json(cachedData.data, {
        headers: { "Cache-Control": "public, max-age=600" },
      });
    }

    const provinceGroups = await prisma.member.groupBy({
      by: ["nlProvincie"],
      _count: { id: true },
      where: { nlProvincie: { not: null } },
    });

    const total = await prisma.member.count();

    const provinceMap: Record<string, number> = {};
    provinceGroups.forEach((p) => {
      const normalized = normalizeProvince(p.nlProvincie ?? "");
      provinceMap[normalized] = (provinceMap[normalized] || 0) + p._count.id;
    });

    const provinceData = Object.entries(provinceMap)
      .map(([name, count]) => ({ name, count }))
      .filter((p) => p.name !== "غير محدد")
      .sort((a, b) => b.count - a.count);

    const result = { total, provinceData };
    cachedData = { data: result, time: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch {
    return NextResponse.json({ total: 0, provinceData: [] });
  }
}
