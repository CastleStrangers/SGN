import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const regulation = await prisma.regulation.findFirst({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(regulation || { error: "No regulations found" }, { status: regulation ? 200 : 404 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "regulations.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, ...fields } = data;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const regulation = await prisma.regulation.update({ where: { id }, data: { ...fields, updatedAt: new Date() } });
    return NextResponse.json(regulation);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
