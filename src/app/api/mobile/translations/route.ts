import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize } from "@/lib/server-permissions";
import { prisma } from "@/lib/db";

// Public GET to fetch translations map
export async function GET(req: NextRequest) {
  try {
    const translations = await prisma.mobileTranslation.findMany();
    
    // Group by language
    const ar: Record<string, string> = {};
    const en: Record<string, string> = {};
    const nl: Record<string, string> = {};

    translations.forEach(t => {
      ar[t.key] = t.ar;
      en[t.key] = t.en;
      nl[t.key] = t.nl;
    });

    return NextResponse.json({ ar, en, nl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Protected POST to add a new key
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "settings.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, ar, en, nl } = await req.json();
    if (!key || !ar || !en || !nl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const item = await prisma.mobileTranslation.create({
      data: { key, ar, en, nl }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Translation key already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Protected PUT to update translations
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "settings.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, key, ar, en, nl } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const item = await prisma.mobileTranslation.update({
      where: { id },
      data: {
        ...(key !== undefined && { key }),
        ...(ar !== undefined && { ar }),
        ...(en !== undefined && { en }),
        ...(nl !== undefined && { nl })
      }
    });

    return NextResponse.json(item);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Protected DELETE to delete key
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "settings.edit"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.mobileTranslation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
