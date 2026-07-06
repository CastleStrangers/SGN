import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getPrismaInstance() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  const useTurso = isProd && tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined";
  
  if (useTurso) {
    const { createClient } = require("@libsql/client");
    const libsql = createClient({
      url: tursoUrl!,
      authToken: tursoToken!,
    });
    const adapter = new PrismaLibSql(libsql);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  } else {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getPrismaInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
