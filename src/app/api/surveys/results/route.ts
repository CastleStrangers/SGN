import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get("surveyId");
  if (!surveyId) return NextResponse.json({ error: "surveyId required" }, { status: 400 });

  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: { options: { orderBy: { votes: "desc" } }, _count: { select: { votes: true } } },
  });

  if (!survey) return NextResponse.json({ error: "Survey not found" }, { status: 404 });

  return NextResponse.json(survey);
}
