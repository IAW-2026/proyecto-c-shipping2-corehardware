import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = req.headers.get("X-API-Key");

  if (apiKey !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const envio = await prisma.envio.findUnique({
    where: { id: params.id },
    include: { operador: true },
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
    fecha_de_entrega: envio.fecha_de_entrega,
    estado: envio.estado,
    monto: envio.monto,
    direccion: envio.direccion,
  }, { status: 200 });
}