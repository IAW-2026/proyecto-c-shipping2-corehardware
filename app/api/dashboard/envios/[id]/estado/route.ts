import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
  const { id } = await context.params;
  const { estado } = await req.json();

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return NextResponse.json(
      { message: "Estado inválido" },
      { status: 400 }
    );
  }

  const envio = await prisma.envio.update({
    where: { id },
    data: { estado },
  });

  return NextResponse.json(envio, { status: 200 });
}