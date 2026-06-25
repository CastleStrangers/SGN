import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const tursoUrl = (process.env.TURSO_DATABASE_URL || "").trim();
const tursoToken = (process.env.TURSO_AUTH_TOKEN || "").trim();

const dbUrl = (tursoUrl && tursoUrl !== "undefined" && tursoToken && tursoToken !== "undefined")
  ? tursoUrl
  : (process.env.DATABASE_URL || "file:./prisma/dev.db");

const adapter = new PrismaLibSql({ url: dbUrl });
export const prisma = new PrismaClient({ adapter });
