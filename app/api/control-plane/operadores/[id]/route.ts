import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// PATCH /api/control-plane/operadores/{id}
// Body: { is_deleted: boolean }
// Activa o desactiva (soft delete) un operador.
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

  const actualizado = await prisma.operador.update({
    where: { id },
    data: { is_deleted: body.is_deleted },
  });

  return NextResponse.json({
    id: actualizado.id,
    nombre: actualizado.nombre,
    apellido: actualizado.apellido,
    is_deleted: actualizado.is_deleted,
  });
}
