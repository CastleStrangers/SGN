import { PrismaClient } from ".prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  const dbUrl = (tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined")
    ? tursoUrl
    : (process.env.DATABASE_URL || "file:./prisma/dev.db");

  const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(tursoToken && tursoToken !== "undefined" ? { authToken: tursoToken } : {}),
  });
  prismaInstance = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

// Export a Proxy that behaves exactly like PrismaClient but initializes lazily.
// This prevents compile-time or static generation errors when environment variables
// are not fully loaded in the build worker context.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = globalForPrisma.prisma ?? getPrismaInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

