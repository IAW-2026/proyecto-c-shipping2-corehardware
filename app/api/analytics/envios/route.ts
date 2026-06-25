import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint dedicado para el Control Plane.
// Autenticación: X-API-Key === SHIPPING_API_KEY.
// Retorna listado de envíos con datos del operador asignado.
export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const envios = await prisma.envio.findMany({
    take: 200,
    orderBy: { fecha_de_entrega: "desc" },
    include: {
      operador: {
        select: { id: true, nombre: true, apellido: true, mail: true },
      },
    },
  });

  return NextResponse.json({
    total: envios.length,
    items: envios.map((e) => ({
      id: e.id,
      pedido_id: e.pedido_id,
      estado: e.estado,
      direccion: e.direccion,
      monto: e.monto,
      fecha_de_entrega: e.fecha_de_entrega,
      operador: e.operador
        ? {
            id: e.operador.id,
            nombre: `${e.operador.nombre} ${e.operador.apellido}`,
            mail: e.operador.mail,
          }
        : null,
    })),
  });
}
