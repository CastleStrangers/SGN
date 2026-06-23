import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import PDFDocument from "pdfkit";
import { getApiMessage } from "@/lib/api-messages";

import { getSessionUser } from "@/lib/mobile-auth";

function t(_req: Request, key: string) {
  const locale = (_req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  let user = await getSessionUser(_req);
  if (!user) {
    const url = new URL(_req.url);
    const queryToken = url.searchParams.get("token");
    if (queryToken) {
      const dbUser = await prisma.user.findUnique({
        where: { id: queryToken },
        select: { id: true, name: true, email: true, role: true }
      });
      if (dbUser) {
        user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role || "member"
        };
      }
    }
  }

  if (!user) {
    return NextResponse.json({ error: t(_req, 'api.unauthorized') }, { status: 401 });
  }
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: t(_req, 'api.memberNotFound') }, { status: 404 });

  const isOwner = member.userId === user.id;
  const isAdmin = user.role === "admin";
  const isPublic = member.isCvPublic && member.status === "accepted" && member.showInPublicProfile;

  if (!isOwner && !isAdmin && !isPublic) {
    return NextResponse.json({ error: t(_req, 'api.unauthorized') }, { status: 401 });
  }

  const doc = new PDFDocument({ size: "A4", margins: { top: 40, bottom: 40, left: 40, right: 40 } });
  const buffers: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => buffers.push(chunk));

  await new Promise<void>(resolve => {
    doc.on("end", () => resolve());

    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1a5632")
      .text("الجالية السورية في هولندا", { align: "center" });
    doc.fontSize(11).fillColor("#6b7280")
      .text("Syrian Community in the Netherlands", { align: "center" })
      .moveDown(1.5);

    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke().moveDown(1);

    const leftX = 40;
    const rightX = 300;
    const colW = 240;
    const labelColor = "#6b7280";
    const valueColor = "#111827";
    const lineH = 22;

    const pairs = [
      ["nameAr", "الاسم بالعربية"],
      ["nameNl", "الاسم بهولندية"],
      ["birthYear", "سنة الميلاد"],
      ["gender", "الجنس"],
      ["originCity", "محافظة المنشأ"],
      ["nlProvincie", "المقاطعة"],
      ["nlCity", "مدينة السكن"],
      ["whatsapp", "واتساب"],
      ["email", "البريد الإلكتروني"],
    ];

    let y = doc.y + 5;
    for (let i = 0; i < pairs.length; i += 2) {
      doc.y = y;
      doc.font("Helvetica").fontSize(8).fillColor(labelColor).text(pairs[i][1], leftX, doc.y, { width: colW });
      doc.font("Helvetica-Bold").fontSize(10).fillColor(valueColor).text(String((member as any)[pairs[i][0]] || "—"), leftX, doc.y + 2, { width: colW });

      if (pairs[i + 1]) {
        doc.y = y;
        doc.font("Helvetica").fontSize(8).fillColor(labelColor).text(pairs[i + 1][1], rightX, doc.y, { width: colW });
        doc.font("Helvetica-Bold").fontSize(10).fillColor(valueColor).text(String((member as any)[pairs[i + 1][0]] || "—"), rightX, doc.y + 2, { width: colW });
      }
      y += lineH;
    }

    doc.y = y + 10;
    if (member.expNl) {
      doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke().moveDown(1);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#1a5632").text("الخبرات في هولندا");
      doc.font("Helvetica").fontSize(9).fillColor(valueColor).text(member.expNl, { width: 510 });
      doc.moveDown(1);
    }
    if (member.expOutside) {
      doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke().moveDown(1);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#1a5632").text("الخبرات السابقة");
      doc.font("Helvetica").fontSize(9).fillColor(valueColor).text(member.expOutside, { width: 510 });
      doc.moveDown(1);
    }

    doc.moveTo(40, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke().moveDown(1);
    const statusLabels: Record<string, string> = { pending: "قيد المراجعة", accepted: "مقبول", rejected: "مرفوض" };
    doc.font("Helvetica").fontSize(8).fillColor(labelColor)
      .text(`تاريخ التقديم: ${new Date(member.createdAt).toLocaleDateString("ar-EG-u-nu-arab")}`, 40, doc.y, { width: colW });
    doc.text(`الحالة: ${statusLabels[member.status || "pending"] || member.status}`, rightX, doc.y - 10, { width: colW });

    if (member.notes) {
      doc.moveDown(0.5);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#92400e").text("ملاحظات:");
      doc.font("Helvetica").fontSize(9).fillColor(valueColor).text(member.notes, { width: 510 });
    }

    doc.end();
  });

  const pdf = Buffer.concat(buffers);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="member-${member.id}.pdf"`,
    },
  });
}
