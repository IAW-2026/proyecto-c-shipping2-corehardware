import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const grupos = await prisma.envio.groupBy({
    by: ["estado"],
    _count: { _all: true },
  });

  const total = grupos.reduce((acc, g) => acc + g._count._all, 0);

  return NextResponse.json({
    total,
    por_estado: grupos.map((g) => ({
      estado: g.estado,
      cantidad: g._count._all,
    })),
  });
}
