import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: t(req, 'api.loginRequired') }, { status: 401 });
  }

  const { surveyId, optionId } = await req.json();
  if (!surveyId || !optionId) {
    return NextResponse.json({ error: t(req, 'api.incompleteDataShort') }, { status: 400 });
  }

  const existing = await prisma.surveyVote.findUnique({
    where: { surveyId_userId: { surveyId, userId: (session.user as any).id } },
  });
  if (existing) {
    return NextResponse.json({ error: t(req, 'api.alreadyVoted') }, { status: 400 });
  }

  const [vote] = await prisma.$transaction([
    prisma.surveyVote.create({
      data: { surveyId, optionId, userId: (session.user as any).id },
    }),
    prisma.surveyOption.update({
      where: { id: optionId },
      data: { votes: { increment: 1 } },
    }),
  ]);

  return NextResponse.json(vote);
}
