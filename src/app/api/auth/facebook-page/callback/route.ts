import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/facebook-sync?error=no_code", request.url))
  }

  const clientId = process.env.FACEBOOK_CLIENT_ID
  const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/dashboard/facebook-sync?error=missing_credentials", request.url))
  }

  const origin = `${url.protocol}//${url.host}`
  const redirectUri = `${origin}/api/auth/facebook-page/callback`

  try {
    // 1. Exchange code for user access token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`
    const tokenRes = await fetch(tokenUrl)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      console.error("Token exchange error:", tokenData.error)
      return NextResponse.redirect(new URL(`/dashboard/facebook-sync?error=${encodeURIComponent(tokenData.error.message)}`, request.url))
    }

    const userAccessToken = tokenData.access_token

    // 2. Get Page Access Token for the specific page
    const pageId = process.env.FACEBOOK_PAGE_ID || "122140430793137164"
    const accountsUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`
    const accountsRes = await fetch(accountsUrl)
    const accountsData = await accountsRes.json()

    if (accountsData.error) {
      console.error("Accounts fetch error:", accountsData.error)
      return NextResponse.redirect(new URL(`/dashboard/facebook-sync?error=${encodeURIComponent(accountsData.error.message)}`, request.url))
    }

    const page = accountsData.data?.find((p: any) => p.id === pageId)

    if (!page) {
      // User doesn't have access to the target page, or didn't select it
      return NextResponse.redirect(new URL(`/dashboard/facebook-sync?error=page_not_found`, request.url))
    }

    const pageAccessToken = page.access_token

    // 3. Save the pageAccessToken to .env file
    const envPath = path.join(process.cwd(), ".env")
    let envContent = ""
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8")
    }

    if (envContent.includes("FACEBOOK_PAGE_TOKEN=")) {
      envContent = envContent.replace(
        /FACEBOOK_PAGE_TOKEN=.*(\r?\n|$)/,
        `FACEBOOK_PAGE_TOKEN="${pageAccessToken}"$1`
      )
    } else {
      envContent += `\nFACEBOOK_PAGE_TOKEN="${pageAccessToken}"\n`
    }

    fs.writeFileSync(envPath, envContent)

    // Redirect to dashboard with success message
    return NextResponse.redirect(new URL("/dashboard/facebook-sync?success=token_saved", request.url))

  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/facebook-sync?error=internal_error", request.url))
  }
}
