import { NextResponse } from "next/server"
import { execSync } from "child_process"
import path from "path"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const cmd = url.searchParams.get("cmd") || "git status"
  
  // Set CWD to the repository root (parent of SGN)
  const repoRoot = path.resolve(process.cwd(), "..")

  try {
    console.log(`[Git Exec] Running command: "${cmd}" in CWD: ${repoRoot}`)
    const stdout = execSync(cmd, { cwd: repoRoot, encoding: "utf-8" })
    return NextResponse.json({ success: true, command: cmd, output: stdout })
  } catch (err: any) {
    console.error(`[Git Exec] Command failed: "${cmd}"`, err)
    return NextResponse.json({
      success: false,
      command: cmd,
      error: err.message,
      stderr: err.stderr || "",
      stdout: err.stdout || ""
    })
  }
}
