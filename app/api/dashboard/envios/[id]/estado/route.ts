import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireOperador } from "@/lib/auth";

const ESTADOS_VALIDOS = [
  "PENDIENTE",
  "ASIGNADO",
  "RETIRADO",
  "EN_CAMINO",
  "ENTREGADO",
];

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireOperador();
  if (session instanceof NextResponse) return session;

  const { id } = await context.params;
  const { estado } = await req.json();

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json(
      { message: "Estado inválido" },
      { status: 400 }
    );
  }

  const envio = await prisma.envio.findUnique({ where: { id } });
  if (!envio) {
    return NextResponse.json({ message: "Envío no encontrado" }, { status: 404 });
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

  const actualizado = await prisma.envio.update({
    where: { id },
    data: { estado },
  });

  return NextResponse.json(actualizado, { status: 200 });
}
