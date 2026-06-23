import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Prevent execution in production environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Command execution is disabled in production." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cmd = searchParams.get("cmd") || "git status";
    
    // Whitelist only safe git commands
    const allowedCommands = ["git status", "git diff", "git log", "git push"];
    const isAllowed = allowedCommands.some(allowed => cmd.trim().startsWith(allowed));

    if (!isAllowed) {
      return NextResponse.json({ error: "Only safe git commands are allowed." }, { status: 400 });
    }

    const { stdout, stderr } = await execAsync(cmd, {
      cwd: process.cwd(),
    });

    return NextResponse.json({ stdout, stderr });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stderr: error.stderr }, { status: 500 });
  }
}
