import { firefox } from "playwright"

async function main() {
  console.log("Launching Firefox engine to check if Facebook is accessible...")
  const browser = await firefox.launch({ headless: true })
  const page = await browser.newPage()
  try {
    await page.goto("https://www.facebook.com/DeSyrischeGemeenschapInNederland", { waitUntil: "networkidle" })
    console.log("Landing URL:", page.url())
    console.log("Page Title:", await page.title())
    const text = await page.innerText("body")
    console.log("Is unsupported browser shown?", text.includes("غير متوفر على هذا المتصفح") || text.includes("not available on this browser"))
    console.log("Body text snippet:")
    console.log(text.slice(0, 500))
  } catch (err) {
    console.error("Error:", err)
  } finally {
    await browser.close()
  }
}

main()
