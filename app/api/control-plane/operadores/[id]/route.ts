import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/control-plane/operadores/{id}
// Body: { is_deleted: boolean }
// Activa o desactiva (soft delete) un operador.
//
// Al DESACTIVAR, libera todos sus envíos que no estén ENTREGADO:
//   - operador_id → null
//   - estado → PENDIENTE
// Los envíos ENTREGADO quedan intactos (preserva historial de quién entregó qué).
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  if (typeof body.is_deleted !== "boolean") {
    return NextResponse.json(
      { message: "Campo 'is_deleted' requerido (boolean)" },
      { status: 400 }
    );
  }

  const operador = await prisma.operador.findUnique({ where: { id } });
  if (!operador) {
    return NextResponse.json({ message: "Operador no encontrado" }, { status: 404 });
  }

  // Transacción: actualiza el operador y libera sus envíos pendientes/en curso
  // si se desactiva. Si se reactiva, no toca envíos.
  const [actualizado, envios_liberados] = await prisma.$transaction(async (tx) => {
    const op = await tx.operador.update({
      where: { id },
      data: { is_deleted: body.is_deleted },
    });

    let liberados = 0;
    if (body.is_deleted) {
      const result = await tx.envio.updateMany({
        where: {
          operador_id: id,
          estado: { not: "ENTREGADO" },
        },
        data: {
          operador_id: null,
          estado: "PENDIENTE",
        },
      });
      liberados = result.count;
    }

    return [op, liberados];
  });

  return NextResponse.json({
    id: actualizado.id,
    nombre: actualizado.nombre,
    apellido: actualizado.apellido,
    is_deleted: actualizado.is_deleted,
    envios_liberados,
  });
}
