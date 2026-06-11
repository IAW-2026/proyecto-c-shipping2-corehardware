import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const envio = await prisma.envio.findUnique({
    where: { id },
  });

  if (!envio) {
    return NextResponse.json(
      { message: "Envío no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: envio.id,
    pedido_id: envio.pedido_id,
    estado: envio.estado,
    direccion: envio.direccion,
    monto: envio.monto,
    fecha_de_entrega: envio.fecha_de_entrega,
  });
}