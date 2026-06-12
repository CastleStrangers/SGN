import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { put } from '@vercel/blob';

const COLORS = ['#1a5632', '#1e3a5f', '#7b2d26', '#2d5a27', '#5a2d7b', '#7b5a2d', '#2d7b5a', '#5a2d5a', '#2d5a7b', '#7b2d5a'];

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function generateSvg(name: string): string {
  const initial = name.trim().charAt(0) || '?';
  const color = stringToColor(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="${color}" rx="200"/>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" fill="white" font-size="180" font-family="Arial, sans-serif" font-weight="bold">${initial}</text>
</svg>`;
}

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set' }, { status: 500 });
    }

    const members = await (prisma as any).boardMember.findMany({
      orderBy: { createdAt: 'asc' }
    }) as any[];

    const results: any[] = [];

    for (const member of members) {
      const imageUrl = member.image || '';
      if (imageUrl.startsWith('http')) {
        results.push({ id: member.id, name: member.nameAr, status: 'skipped', url: imageUrl });
        continue;
      }

      const svg = generateSvg(member.nameAr);
      const blob = await put(`board/${member.id}.svg`, svg, {
        access: 'public',
        token,
        contentType: 'image/svg+xml',
      });

      await (prisma as any).boardMember.update({
        where: { id: member.id },
        data: { image: blob.url },
      });

      results.push({ id: member.id, name: member.nameAr, status: 'migrated', old: imageUrl, new: blob.url });
    }

    return NextResponse.json({ migrated: results.filter(r => r.status === 'migrated').length, skipped: results.filter(r => r.status === 'skipped').length, results });
  } catch (error: any) {
    console.error('[Migrate Board Images]', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
