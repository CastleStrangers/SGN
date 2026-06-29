import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const province = searchParams.get("province") || "";

  const where: any = {
    isServiceProvider: true,
    showInPublicProfile: true,
    status: "accepted",
  };

  if (q) {
    where.OR = [
      { nameAr: { contains: q } },
      { nameNl: { contains: q } },
      { profession: { contains: q } },
      { skills: { contains: q } },
      { serviceDescription: { contains: q } },
    ];
  }

  if (city) {
    where.nlCity = { contains: city };
  }

  if (province) {
    where.nlProvincie = province;
  }

  const members = await prisma.member.findMany({
    where,
    select: {
      id: true,
      nameAr: true,
      nameNl: true,
      profession: true,
      skills: true,
      nlCity: true,
      serviceDescription: true,
      avatar: true,
      whatsapp: true,
      userId: true,
      isPremiumService: true,
      serviceReviews: {
        select: {
          rating: true,
        }
      }
    },
    orderBy: [
      { isPremiumService: "desc" },
      { createdAt: "desc" }
    ],
  });

  const formatted = members.map(m => {
    const total = m.serviceReviews.length;
    const avg = total > 0 ? m.serviceReviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;
    return {
      ...m,
      avgRating: avg,
      reviewCount: total,
    };
  });

  return NextResponse.json({ members: formatted });
}
