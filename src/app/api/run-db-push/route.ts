import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Promise((resolve) => {
    const cwd = process.cwd();
    exec('git checkout src/app/[locale]/dashboard/members/page.tsx', { cwd }, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ success: false, error: error.message, time: Date.now() }));
        return;
      }
      resolve(NextResponse.json({ success: true, stdout, stderr, time: Date.now() }));
    });
  });
}
