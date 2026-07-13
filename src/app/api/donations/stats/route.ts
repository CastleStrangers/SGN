import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const totalCount = await prisma.donation.count();
  const totalAmount = await prisma.donation.aggregate({ _sum: { amount: true } });
  const statusBreakdown = await prisma.donation.groupBy({ by: ["status"], _count: { id: true }, _sum: { amount: true } });
  const monthlyTotals = await (prisma as any).$queryRawUnsafe(
    `SELECT strftime('%Y-%m', "createdAt") as month, SUM(amount) as total, COUNT(*) as count FROM Donation GROUP BY month ORDER BY month DESC LIMIT 12`
  ) as Array<{ month: string; total: number; count: number }>;

  const byStatus = Object.fromEntries(
    statusBreakdown.map((s: { status: string; _count: { id: number }; _sum: { amount: number | null } }) => [
      s.status,
      { count: s._count.id, amount: s._sum.amount || 0 },
    ])
  );

  return NextResponse.json({
    totalCount,
    totalAmount: totalAmount._sum.amount || 0,
    byStatus,
    monthlyTotals,
  });
}
