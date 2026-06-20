import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://www.sy-nl.org/nbdh-aljalyh", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SYNL-SyncBot/1.0; +https://sy-nl.org)",
      }
    })
    const html = await res.text()
    
    // Find props
    const match = html.match(/props="([\s\S]*?)"/)
    if (!match) {
      return NextResponse.json({ success: false, error: "No props found in HTML" })
    }
    
    const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    const data = JSON.parse(decoded)
    
    // Let's inspect keys
    const keys = Object.keys(data)
    
    // Helper to find deep keys or sample blocks
    return NextResponse.json({ 
      success: true, 
      keys,
      pageDataKeys: data.pageData ? Object.keys(data.pageData) : null,
      samplePageData: data.pageData ? JSON.stringify(data.pageData).slice(0, 1000) : null
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) })
  }
}
