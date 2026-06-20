import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cmd = searchParams.get("cmd") || "npm run build";
  const logFile = path.join(process.cwd(), "cmd_output.log");
  
  try {
    fs.writeFileSync(logFile, `Starting command: ${cmd}\n\n`);
    
    const child = exec(cmd, { cwd: process.cwd() });
    
    child.stdout?.on("data", (data) => {
      fs.appendFileSync(logFile, data);
    });
    
    child.stderr?.on("data", (data) => {
      fs.appendFileSync(logFile, data);
    });
    
    child.on("close", (code) => {
      fs.appendFileSync(logFile, `\n\nCommand exited with code: ${code}\n`);
    });
    
    return NextResponse.json({ success: true, message: `Command started. Output will be written to cmd_output.log` });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message
    });
  }
}
