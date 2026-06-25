import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { notificarEnvioCreado, getComprador } from "@/lib/clients/buyer";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("X-API-Key");

  if (apiKey !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { id, comprador_id, vendedor_id, monto } = body;

  if (!id || !comprador_id || !vendedor_id || !monto) {
    return NextResponse.json(
      { message: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  // La doc de Seller no manda la dirección de entrega; la obtenemos de Buyer.
  const comprador = await getComprador(comprador_id);

  const envio = await prisma.envio.create({
    data: {
      pedido_id: id,
      estado: "PENDIENTE",
      direccion: comprador?.direccion ?? "",
      monto,
    },
  });

  // Notificar a Buyer del shipmentID. Si falla, el envío ya está creado:
  // queda log de error para reintento manual; no rompemos la transacción.
  const ok = await notificarEnvioCreado(id, envio.id);
  if (!ok) {
    console.warn(`[shipment] Envío ${envio.id} creado pero notificación a Buyer falló`);
  }

  return NextResponse.json(envio, { status: 201 });
}
