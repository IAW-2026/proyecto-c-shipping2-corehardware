import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const inicio = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: "ok",
      latency_ms: Date.now() - inicio,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[health] DB no responde:", err);
    return NextResponse.json(
      {
        status: "degraded",
        db: "down",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
