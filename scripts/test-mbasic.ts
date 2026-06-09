import { chromium } from "playwright"

async function testMBasic() {
  console.log("Starting mbasic test...")
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox"],
  })
  const context = await browser.newContext({
    locale: "ar",
    userAgent: "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  })
  const page = await context.newPage()

  try {
    const url = "https://mbasic.facebook.com/DeSyrischeGemeenschapInNederland?v=timeline"
    console.log(`Navigating to ${url}`)
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })
    
    console.log(`Loaded URL: ${page.url()}`)
    
    // Check if we are redirected to login
    if (page.url().includes("login")) {
      console.log("❌ Redirected to login page!")
      const bodyText = await page.innerText("body")
      console.log(`Body text preview: ${bodyText.slice(0, 200)}`)
    } else {
      console.log("✅ Successfully bypassed login redirect!")
      // Let's print some text from the page
      const bodyText = await page.innerText("body")
      console.log(`Page text preview: ${bodyText.slice(0, 500)}`)
      
      // Let's find links or headers
      const links = await page.locator("a").all()
      console.log(`Found ${links.length} links on page`)
    }
  } catch (err) {
    console.error("Error running test:", err)
  } finally {
    await browser.close()
  }
}

testMBasic()
