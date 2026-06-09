import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAuthorize } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const published = searchParams.get("published");
  const session = await getServerSession(authOptions);

  if (slug) {
    const page = await prisma.landingPage.findUnique({ where: { slug } });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    if (!page.published && (!session?.user?.id || !(await requireAuthorize(session.user.id, "landing.create")))) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(page);
  }

  if (published === "true") {
    const pages = await prisma.landingPage.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pages);
  }

  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "landing.create"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.landingPage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "landing.create"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const existing = await prisma.landingPage.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  const page = await prisma.landingPage.create({
    data: {
      title: data.title,
      slug,
      subtitle: data.subtitle || null,
      heroImage: data.heroImage || null,
      heroHeadline: data.heroHeadline || null,
      heroSubheadline: data.heroSubheadline || null,
      content: data.content || "",
      ctaText: data.ctaText || null,
      ctaLink: data.ctaLink || null,
      features: data.features || null,
      themeColor: data.themeColor || "#1a5632",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      published: data.published || false,
    },
  });

  return NextResponse.json(page);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "landing.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const { id, ...fields } = data;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const page = await prisma.landingPage.update({
    where: { id },
    data: fields,
  });

  return NextResponse.json(page);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await requireAuthorize(session.user.id, "landing.delete"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.landingPage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
