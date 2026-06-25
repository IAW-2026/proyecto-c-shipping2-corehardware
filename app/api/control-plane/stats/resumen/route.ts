import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/control-plane/stats/resumen
// Resumen de la app Shipping para dashboards externos (Analytics, Control Plane).
export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [totalEnvios, totalOperadores, operadoresActivos, entregados, enCurso, pendientes] =
    await Promise.all([
      prisma.envio.count(),
      prisma.operador.count(),
      prisma.operador.count({ where: { is_deleted: false } }),
      prisma.envio.count({ where: { estado: "ENTREGADO" } }),
      prisma.envio.count({
        where: { estado: { in: ["ASIGNADO", "RETIRADO", "EN_CAMINO"] } },
      }),
      prisma.envio.count({ where: { estado: "PENDIENTE" } }),
    ]);

  return NextResponse.json({
    envios: {
      total: totalEnvios,
      entregados,
      en_curso: enCurso,
      pendientes,
    },
    operadores: {
      total: totalOperadores,
      activos: operadoresActivos,
      inactivos: totalOperadores - operadoresActivos,
    },
  });
}
