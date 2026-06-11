import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function verificarApiKey(req: NextRequest) {
  const apiKey = req.headers.get("X-API-Key");
  return apiKey === process.env.SHIPPING_API_KEY;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  if (!verificarApiKey(req)) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const envio = await prisma.envio.findUnique({
    where: { id },
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