import "dotenv/config"
import fs from "fs"

async function testFacebookAPI() {
  const token = process.env.FACEBOOK_PAGE_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID
  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
  const logFile = "fb_diagnose_result.txt"
  
  let output = `=== Facebook API Diagnosis ===\n`
  output += `Date: ${new Date().toISOString()}\n`
  output += `Configured Page ID: ${pageId}\n`
  
  if (!token) {
    output += `❌ FACEBOOK_PAGE_TOKEN is missing in .env\n`
    fs.writeFileSync(logFile, output)
    return
  }

  output += `Token Preview: ${token.slice(0, 15)}...${token.slice(-15)}\n\n`

  // 1. Check current token identity
  try {
    const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${token}`)
    const meJson = await meRes.json()
    output += `1. Token identity (/me):\n${JSON.stringify(meJson, null, 2)}\n\n`
  } catch (err) {
    output += `1. Token identity (/me) failed: ${err}\n\n`
  }

  // 2. Debug Token using App Access Token
  if (clientId && clientSecret) {
    try {
      const appToken = `${clientId}|${clientSecret}`
      const debugRes = await fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${appToken}`)
      const debugJson = await debugRes.json()
      output += `2. Token Debug Info (/debug_token):\n${JSON.stringify(debugJson, null, 2)}\n\n`
    } catch (err) {
      output += `2. Token Debug Info failed: ${err}\n\n`
    }
  } else {
    output += `2. App Client ID or Secret missing in .env, skipping /debug_token\n\n`
  }

  // 3. Try fetching posts via /posts
  if (pageId) {
    try {
      const postsRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/posts?limit=5&access_token=${token}`)
      const postsJson = await postsRes.json()
      output += `3. Page Posts (/${pageId}/posts):\n${JSON.stringify(postsJson, null, 2)}\n\n`
    } catch (err) {
      output += `3. Page Posts (/${pageId}/posts) failed: ${err}\n\n`
    }

    // 4. Try fetching posts via /feed
    try {
      const feedRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed?limit=5&access_token=${token}`)
      const feedJson = await feedRes.json()
      output += `4. Page Feed (/${pageId}/feed):\n${JSON.stringify(feedJson, null, 2)}\n\n`
    } catch (err) {
      output += `4. Page Feed (/${pageId}/feed) failed: ${err}\n\n`
    }
  }

  fs.writeFileSync(logFile, output)
  console.log(`\n✅ Done! Diagnostics written to ${logFile}`)
}

testFacebookAPI()
