import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET() {
  return new Promise((resolve) => {
    // Run git push directly
    exec("git push", (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ success: false, error: error.message, stdout, stderr }));
        return;
      }
      resolve(NextResponse.json({ success: true, stdout, stderr }));
    });
  });
}
