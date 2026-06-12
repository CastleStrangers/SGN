import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const members = await prisma.boardMember.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const parsedMembers = members.map(m => {
      let committees: string[] = [];
      let bioPoints: string[] = [];

      try {
        committees = m.committees ? JSON.parse(m.committees) : [];
      } catch (e) {
        committees = [];
      }

      try {
        bioPoints = m.bioPoints ? JSON.parse(m.bioPoints) : [];
      } catch (e) {
        bioPoints = [];
      }

      return {
        ...m,
        committees,
        bioPoints
      };
    });

    return NextResponse.json(parsedMembers, { status: 200 });
  } catch (error) {
    console.error("[Board API] Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const formattedData = {
      ...body,
      committees: Array.isArray(body.committees) ? JSON.stringify(body.committees) : body.committees || "[]",
      bioPoints: Array.isArray(body.bioPoints) ? JSON.stringify(body.bioPoints) : body.bioPoints || "[]",
    };

    const newMember = await prisma.boardMember.create({
      data: formattedData
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("[Board API] Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
