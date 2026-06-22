import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/control-plane/envios/{id}
// Body: { operador_id: string | null }
// Asigna o desasigna un operador a un envío.
// Auto-actualiza el estado: ASIGNADO si se asigna, PENDIENTE si se desasigna.
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const operador_id: string | null = body.operador_id ?? null;

  const envio = await prisma.envio.findUnique({ where: { id } });
  if (!envio) {
    return NextResponse.json({ message: "Envío no encontrado" }, { status: 404 });
  }

  if (operador_id) {
    const operador = await prisma.operador.findUnique({ where: { id: operador_id } });
    if (!operador || operador.is_deleted) {
      return NextResponse.json(
        { message: "Operador no encontrado o dado de baja" },
        { status: 400 }
      );
    }
  }

  const actualizado = await prisma.envio.update({
    where: { id },
    data: {
      operador_id,
      estado: operador_id ? (envio.estado === "PENDIENTE" ? "ASIGNADO" : envio.estado) : "PENDIENTE",
    },
  });

  return NextResponse.json(actualizado);
}
