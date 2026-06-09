import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(dir);
    const images = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(f => ({ url: `/uploads/${f}`, name: f }));
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}
