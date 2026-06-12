import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";
import { triggerSocialShare } from "@/lib/sync/social-share";
import { sendPushNotifications } from "@/lib/notifications/push";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "pages.create"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "pages.create"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, content, excerpt, image, category, tags, source, featured, slug, publishTo } = await req.json();
  const post = await prisma.post.create({
    data: {
      title,
      content,
      excerpt: excerpt || null,
      image: image || null,
      category: category || t(req, 'nav.communityNews'),
      tags: tags || null,
      source: source || t(req, 'site.title'),
      featured: featured || false,
      slug: slug || title.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase().slice(0, 80),
      authorId: (session.user as any).id,
    },
  });

  // Trigger social media sharing webhook if platforms are selected
  if (publishTo && Array.isArray(publishTo) && publishTo.length > 0) {
    triggerSocialShare(post, publishTo);
  }

  // Trigger Expo push notification for all users
  if (post.featured) {
    sendPushNotifications({
      title: "خبر هام من الجالية",
      body: post.title,
      data: { link: `/news/${post.slug}` },
    }).catch(err => console.error("Error sending push notification for post:", err));
  }

  return NextResponse.json(post);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "pages.edit"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, title, content, excerpt, image, category, tags, source, featured, published, slug } = await req.json();
  const data: any = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (image !== undefined) data.image = image;
  if (category !== undefined) data.category = category;
  if (tags !== undefined) data.tags = tags;
  if (source !== undefined) data.source = source;
  if (featured !== undefined) data.featured = featured;
  if (published !== undefined) data.published = published;
  if (slug !== undefined) data.slug = slug;
  const post = await prisma.post.update({ where: { id }, data });
  return NextResponse.json(post);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "pages.delete"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
