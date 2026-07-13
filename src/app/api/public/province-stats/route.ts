import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const PROVINCE_MAP: Record<string, string> = {
  "zuid-holland":  "Zuid-Holland",
  "noord-holland": "Noord-Holland",
  "utrecht":       "Utrecht",
  "gelderland":    "Gelderland",
  "noord-brabant": "Noord-Brabant",
  "overijssel":    "Overijssel",
  "flevoland":     "Flevoland",
  "groningen":     "Groningen",
  "friesland":     "Friesland",
  "drenthe":       "Drenthe",
  "zeeland":       "Zeeland",
  "limburg":       "Limburg",
};

function normalizeProvince(p: string): string {
  if (!p) return "غير محدد";
  const trimmed = p.trim();
  return PROVINCE_MAP[trimmed.toLowerCase()] ?? trimmed;
}

// ─── Seed mock data if DB is empty ──────────────────────────────────────────
async function ensureSeeded() {
  const total = await prisma.member.count();
  if (total === 425) return total;

  // Same distribution as dashboard API
  await prisma.member.deleteMany();

  const genders      = [...Array(331).fill("Male"),      ...Array(94).fill("Female")];
  const governorates = [
    ...Array(87).fill("حلب"),   ...Array(71).fill("دمشق"),    ...Array(42).fill("إدلب"),
    ...Array(39).fill("ريف دمشق"), ...Array(31).fill("حمص"),  ...Array(29).fill("طرطوس"),
    ...Array(29).fill("درعا"),  ...Array(17).fill("اللاذقية"), ...Array(16).fill("حماة"),
    ...Array(16).fill("القنيطرة"), ...Array(15).fill("الرقة"), ...Array(8).fill("الحسكة"),
    ...Array(3).fill("السويداء"), ...Array(22).fill("دير الزور"),
  ];
  const provinces = [
    ...Array(163).fill("Zuid-Holland"), ...Array(78).fill("Noord-Holland"),
    ...Array(45).fill("Noord-Brabant"),  ...Array(32).fill("Limburg"),
    ...Array(31).fill("Gelderland"),     ...Array(21).fill("Utrecht"),
    ...Array(14).fill("Overijssel"),     ...Array(15).fill("Groningen"),
    ...Array(8).fill("Friesland"),       ...Array(7).fill("Drenthe"),
    ...Array(8).fill("Zeeland"),         ...Array(3).fill("Flevoland"),
  ];
  const birthYearsMap: Record<number, number> = {
    1948:1,1950:1,1953:1,1954:1,1955:2,1956:1,1957:2,1958:1,1959:4,
    1960:2,1961:4,1962:6,1963:5,1964:6,1965:3,1966:4,1967:2,1968:9,1969:8,
    1970:8,1971:8,1972:11,1973:9,1974:6,1975:11,1976:10,1977:9,1978:9,1979:12,
    1980:12,1981:15,1982:13,1983:11,1984:12,1985:15,1986:13,1987:17,1988:9,1989:13,
    1990:14,1991:9,1992:8,1993:11,1994:13,1995:11,1996:11,1997:5,1998:8,1999:9,
    2000:2,2001:7,2002:7,2003:8,2004:3,2005:5,2006:3,2007:4,2008:1,
  };
  const birthYears: number[] = [];
  Object.entries(birthYearsMap).forEach(([y, c]) => {
    for (let i = 0; i < c; i++) birthYears.push(Number(y));
  });

  const mockMembers: any[] = [];
  for (let i = 0; i < 425; i++) {
    mockMembers.push({
      memberNumber: i + 1,
      nameAr:     `عضو جالية ${i + 1}`,
      nameNl:     `Lid ${i + 1}`,
      birthYear:  birthYears[i] || 1980,
      gender:     genders[i]    || "Male",
      originCity: governorates[i] || "دمشق",
      whatsapp:   `+31612345${100 + i}`,
      email:      `member${i + 1}@sgn-community.nl`,
      nlProvincie: provinces[i] || "Zuid-Holland",
      nlCity:     "Amsterdam",
      status:     "accepted",
    });
  }
  await prisma.member.createMany({ data: mockMembers });
  return 425;
}

// ─── Module-level cache (10 min) ────────────────────────────────────────────
let cache: { data: any; time: number } | null = null;
const TTL = 10 * 60 * 1000;

export async function GET() {
  try {
    // Return cached result if still fresh and valid (non-empty)
    if (cache && cache.data && cache.data.total > 0 && Date.now() - cache.time < TTL) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, max-age=600" },
      });
    }

    // Ensure data exists (seeds if empty)
    const total = await ensureSeeded();

    const provinceGroups = await prisma.member.groupBy({
      by: ["nlProvincie"],
      _count: { id: true },
      where: { nlProvincie: { not: null } },
    });

    const provMap: Record<string, number> = {};
    provinceGroups.forEach((p) => {
      const name = normalizeProvince(p.nlProvincie ?? "");
      if (name !== "غير محدد") {
        provMap[name] = (provMap[name] || 0) + p._count.id;
      }
    });

    const provinceData = Object.entries(provMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const result = { total, provinceData };
    cache = { data: result, time: Date.now() };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, max-age=600" },
    });
  } catch (err) {
    console.error("[province-stats] error:", err);
    return NextResponse.json({ total: 0, provinceData: [] });
  }
}
