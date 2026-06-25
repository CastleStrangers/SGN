import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.serviceReview.findMany({
    where: { serviceId: id },
    include: {
      reviewer: {
        select: {
          name: true,
          image: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rating, comment } = await req.json();

    // Check if the user is reviewing themselves
    const member = await prisma.member.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (member?.userId === session.user.id) {
      return NextResponse.json({ error: "You cannot review your own service" }, { status: 400 });
    }

    const review = await prisma.serviceReview.create({
      data: {
        serviceId: id,
        reviewerId: session.user.id,
        rating: Number(rating),
        comment,
      },
    });

    return NextResponse.json({ review });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
