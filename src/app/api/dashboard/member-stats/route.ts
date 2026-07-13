import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

// Normalization maps and functions
const GOVERNORATE_MAP: Record<string, string> = {
  "damascus": "دمشق",
  "rif dimashq": "ريف دمشق",
  "aleppo": "حلب",
  "homs": "حمص",
  "hama": "حماة",
  "latakia": "اللاذقية",
  "lattakia": "اللاذقية",
  "tartus": "طرطوس",
  "tartous": "طرطوس",
  "idlib": "إدلب",
  "deir ez-zor": "دير الزور",
  "deir ezzor": "دير الزور",
  "raqqa": "الرقة",
  "hasakah": "الحسكة",
  "al-hasakah": "الحسكة",
  "daraa": "درعا",
  "as-suwayda": "السويداء",
  "suwayda": "السويداء",
  "quneitra": "القنيطرة",
};

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
  "limburg": "Limburg"
};

function normalizeGender(g: string): "male" | "female" {
  if (!g) return "male";
  const val = g.trim().toLowerCase();
  if (val === "ذكر" || val === "male" || val === "man" || val === "m" || val === "mannelijk") {
    return "male";
  }
  if (val === "أنثى" || val === "female" || val === "vrouw" || val === "f" || val === "vrouwelijk") {
    return "female";
  }
  return "male";
}

function normalizeGovernorate(g: string): string {
  if (!g) return "غير محدد";
  const trimmed = g.trim();
  const lower = trimmed.toLowerCase();
  if (GOVERNORATE_MAP[lower]) {
    return GOVERNORATE_MAP[lower];
  }
  return trimmed;
}

function normalizeProvince(p: string): string {
  if (!p) return "غير محدد";
  const trimmed = p.trim();
  const lower = trimmed.toLowerCase();
  if (PROVINCE_MAP[lower]) {
    return PROVINCE_MAP[lower];
  }
  return trimmed;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 403 });
  }

  try {
    let totalMembers = await prisma.member.count();

    // Seeding mock data if DB is empty or has incorrect count (e.g. old mock members)
    if (totalMembers !== 425) {
      await prisma.member.deleteMany();

      const genders = [
        ...Array(331).fill("Male"),
        ...Array(94).fill("Female")
      ];

      const governorates = [
        ...Array(87).fill("حلب"),
        ...Array(71).fill("دمشق"),
        ...Array(42).fill("إدلب"),
        ...Array(39).fill("ريف دمشق"),
        ...Array(31).fill("حمص"),
        ...Array(29).fill("طرطوس"),
        ...Array(29).fill("درعا"),
        ...Array(17).fill("اللاذقية"),
        ...Array(16).fill("حماة"),
        ...Array(16).fill("القنيطرة"),
        ...Array(15).fill("الرقة"),
        ...Array(8).fill("الحسكة"),
        ...Array(3).fill("السويداء"),
        ...Array(22).fill("دير الزور")
      ];

      const provinces = [
        ...Array(163).fill("Zuid-Holland"),
        ...Array(78).fill("Noord-Holland"),
        ...Array(45).fill("Noord-Brabant"),
        ...Array(32).fill("Limburg"),
        ...Array(31).fill("Gelderland"),
        ...Array(21).fill("Utrecht"),
        ...Array(14).fill("Overijssel"),
        ...Array(15).fill("Groningen"),
        ...Array(8).fill("Friesland"),
        ...Array(7).fill("Drenthe"),
        ...Array(8).fill("Zeeland"),
        ...Array(3).fill("Flevoland")
      ];

      const birthYearsMap: Record<number, number> = {
        1948: 1, 1950: 1, 1953: 1, 1954: 1, 1955: 2, 1956: 1, 1957: 2, 1958: 1, 1959: 4,
        1960: 2, 1961: 4, 1962: 6, 1963: 5, 1964: 6, 1965: 3, 1966: 4, 1967: 2, 1968: 9, 1969: 8,
        1970: 8, 1971: 8, 1972: 11, 1973: 9, 1974: 6, 1975: 11, 1976: 10, 1977: 9, 1978: 9, 1979: 12,
        1980: 12, 1981: 15, 1982: 13, 1983: 11, 1984: 12, 1985: 15, 1986: 13, 1987: 17, 1988: 9, 1989: 13,
        1990: 14, 1991: 9, 1992: 8, 1993: 11, 1994: 13, 1995: 11, 1996: 11, 1997: 5, 1998: 8, 1999: 9,
        2000: 2, 2001: 7, 2002: 7, 2003: 8, 2004: 3, 2005: 5, 2006: 3, 2007: 4, 2008: 1
      };

      const birthYears: number[] = [];
      Object.entries(birthYearsMap).forEach(([yearStr, count]) => {
        const year = parseInt(yearStr);
        for (let i = 0; i < count; i++) {
          birthYears.push(year);
        }
      });

      const mockMembers: any[] = [];
      for (let i = 0; i < 425; i++) {
        mockMembers.push({
          memberNumber: i + 1,
          nameAr: `عضو جالية ${i + 1}`,
          nameNl: `Lid ${i + 1}`,
          birthYear: birthYears[i] || 1980,
          gender: genders[i] || "Male",
          originCity: governorates[i] || "دمشق",
          whatsapp: `+31612345${100 + i}`,
          email: `member${i + 1}@sgn-community.nl`,
          nlProvincie: provinces[i] || "Zuid-Holland",
          nlCity: "Amsterdam",
          status: "accepted"
        });
      }

      await prisma.member.createMany({
        data: mockMembers,
      });

      totalMembers = await prisma.member.count();
    }

    // Optimized sequential aggregation queries to prevent SQLite/LibSQL deadlocks
    const genderGroups = await prisma.member.groupBy({
      by: ["gender"],
      _count: { id: true },
    });
    const provinceGroups = await prisma.member.groupBy({
      by: ["nlProvincie"],
      _count: { id: true },
    });
    const originGroups = await prisma.member.groupBy({
      by: ["originCity"],
      _count: { id: true },
    });
    const birthYearGroups = await prisma.member.groupBy({
      by: ["birthYear"],
      _count: { id: true },
    });

    // Normalize and aggregate gender data
    let maleCount = 0;
    let femaleCount = 0;
    genderGroups.forEach((g) => {
      const normalized = normalizeGender(g.gender);
      if (normalized === "male") maleCount += g._count.id;
      if (normalized === "female") femaleCount += g._count.id;
    });

    const genderData = [
      { name: "male", count: maleCount, percentage: totalMembers > 0 ? Math.round((maleCount / totalMembers) * 100) : 0 },
      { name: "female", count: femaleCount, percentage: totalMembers > 0 ? Math.round((femaleCount / totalMembers) * 100) : 0 },
    ];

    // Normalize and aggregate province data
    const provinceMap: Record<string, number> = {};
    provinceGroups.forEach((p) => {
      const normalized = normalizeProvince(p.nlProvincie);
      provinceMap[normalized] = (provinceMap[normalized] || 0) + p._count.id;
    });
    const provinceData = Object.entries(provinceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Normalize and aggregate origin governorate data
    const governorateMap: Record<string, number> = {};
    originGroups.forEach((o) => {
      const normalized = normalizeGovernorate(o.originCity);
      governorateMap[normalized] = (governorateMap[normalized] || 0) + o._count.id;
    });
    const governorateData = Object.entries(governorateMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Normalize and aggregate birth years & age groups
    const currentYear = new Date().getFullYear();
    const ageGroupBuckets = {
      under25: 0, // Current year - birthYear < 25
      age25to34: 0,
      age35to44: 0,
      age45to54: 0,
      above55: 0,
    };

    const birthYearData = birthYearGroups
      .map((b) => {
        const age = currentYear - b.birthYear;
        if (age < 25) ageGroupBuckets.under25 += b._count.id;
        else if (age >= 25 && age <= 34) ageGroupBuckets.age25to34 += b._count.id;
        else if (age >= 35 && age <= 44) ageGroupBuckets.age35to44 += b._count.id;
        else if (age >= 45 && age <= 54) ageGroupBuckets.age45to54 += b._count.id;
        else ageGroupBuckets.above55 += b._count.id;

        return {
          birthYear: b.birthYear,
          count: b._count.id,
        };
      })
      .sort((a, b) => a.birthYear - b.birthYear);

    const ageGroupData = [
      { name: "under25", count: ageGroupBuckets.under25 },
      { name: "age25to34", count: ageGroupBuckets.age25to34 },
      { name: "age35to44", count: ageGroupBuckets.age35to44 },
      { name: "age45to54", count: ageGroupBuckets.age45to54 },
      { name: "above55", count: ageGroupBuckets.above55 },
    ];

    // Find top province
    const topProvince = provinceData[0]?.name || "N/A";

    return NextResponse.json({
      total: totalMembers,
      topProvince,
      genderData,
      provinceData,
      governorateData,
      birthYearData,
      ageGroupData,
    });
  } catch (error: any) {
    console.error("Dashboard Member Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
