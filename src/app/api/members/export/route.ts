import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as XLSX from "xlsx";
import { getApiMessage } from "@/lib/api-messages";

function tReq(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: tReq(req, 'api.unauthorized') }, { status: 403 });
  }
  const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" } });
  const rows = members.map((m: { nameAr: string; nameNl: string; birthYear: number; gender: string; originCity: string; whatsapp: string; nlProvincie: string; nlCity: string; expNl: string | null; expOutside: string | null; status: string; createdAt: Date }, i: number) => ({
    [tReq(req, 'export.number')]: i + 1,
    [tReq(req, 'export.nameAr')]: m.nameAr,
    [tReq(req, 'export.nameNl')]: m.nameNl,
    [tReq(req, 'export.birthYear')]: m.birthYear,
    [tReq(req, 'export.gender')]: m.gender,
    [tReq(req, 'export.originCity')]: m.originCity,
    [tReq(req, 'export.whatsapp')]: m.whatsapp,
    [tReq(req, 'export.province')]: m.nlProvincie,
    [tReq(req, 'export.city')]: m.nlCity,
    [tReq(req, 'export.expNl')]: m.expNl || "",
    [tReq(req, 'export.expOutside')]: m.expOutside || "",
    [tReq(req, 'export.status')]: m.status === "accepted" ? tReq(req, 'export.statusAccepted') : m.status === "rejected" ? tReq(req, 'export.statusRejected') : tReq(req, 'export.statusPending'),
    [tReq(req, 'export.registrationDate')]: new Date(m.createdAt).toLocaleDateString(locale === 'ar' ? 'ar' : locale === 'nl' ? 'nl' : 'en'),
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, tReq(req, 'export.sheetName'));
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="members-${Date.now()}.xlsx"`,
    },
  });
}
