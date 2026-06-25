import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/mobile-auth";
import { analyzeDocument } from "@/lib/ai/chat";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const documents = await prisma.memberDocument.findMany({
    where: { memberId: member.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(req: Request) {
  const user = await getSessionUser(req);
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.member.findUnique({
    where: { userId: user.id },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  try {
    const { title, fileUrl, category, analyze } = await req.json();

    let analysis: string | null = null;
    if (analyze && fileUrl) {
      try {
        const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
        analysis = await analyzeDocument(fileUrl, locale);
      } catch (aiErr) {
        console.error("AI Analysis error:", aiErr);
      }
    }

    const doc = await prisma.memberDocument.create({
      data: {
        memberId: member.id,
        title,
        fileUrl,
        category,
        analysis,
        fileType: fileUrl.includes(".pdf") ? "pdf" : "image",
      },
    });

    return NextResponse.json({ document: doc });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
