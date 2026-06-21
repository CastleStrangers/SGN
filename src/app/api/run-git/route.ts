import { NextResponse } from "next/server";
import { execSync } from "child_process";

export const dynamic = "force-dynamic";

import { execSync } from "child_process";

export async function GET() {
  try {
    const output1 = execSync("git log -S \"لقطة\" --oneline", { encoding: "utf8", timeout: 15000 });
    return NextResponse.json({ output1 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stderr: error.stderr?.toString() });
  }
}


















