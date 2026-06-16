import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const [totalEnvios, totalOperadores, operadoresActivos, entregados, enCurso, pendientes] =
    await Promise.all([
      prisma.envio.count(),
      prisma.operador.count(),
      prisma.operador.count({ where: { is_deleted: false } }),
      prisma.envio.count({ where: { estado: "ENTREGADO" } }),
      prisma.envio.count({ where: { estado: { in: ["ASIGNADO", "RETIRADO", "EN_CAMINO"] } } }),
      prisma.envio.count({ where: { estado: "PENDIENTE" } }),
    ]);

  return NextResponse.json({
    envios: { total: totalEnvios, entregados, en_curso: enCurso, pendientes },
    operadores: { total: totalOperadores, activos: operadoresActivos, inactivos: totalOperadores - operadoresActivos },
  });
}
