import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const { id } = await context.params;
  const { is_deleted } = await req.json();

  const operador = await prisma.operador.update({
    where: { id },
    data: { is_deleted },
  });

  return NextResponse.json(operador, { status: 200 });
}
