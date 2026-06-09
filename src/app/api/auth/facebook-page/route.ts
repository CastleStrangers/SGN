import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const clientId = process.env.FACEBOOK_CLIENT_ID
  if (!clientId) {
    return new NextResponse("FACEBOOK_CLIENT_ID is not configured in .env", { status: 500 })
  }

  const url = new URL(request.url)
  const origin = `${url.protocol}//${url.host}`
  const redirectUri = `${origin}/api/auth/facebook-page/callback`

  // Request scopes for reading page posts
  const scopes = "pages_show_list,pages_read_engagement"
  const fbAuthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`

  return NextResponse.redirect(fbAuthUrl)
}
