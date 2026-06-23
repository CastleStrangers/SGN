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
      
      const nameEn = (m.nameEn || '').toLowerCase();
      const nameAr = m.nameAr || '';
      
      if (nameEn.includes('abdul munim') || nameAr.includes('عبد المنعم')) {
        normalizedImage = '/images/board/chairman.png';
      } else if (nameEn.includes('khaled') || nameAr.includes('خالد')) {
        normalizedImage = '/images/board/secretary.png';
      } else if (nameEn.includes('saleh') || nameAr.includes('صالح')) {
        normalizedImage = '/images/board/director.png';
      } else if (nameEn.includes('naser') || nameAr.includes('ناصر') || (m.titleAr || '').includes('أمين الصندوق')) {
        normalizedImage = '/images/board/treasurer.png';
      } else {
        // تحويل روابط Vercel Blob المعطّلة إلى المسارات المحلية أو تفريغها
        if (normalizedImage.includes('blob.vercel-storage.com') || normalizedImage.startsWith('https://iysh')) {
          normalizedImage = '';
        } else {
          normalizedImage = normalizeBoardImagePath(normalizedImage);
        }
      }

      return {
        ...m,
        image: normalizedImage,
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

    const newMember = await (prisma as any).boardMember.create({
      data: formattedData
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("[Board API] Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
