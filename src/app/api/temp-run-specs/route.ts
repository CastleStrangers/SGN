import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function GET() {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "scratch", "generate_specs_pdf.js");
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      const logContent = `Error: ${error ? error.message : "None"}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
      fs.writeFileSync(path.join(process.cwd(), "temp_run_log.txt"), logContent);
      
      if (error) {
        resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json({ stdout, stderr }));
    });
  });
}
