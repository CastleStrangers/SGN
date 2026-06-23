import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const members = await (prisma as any).boardMember.findMany();
    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
