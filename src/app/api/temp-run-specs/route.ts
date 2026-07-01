import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), "scratch", "generate_specs_pdf.py");
    exec(`C:\\Python314\\python.exe "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        return;
      }
      resolve(NextResponse.json({ stdout, stderr }));
    });
  });
}
