import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

type PrismaClientType = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

let prismaInstance: PrismaClientType | null = null;

function getPrismaInstance(): PrismaClientType {
  if (prismaInstance) return prismaInstance;

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  const useTurso = isProd && tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined";

  if (useTurso) {
    const adapter = new PrismaLibSql({
      url: tursoUrl!,
      authToken: tursoToken,
    });
    prismaInstance = new PrismaClient({ adapter });
  } else {
    // Native SQLite driver - 100x faster for local development!
    prismaInstance = new PrismaClient();
  }

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

// Export a Proxy that behaves exactly like PrismaClient but initializes lazily.
// This prevents compile-time or static generation errors when environment variables
// are not fully loaded in the build worker context.
export const prisma = new Proxy({} as PrismaClientType, {
  get(target, prop, receiver) {
    const instance = globalForPrisma.prisma ?? getPrismaInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

