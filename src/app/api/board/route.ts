import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeBoardImagePath } from '@/lib/board-images';

export const dynamic = "force-dynamic";

interface DbBoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  titleAr: string;
  titleEn: string;
  isFounder: boolean;
  isLicensing: boolean;
  committees: string;
  bioPoints: string;
  website: string | null;
  kvkNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const members = await (prisma as any).boardMember.findMany({
      orderBy: { createdAt: 'asc' }
    }) as DbBoardMember[];

    const parsedMembers = members.map((m: DbBoardMember) => {
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

      let normalizedImage = m.image || '';
      
      // نعتمد على الصورة الحقيقية المرفوعة، وفي حال عدم وجودها نستخدم دوال المعالجة الأساسية
      if (normalizedImage) {
        normalizedImage = normalizeBoardImagePath(normalizedImage);
      }

      return {
        ...m,
        image: normalizedImage,
        committees,
        bioPoints
      };
    });

    const orderedNames = [
      "Abdul Munim Al Chaman",
      "Saleh Al Mohamad",
      "Khaled Faisal Altawil",
      "Mohamad Salim Aziza",
      "Mohamad Raed Kaakeh",
      "Ahmad Alharfi",
      "Huda Alhallak",
      "Raid Dahmoush",
      "Mahmoud AlNaser",
      "Omar Al Nwilati",
      "Rabaa Al-Zreqat",
      "Faten Rahhal",
      "Hasan Alhasan (Qutaini)",
      "Nabil Haj Hussein",
      "Belal Alrefai",
      "Mohammad Semhani",
      "Nehad Sowid",
      "Mohamad Akram Aljnidi",
      "Youssef Darwesh",
      "Mohammed Rabe Aljnidi",
      "Wassim Hassan",
      "Mahera Al Tawashi",
      "Rima Alhrbat",
      "Feras Abdin"
    ];

    parsedMembers.sort((a, b) => {
      const idxA = orderedNames.indexOf(a.nameEn);
      const idxB = orderedNames.indexOf(b.nameEn);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
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

    const newMember = await (prisma as any).boardMember.create({
      data: formattedData
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("[Board API] Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
