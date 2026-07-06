import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { requireAuthorize } from "@/lib/auth-helpers"
import { runSync, DEFAULT_SOURCES } from "@/lib/sync"

import { revalidatePath } from "next/cache"

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

    // كسر التخزين المؤقت لكي تظهر الأخبار الجديدة للعميل فوراً
    revalidatePath("/", "layout")

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
    sources: DEFAULT_SOURCES,
  })
}
