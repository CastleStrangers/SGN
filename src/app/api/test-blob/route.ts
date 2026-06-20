import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const dynamic = "force-dynamic"

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ error: "Missing BLOB_READ_WRITE_TOKEN in .env" })
  }

  try {
    const blob = await put("sync/test-file.txt", "Hello World from SGN Sync Debugger", {
      access: "public",
      token: token,
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    const fetchRes = await fetch(blob.url, { cache: 'no-store' })
    const fetchStatus = fetchRes.status
    const text = await fetchRes.text()

    return NextResponse.json({
      success: true,
      url: blob.url,
      fetchStatus,
      content: text
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    })
  }
}
