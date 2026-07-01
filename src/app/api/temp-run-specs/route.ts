import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const logPath = path.join(process.cwd(), "temp_db_push_log.txt");
  fs.writeFileSync(logPath, "Starting db push and generate...\n");

  try {
    fs.appendFileSync(logPath, "Executing npx -y prisma db push --accept-data-loss...\n");
    const output1 = execSync("npx -y prisma db push --accept-data-loss", { cwd: process.cwd(), encoding: "utf-8" });
    fs.appendFileSync(logPath, `Output1:\n${output1}\n`);

    fs.appendFileSync(logPath, "Executing npx -y prisma generate...\n");
    const output2 = execSync("npx -y prisma generate", { cwd: process.cwd(), encoding: "utf-8" });
    fs.appendFileSync(logPath, `Output2:\n${output2}\nSuccess!\n`);

    return NextResponse.json({ success: true, output1, output2 });
  } catch (error: any) {
    fs.appendFileSync(logPath, `Error: ${error.message}\nStderr: ${error.stderr}\n`);
    return NextResponse.json({ success: false, error: error.message, stderr: error.stderr });
  }
}
