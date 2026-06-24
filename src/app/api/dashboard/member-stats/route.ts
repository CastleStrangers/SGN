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

    // Seeding mock data if DB is completely empty
    if (totalMembers === 0) {
      const mockNames = [
        { ar: "أحمد العلي", nl: "Ahmad Al-Ali", gender: "Male" },
        { ar: "نور الشام", nl: "Nour Al-Sham", gender: "Female" },
        { ar: "محمد حمصي", nl: "Mohamed Homsi", gender: "Male" },
        { ar: "منى الحلبي", nl: "Mona Halabi", gender: "Female" },
        { ar: "يوسف دمشقي", nl: "Youssef Dimashqi", gender: "Male" },
        { ar: "فاطمة الخطيب", nl: "Fatima Al-Khatib", gender: "Female" },
        { ar: "خالد المصري", nl: "Khaled Al-Masri", gender: "Male" },
        { ar: "ريم سليمان", nl: "Reem Suleiman", gender: "Female" },
        { ar: "علي حسن", nl: "Ali Hassan", gender: "Male" },
        { ar: "رنا عباس", nl: "Rana Abbas", gender: "Female" },
      ];
      const provincesList = ["Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant", "Overijssel"];
      const citiesList = ["Rotterdam", "Amsterdam", "Utrecht", "Arnhem", "Eindhoven", "Enschede"];
      const governoratesList = ["دمشق", "حلب", "حمص", "حماة", "اللاذقية", "درعا", "إدلب", "دير الزور"];

      const mockMembers: any[] = [];
      for (let i = 0; i < 45; i++) {
        const nameObj = mockNames[i % mockNames.length];
        const provIdx = i % provincesList.length;
        const govIdx = (i * 2 + 1) % governoratesList.length;
        const birthYear = 1965 + ((i * 7) % 40); // Generates birth years from 1965 to 2005
        const status = i % 10 === 0 ? "pending" : "accepted";

        mockMembers.push({
          memberNumber: i + 1,
          nameAr: `${nameObj.ar} ${i + 1}`,
          nameNl: `${nameObj.nl} ${i + 1}`,
          birthYear,
          gender: nameObj.gender,
          originCity: governoratesList[govIdx],
          whatsapp: `+316123456${10 + i}`,
          email: `member${i + 1}@example.com`,
          nlProvincie: provincesList[provIdx],
          nlCity: citiesList[provIdx],
          status,
        });
      }

      await prisma.member.createMany({
        data: mockMembers,
      });

      totalMembers = await prisma.member.count();
    }

    // Optimized aggregation queries
    const [genderGroups, provinceGroups, originGroups, birthYearGroups] = await Promise.all([
      prisma.member.groupBy({
        by: ["gender"],
        _count: { id: true },
      }),
      prisma.member.groupBy({
        by: ["nlProvincie"],
        _count: { id: true },
      }),
      prisma.member.groupBy({
        by: ["originCity"],
        _count: { id: true },
      }),
      prisma.member.groupBy({
        by: ["birthYear"],
        _count: { id: true },
      }),
    ]);

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
