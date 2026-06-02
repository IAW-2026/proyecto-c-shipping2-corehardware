import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { operador_id } = await req.json();

  const envio = await prisma.envio.update({
    where: { id },
    data: { 
      operador_id: operador_id || null,
      estado: operador_id ? "ASIGNADO" : "PENDIENTE"
    },
  });

  return NextResponse.json(envio, { status: 200 });
}