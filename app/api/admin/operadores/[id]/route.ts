import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { is_deleted } = await req.json();

  const operador = await prisma.operador.update({
    where: { id },
    data: { is_deleted },
  });

  return NextResponse.json(operador, { status: 200 });
}