import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const logPath = path.join(process.cwd(), "temp_db_push_log.txt");
  fs.writeFileSync(logPath, "Starting db push...\n");

  try {
    fs.appendFileSync(logPath, "Executing npx prisma db push...\n");
    const output = execSync("npx prisma db push", { cwd: process.cwd(), encoding: "utf-8" });
    fs.appendFileSync(logPath, `Output:\n${output}\nSuccess!\n`);
    return NextResponse.json({ success: true, output });
  } catch (error: any) {
    fs.appendFileSync(logPath, `Error: ${error.message}\nStderr: ${error.stderr}\n`);
    return NextResponse.json({ success: false, error: error.message, stderr: error.stderr });
  }
}
