import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
  return new Promise((resolve) => {
    // Run npx prisma db push in the workspace root
    const cwd = process.cwd();
    exec('npx prisma db push', { cwd }, (error, stdout, stderr) => {
      if (error) {
        resolve(
          NextResponse.json({
            success: false,
            error: error.message,
            stdout,
            stderr,
          })
        );
        return;
      }
      resolve(
        NextResponse.json({
          success: true,
          stdout,
          stderr,
        })
      );
    });
  });
}
