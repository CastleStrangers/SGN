import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

type PrismaInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaInstance };

function getPrismaInstance(): PrismaInstance {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();

  const useTurso = isProd && 
    tursoUrl && 
    tursoUrl !== "undefined" && 
    !tursoUrl.includes("mydb-user") && 
    tursoToken && 
    tursoToken !== "undefined";
  
  const localDbPath = path.resolve(process.cwd(), "prisma/dev.db");
  const localDbUrl = `file:${localDbPath}`;

  const dbUrl = useTurso
    ? tursoUrl!
    : (process.env.DATABASE_URL?.startsWith("file:") ? process.env.DATABASE_URL : localDbUrl).trim();

  const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(useTurso && tursoToken ? { authToken: tursoToken } : {}),
  });

  globalForPrisma.prisma = new PrismaClient({ adapter });

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaInstance, {
  get(target, prop, receiver) {
    const instance = getPrismaInstance();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
