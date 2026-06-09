import { chromium } from "playwright"

async function main() {
  console.log("Launching Chromium with local Chrome channel...")
  // Try launching local Google Chrome. If it fails, we will try msedge
  try {
    const browser = await chromium.launch({
      headless: true,
      channel: "chrome" // Uses the user's installed Google Chrome
    })
    const page = await browser.newPage()
    await page.goto("https://www.facebook.com/DeSyrischeGemeenschapInNederland", { waitUntil: "networkidle" })
    console.log("Landing URL:", page.url())
    console.log("Page Title:", await page.title())
    const text = await page.innerText("body")
    console.log("Is unsupported browser shown?", text.includes("غير متوفر على هذا المتصفح") || text.includes("not available on this browser"))
    console.log("Body text snippet:")
    console.log(text.slice(0, 500))
    await browser.close()
  } catch (err) {
    console.log("Failed with Chrome channel, trying msedge channel...")
    try {
      const browser = await chromium.launch({
        headless: true,
        channel: "msedge" // Uses the user's installed Microsoft Edge
      })
      const page = await browser.newPage()
      await page.goto("https://www.facebook.com/DeSyrischeGemeenschapInNederland", { waitUntil: "networkidle" })
      console.log("Landing URL:", page.url())
      console.log("Page Title:", await page.title())
      const text = await page.innerText("body")
      console.log("Is unsupported browser shown?", text.includes("غير متوفر على هذا المتصفح") || text.includes("not available on this browser"))
      console.log("Body text snippet:")
      console.log(text.slice(0, 500))
      await browser.close()
    } catch (err2) {
      console.error("Both Chrome and Edge channels failed:", err2)
    }
  }
}

main()
