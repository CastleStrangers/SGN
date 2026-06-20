import "dotenv/config"
import { put } from "@vercel/blob"

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error("Missing BLOB_READ_WRITE_TOKEN in .env")
    return
  }

  console.log("Testing Vercel Blob upload...")
  try {
    const blob = await put("sync/test-file.txt", "Hello World from SGN Sync Debugger", {
      access: "public",
      token: token,
      addRandomSuffix: false,
      allowOverwrite: true,
    })
    console.log("Upload succeeded!")
    console.log("Returned URL:", blob.url)
    
    // Now let's try to fetch it
    console.log("Fetching the uploaded blob...")
    const res = await fetch(blob.url)
    console.log("Fetch status:", res.status)
    const text = await res.text()
    console.log("Fetched content:", text)
  } catch (err) {
    console.error("Upload failed with error:", err)
  }
}

main().catch(console.error)
