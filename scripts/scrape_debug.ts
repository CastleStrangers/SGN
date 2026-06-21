import "dotenv/config"
import fs from "fs"

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SYNL-SyncBot/1.0; +https://sy-nl.org)",
      Accept: "text/html,application/xhtml+xml",
    },
  })
  return res.text()
}

async function main() {
  console.log("Fetching webpage...")
  const html = await fetchPage("https://www.sy-nl.org/nbdh-aljalyh")
  console.log("HTML fetched. Length:", html.length)
  
  const match = html.match(/props="([\s\S]*?)"/)
  if (!match) {
    console.log("No props match found!")
    // Let's dump some parts of the HTML to see if there is standard HTML or another structure
    fs.writeFileSync("webpage_dump.html", html.slice(0, 10000))
    console.log("Dumped first 10k chars of HTML to webpage_dump.html")
    return
  }
  
  console.log("Props match found!")
  const decoded = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  fs.writeFileSync("props_decoded.json", decoded)
  console.log("Decoded props written to props_decoded.json")

  const data = JSON.parse(decoded)
  const imageStrings: string[] = []
  
  const traverse = (obj: any) => {
    if (!obj) return
    if (typeof obj === "string") {
      const trimmed = obj.trim()
      if (trimmed.includes(".jpg") || trimmed.includes(".png") || trimmed.includes(".jpeg") || trimmed.includes(".webp")) {
        imageStrings.push(trimmed)
      }
    } else if (typeof obj === "object") {
      for (const key in obj) {
        traverse(obj[key])
      }
    } else if (Array.isArray(obj)) {
      for (const val of obj) {
        traverse(val)
      }
    }
  }

  traverse(data)
  console.log("All image-like strings in props:")
  console.log(JSON.stringify(imageStrings.slice(0, 50), null, 2))
}

main().catch(console.error)
