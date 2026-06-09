import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status } = body;
    const { id } = await params;

    const data: Record<string, any> = { status };
    if (status === "completed") {
      data.paidAt = new Date();
    }

    const donation = await prisma.donation.update({
      where: { id },
      data,
    });

    await logActivity("donation-" + id, `Donation ${status}`, `Status updated to ${status}`, (session.user as any).id);

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("[DONATION_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
