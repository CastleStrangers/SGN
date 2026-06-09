import { chromium } from "playwright"

async function main() {
  console.log("Launching browser to inspect Facebook page ID...")
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  try {
    await page.goto("https://www.facebook.com/DeSyrischeGemeenschapInNederland", { waitUntil: "networkidle" })
    console.log("Landing URL:", page.url())
    console.log("Page Title:", await page.title())
    const html = await page.content()
    
    // Look for page ID patterns
    const patterns = [
      /fb:\/\/page\/\?id=(\d+)/,
      /"pageID":"(\d+)"/,
      /"page_id":"(\d+)"/,
      /meta property="al:android:url" content="fb:\/\/page\/(\d+)"/,
      /"delegate_page_id":"(\d+)"/,
      /delegate_page_id=(\d+)/,
      /owning_profile_id=(\d+)/
    ]
    
    let found = false
    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match) {
        console.log(`Found Page ID with pattern ${pattern}:`, match[1])
        found = true
      }
    }
    
    if (!found) {
      console.log("No Page ID pattern matched. HTML snippet:")
      console.log(html.slice(0, 1000))
    }
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await browser.close()
  }
}

main()
