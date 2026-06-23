import { NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbPath = path.join(process.cwd(), "prisma", "dev.db.bak");
  const client = createClient({ url: `file:${dbPath}` });

  try {
    const result = await client.execute("SELECT id, nameAr, nameEn, image, titleAr FROM BoardMember");
    client.close();
    return NextResponse.json(result.rows);
  } catch (error: any) {
    client.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
