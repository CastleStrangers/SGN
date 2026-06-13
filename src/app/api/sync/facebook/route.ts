import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { requireAuthorize } from "@/lib/auth-helpers"
import { runSync } from "@/lib/sync"
import { getApiMessage } from "@/lib/api-messages"

function fbMsg(req: Request, key: string, vars?: Record<string, string>) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, `sync.facebook.${key}`, vars);
}

const FACEBOOK_SOURCE = {
  name: "facebook-sgn",
  type: "facebook" as const,
  url: "https://www.facebook.com/DeSyrischeGemeenschapInNederland",
  enabled: true,
  category: "أخبار الجالية",
  since: "2026-05-14",
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "settings.view"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN
  const pageSlug = process.env.FACEBOOK_PAGE_SLUG || "DeSyrischeGemeenschapInNederland"
  const appId = process.env.FACEBOOK_CLIENT_ID || "1490681598681536"
  let tokenValid = false
  let hasPageAccess = false
  let tokenScopes: string[] = []
  let errorMsg = ""

  if (token) {
    try {
      const debugRes = await fetch(
        `https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`
      )
      const debug = await debugRes.json()
      if (debug.data?.is_valid) {
        tokenValid = true
        tokenScopes = debug.data?.scopes || []
        hasPageAccess = tokenScopes.includes("pages_read_engagement") || tokenScopes.includes("pages_show_list") || tokenScopes.includes("read_insights")
      } else {
        errorMsg = debug.data?.error?.message || fbMsg(req, 'tokenInvalid')
      }
    } catch (e) {
      errorMsg = fbMsg(req, 'tokenCheckFailed')
    }
  }

  const urlObj = new URL(req.url)
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${urlObj.origin}/dashboard/facebook-sync&scope=pages_read_engagement&response_type=token`

  return NextResponse.json({ configured: !!(pageId && token), pageId: pageId || null, pageSlug, tokenValid, hasPageAccess, tokenScopes, errorMsg, authUrl, appId })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "settings.edit"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const action = body.action as string

  if (action === "set_token") {
    const { token } = body
    if (!token) return NextResponse.json({ error: fbMsg(req, 'tokenRequired') }, { status: 400 })
    const debugRes = await fetch(`https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`)
    const debug = await debugRes.json()
    if (!debug.data?.is_valid) {
      return NextResponse.json({ error: debug.data?.error?.message || fbMsg(req, 'tokenInvalid') }, { status: 400 })
    }
    return NextResponse.json({ success: true, message: fbMsg(req, 'tokenValidMessage'), scopes: debug.data?.scopes || [], userId: debug.data?.user_id })
  }

  if (action === "sync") {
    try {
      const results = await runSync([FACEBOOK_SOURCE])
      const r = results[0]
      return NextResponse.json({
        success: r.success,
        message: fbMsg(req, 'imported', { count: String(r.new) }),
        fetched: r.fetched,
        new: r.new,
        skipped: r.skipped,
        errors: r.errors.slice(0, 5),
      })
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
    }
  }

  return NextResponse.json({ error: fbMsg(req, 'unknownAction') }, { status: 400 })
}
