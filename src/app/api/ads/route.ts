import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";

function unauth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const position = searchParams.get("position");
  const active = searchParams.get("active");
  const session = await getServerSession(authOptions);

  if (active === "true") {
    const ads = await prisma.ad.findMany({
      where: {
        active: true,
        AND: [
          position ? { position } : {},
          { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
          { OR: [{ endDate: null }, { endDate: { gte: new Date() } }] },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ads);
  }

  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "ads.create"))) return unauth();

  const ads = await prisma.ad.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "ads.create"))) return unauth();

  const data = await req.json();
  const ad = await prisma.ad.create({
    data: {
      title: data.title,
      image: data.image,
      link: data.link || null,
      position: data.position || "sidebar",
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      active: data.active ?? true,
    },
  });

  return NextResponse.json(ad);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "ads.edit"))) return unauth();

  const data = await req.json();
  const { id, ...fields } = data;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updateData: any = { ...fields };
  if (fields.startDate) updateData.startDate = new Date(fields.startDate);
  if (fields.endDate) updateData.endDate = new Date(fields.endDate);

  const ad = await prisma.ad.update({ where: { id }, data: updateData });
  return NextResponse.json(ad);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "ads.delete"))) return unauth();

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.ad.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
