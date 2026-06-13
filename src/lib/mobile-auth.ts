import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./db";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

export async function getSessionUser(req?: Request): Promise<SessionUser | null> {
  // 1. Try NextAuth session cookies (primarily for Web client)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || null,
        role: (session.user as any).role || "member",
      };
    }
  } catch (err) {
    console.error("[getSessionUser] NextAuth session lookup failed:", err);
  }

  // 2. Try Authorization Bearer Token (for Mobile client)
  if (req) {
    try {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const userId = authHeader.substring(7).trim();
        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
          });
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role || "member",
            };
          }
        }
      }
    } catch (err) {
      console.error("[getSessionUser] Bearer token lookup failed:", err);
    }
  }

  return null;
}
