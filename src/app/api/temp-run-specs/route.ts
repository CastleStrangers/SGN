import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET() {
  return new Promise((resolve) => {
    exec("git push origin main", (error, stdout, stderr) => {
      resolve(NextResponse.json({ error, stdout, stderr }));
    });
  });
}
