import { prisma } from "@/lib/db";

export async function logActivity(memberId: string, action: string, details?: string, userId?: string) {
  try {
    await prisma.activityLog.create({ data: { memberId, action, details, userId } });
  } catch {}
}
