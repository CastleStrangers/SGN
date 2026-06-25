import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { requireAuthorize } from "@/lib/auth-helpers"
import { runSync } from "@/lib/sync"

export async function POST(req: Request) {
  // Allow cron job via CRON_SECRET header
  const cronSecret = req.headers.get("x-cron-secret")
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !(await requireAuthorize(session.user.id, "settings.edit"))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  try {
    const body = await req.json().catch(() => ({}))
    const results = await runSync(body.sources, {
      autoCategorize: body.autoCategorize !== false,
      downloadMedia: body.downloadMedia !== false,
    })

    return NextResponse.json({ success: true, results })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "settings.view"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({
    status: "idle",
    lastSync: null,
    schedule: "0 * * * *",
    sources: [
      { name: "sy-nl.org", type: "webpage", url: "https://www.sy-nl.org/nbdh-aljalyh" },
      {
        name: "facebook-sgn",
        type: "facebook",
        url: "https://www.facebook.com/DeSyrischeGemeenschapInNederland",
        since: "2026-05-14",
      },
      {
        name: "youtube",
        type: "youtube",
        url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCgsEr_WQEnuymVqvTWXqmtw",
      },
    ],
  })
}
