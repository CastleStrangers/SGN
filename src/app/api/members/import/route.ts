import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: t(req, 'api.unauthorized') }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: t(req, 'api.fileRequired') }, { status: 400 });

    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    if (lines.length < 2) return NextResponse.json({ error: t(req, 'api.fileEmpty') }, { status: 400 });

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const results = { imported: 0, skipped: 0, errors: [] as string[] };

    const last = await prisma.member.findFirst({ orderBy: { memberNumber: "desc" }, select: { memberNumber: true } });
    let nextNumber = (last?.memberNumber ?? 0) + 1;

    for (let i = 1; i < lines.length; i++) {
      try {
        const vals = lines[i].split(",").map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = vals[idx] || ""; });

        const nameAr = row["namear"] || row["الاسم"] || row["الاسم بالعربية"];
        const nameNl = row["namenl"] || row["name nl"] || row["naam"];
        const whatsapp = row["whatsapp"] || row["phone"] || row["هاتف"];
        const birthYear = parseInt(row["birthyear"] || row["birth_year"] || row["سنة الميلاد"] || "0");
        const gender = row["gender"] || row["الجنس"];
        const originCity = row["origincity"] || row["origin_city"] || row["origin"] || row["محافظة"];
        const nlProvincie = row["nlprovincie"] || row["provincie"] || row["مقاطعة"];
        const nlCity = row["nlcity"] || row["nl_city"] || row["مدينة"];

        if (!nameAr || !whatsapp || !birthYear) {
          results.skipped++;
          continue;
        }

        const member = await prisma.member.create({
          data: {
            memberNumber: nextNumber++,
            nameAr, nameNl: nameNl || nameAr, birthYear, gender: gender || "ذكر",
            originCity: originCity || "", whatsapp, email: row["email"] || null,
            nlProvincie: nlProvincie || "", nlCity: nlCity || "",
            educationLevel: row["educationlevel"] || row["education_level"] || null,
            profession: row["profession"] || null, skills: row["skills"] || null,
            maritalStatus: row["maritalstatus"] || row["marital_status"] || null,
            status: "accepted",
          },
        });
        await logActivity(member.id, "import", t(req, 'activity.importExcel'), session.user.id);
        results.imported++;
      } catch {
        results.skipped++;
      }
    }

    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
