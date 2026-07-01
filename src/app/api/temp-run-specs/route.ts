import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET() {
  return new Promise((resolve) => {
    exec("git log -n 20 --oneline", (error, stdout, stderr) => {
      resolve(NextResponse.json({ error, stdout, stderr }));
    });
  });
}
