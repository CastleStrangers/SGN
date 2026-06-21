import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface HealthCheckResponse {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: "ok" | "error";
      responseTime: number;
      error?: string;
    };
    redis?: {
      status: "ok" | "error";
      responseTime: number;
      error?: string;
    };
    api: {
      status: "ok";
      version: string;
    };
  };
}

const startTime = Date.now();

/**
 * Health check endpoint
 * GET /api/health
 * 
 * Returns system health status including:
 * - Database connectivity
 * - Redis connectivity (if configured)
 * - API version
 * - Response times
 */
export async function GET(request: NextRequest) {
  const checks: HealthCheckResponse["checks"] = {
    database: {
      status: "error",
      responseTime: 0,
    },
    api: {
      status: "ok",
      version: "1.0.0",
    },
  };

  let overallStatus: "ok" | "degraded" | "error" = "ok";

  // Check database connectivity
  const dbStart = Date.now();
  try {
    await prisma.user.count({ take: 1 });
    checks.database.status = "ok";
    checks.database.responseTime = Date.now() - dbStart;
  } catch (error) {
    checks.database.status = "error";
    checks.database.responseTime = Date.now() - dbStart;
    checks.database.error = error instanceof Error ? error.message : "Unknown error";
    overallStatus = "error";
  }

  // Check Redis connectivity (if configured)
  if (process.env.REDIS_URL) {
    const redisStart = Date.now();
    try {
      // Import and use Redis client
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN || "",
      });

      await redis.ping();
      checks.redis = {
        status: "ok",
        responseTime: Date.now() - redisStart,
      };
    } catch (error) {
      checks.redis = {
        status: "error",
        responseTime: Date.now() - redisStart,
        error: error instanceof Error ? error.message : "Unknown error",
      };
      overallStatus = "degraded";
    }
  }

  const response: HealthCheckResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  const statusCode = overallStatus === "error" ? 503 : 200;

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Health check with detailed metrics
 * GET /api/health?details=true
 */
export async function HEAD(request: NextRequest) {
  try {
    await prisma.user.count({ take: 1 });
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
