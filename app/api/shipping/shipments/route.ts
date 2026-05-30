import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("X-API-Key");

  if (apiKey !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { orden_id, comprador_id, vendedor_id, direccion_origen, direccion_destino, monto } = body;

  if (!orden_id || !comprador_id || !vendedor_id || !direccion_destino || !monto) {
    return NextResponse.json(
      { message: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  const envio = await prisma.envio.create({
    data: {
      pedido_id: orden_id,
      estado: "PENDIENTE",
      direccion: direccion_destino,
      monto,
    },
  });

  return NextResponse.json(envio, { status: 201 });
}