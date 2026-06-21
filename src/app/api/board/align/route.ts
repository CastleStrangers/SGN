import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const mappingFilePath = path.join(process.cwd(), "src", "lib", "board-mapping.json");

export async function GET() {
  try {
    if (fs.existsSync(mappingFilePath)) {
      const mapping = JSON.parse(fs.readFileSync(mappingFilePath, "utf-8"));
      return NextResponse.json({ success: true, mapping });
    }
    return NextResponse.json({ success: true, mapping: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const { mapping } = await request.json();
    if (!mapping || typeof mapping !== "object") {
      return NextResponse.json({ success: false, error: "Invalid mapping data" }, { status: 400 });
    }

    // 1. Save to JSON file for persistence and git tracking
    const dir = path.dirname(mappingFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(mappingFilePath, JSON.stringify(mapping, null, 2), "utf-8");

    // 2. Update the database board members
    const updatedCount = { count: 0 };
    for (const [nameEn, filename] of Object.entries(mapping)) {
      if (filename) {
        // Look up by nameEn
        const member = await (prisma as any).boardMember.findFirst({
          where: { nameEn }
        });
        if (member) {
          await (prisma as any).boardMember.update({
            where: { id: member.id },
            data: { image: `/images/board/${filename}` }
          });
          updatedCount.count++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount.count} board members in the database.`,
      mapping
    });
  } catch (error: any) {
    console.error("[Align API Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
