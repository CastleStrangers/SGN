import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const output1 = execSync("git --no-pager show 9dcca45 -- scripts/seed-board.ts", { encoding: "utf8", timeout: 8000 });
    return NextResponse.json({ output1 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stderr: error.stderr?.toString() });
  }
}




