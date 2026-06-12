import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function GET() {
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  try {
    const testBuf = Buffer.from("test-image-data");
    const blob = await put("debug-test/test.txt", testBuf, { access: "public" });
    return NextResponse.json({
      hasToken,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      blobUrl: blob.url,
      blobSize: blob.size,
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({
      hasToken,
      tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length,
      error: e.message || String(e),
      success: false,
    });
  }
}
