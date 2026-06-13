import dotenv from "dotenv"
dotenv.config()

async function run() {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN
  console.log("PAGE ID:", pageId)
  console.log("TOKEN START:", token?.slice(0, 15))

  if (!pageId || !token) {
    console.error("Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_TOKEN in .env")
    return
  }

  const url = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=id,message,created_time&limit=5&access_token=${token}`
  console.log("Fetching url:", url.replace(token, "TOKEN"))

  try {
    const res = await fetch(url)
    const json = await res.json()
    console.log("RESPONSE JSON:", JSON.stringify(json, null, 2))
  } catch (err) {
    console.error("Fetch failed:", err)
  }
}

run()
