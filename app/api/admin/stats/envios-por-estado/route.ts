import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

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
