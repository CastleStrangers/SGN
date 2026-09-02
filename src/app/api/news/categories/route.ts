import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "ar";
    const { localizeCategory } = await import("@/lib/language-guard");

    const categories = await prisma.post.groupBy({
      by: ['category'],
      _count: true,
      where: {
        published: true,
        locale,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
    });

    return NextResponse.json(
      categories.map(c => ({
        name: localizeCategory(c.category, locale),
        rawName: c.category,
        count: c._count,
      })),
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[API/news/categories]", error);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
