import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireOperador } from "@/lib/auth";
import { actualizarEstadoPedido } from "@/lib/clients/buyer";

const TRANSICIONES: Record<string, string[]> = {
  PENDIENTE: ["ASIGNADO"],
  ASIGNADO: ["RETIRADO"],
  RETIRADO: ["EN_CAMINO"],
  EN_CAMINO: ["ENTREGADO"],
  ENTREGADO: [],
};

// Solo RETIRADO y ENTREGADO tienen un equivalente en el estado del pedido de Buyer.
// PENDIENTE/ASIGNADO son pasos internos de logística que Buyer no necesita ver.
const ESTADO_ENVIO_A_PEDIDO: Record<string, string> = {
  RETIRADO: "EN_CAMINO",
  EN_CAMINO: "EN_CAMINO",
  ENTREGADO: "ENTREGADO",
};

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireOperador();
  if (session instanceof NextResponse) return session;

  const { id } = await context.params;
  const { estado } = await req.json();

  if (!TRANSICIONES[estado]) {
    return NextResponse.json({ message: "Estado inválido" }, { status: 400 });
  }

  const envio = await prisma.envio.findUnique({ where: { id } });
  if (!envio) {
    return NextResponse.json({ message: "Envío no encontrado" }, { status: 404 });
  }

  const transicionesPermitidas = TRANSICIONES[envio.estado] ?? [];
  if (!transicionesPermitidas.includes(estado)) {
    return NextResponse.json(
      {
        message: `Transición inválida: ${envio.estado} → ${estado}. ` +
          `Permitidas: ${transicionesPermitidas.join(", ") || "ninguna"}`,
      },
      { status: 400 }
    );
  }

  if (session.role !== "admin") {
    const operador = await prisma.operador.findUnique({
      where: { clerk_user_id: session.userId },
    });
    if (!operador || envio.operador_id !== operador.id) {
      return NextResponse.json(
        { message: "No tenés permiso para modificar este envío" },
        { status: 403 }
      );
    }
  }

  const data: { estado: string; fecha_de_entrega?: Date } = { estado };
  if (estado === "ENTREGADO" && !envio.fecha_de_entrega) {
    data.fecha_de_entrega = new Date();
  }

  const actualizado = await prisma.envio.update({ where: { id }, data });

  const estadoPedido = ESTADO_ENVIO_A_PEDIDO[estado];
  if (estadoPedido) {
    const ok = await actualizarEstadoPedido(envio.pedido_id, estadoPedido);
    if (!ok) {
      console.warn(`[estado] Envío ${id} actualizado pero no se pudo notificar a Buyer`);
    }
  }

  return NextResponse.json(actualizado, { status: 200 });
}
