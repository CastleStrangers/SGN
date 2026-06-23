import { NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const { execSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");

  try {
    const cmd = `git show b5ff1b5163602293256cc783acb44d747affca99:src/app/[locale]/about/align/page.tsx`;
    const stdout = execSync(cmd, { encoding: "utf8" });
    
    fs.writeFileSync(path.join(process.cwd(), "git_output.txt"), stdout, "utf8");
    
    return NextResponse.json({ success: true, message: "Wrote to git_output.txt" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
