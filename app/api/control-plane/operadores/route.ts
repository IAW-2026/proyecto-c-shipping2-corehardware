import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint dedicado para el Control Plane.
// Autenticación: X-API-Key === SHIPPING_API_KEY.
// Retorna listado de operadores. Incluye los soft-deleted: el Control Plane
// decide si mostrarlos o no según su filtro.
//
// Para cada operador devuelve dos contadores:
//   - total_envios: todos los envíos asignados (cualquier estado)
//   - envios_activos: envíos no entregados (PENDIENTE..EN_CAMINO)
export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const operadores = await prisma.operador.findMany({
    take: 200,
    orderBy: { apellido: "asc" },
    select: {
      id: true,
      clerk_user_id: true,
      nombre: true,
      apellido: true,
      mail: true,
      celular: true,
      dni: true,
      is_deleted: true,
      envios: { select: { id: true, estado: true } },
    },
  });

  return NextResponse.json({
    total: operadores.length,
    items: operadores.map((op) => ({
      id: op.id,
      nombre: op.nombre,
      apellido: op.apellido,
      mail: op.mail,
      celular: op.celular,
      dni: op.dni,
      is_deleted: op.is_deleted,
      total_envios: op.envios.length,
      envios_activos: op.envios.filter((e) => e.estado !== "ENTREGADO").length,
    })),
  });
}
