import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  const session = await getServerSession(authOptions);

  if (searchParams.get("all") === "true") {
    if (!session?.user?.id || !(await requireAuthorize(session.user.id, "comments.manage")))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
    const offset = Number(searchParams.get("offset")) || 0;
    const search = searchParams.get("search");

    const where: any = {};
    if (search) {
      where.OR = [
        { author: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [all, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: { replies: true },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({ comments: all, total, limit, offset });
  }

  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await prisma.comment.findMany({
    where: { postId, approved: true, parentId: null },
    include: { replies: { where: { approved: true }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  try {
    const { postId, author, content, userId, parentId } = await req.json();
    if (!postId || !author || !content) return NextResponse.json({ error: t(req, 'api.allFieldsRequired') }, { status: 400 });
    const comment = await prisma.comment.create({
      data: { postId, author, content, userId: userId || null, parentId: parentId || null, approved: true },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { slug: true, authorId: true },
    });
    const link = post?.slug ? `/news/${post.slug}` : `/news/${postId}`;

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parent?.userId && parent.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: parent.userId,
            title: t(req, 'api.notificationCommentReply'),
            message: `${author}: ${content.slice(0, 100)}`,
            link,
          },
        });
      }
    }

    if (post?.authorId && post.authorId !== userId && !parentId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          title: t(req, 'api.notificationNewComment'),
          message: `${author}: ${content.slice(0, 100)}`,
          link,
        },
      });
    }

    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: t(req, 'api.internalError') }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { id, approved, like } = body;

  if (like) {
    const comment = await prisma.comment.update({ where: { id }, data: { likes: { increment: 1 } } });
    return NextResponse.json({ likes: comment.likes });
  }

  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "comments.approve")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.comment.update({ where: { id }, data: { approved } });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "comments.delete")))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
