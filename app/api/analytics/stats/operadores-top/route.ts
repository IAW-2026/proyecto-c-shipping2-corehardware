import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const grupos = await prisma.envio.groupBy({
    by: ["operador_id"],
    where: { estado: "ENTREGADO", operador_id: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { operador_id: "desc" } },
    take: 10,
  });

  const operadorIds = grupos
    .map((g) => g.operador_id)
    .filter((id): id is string => id !== null);

  const operadores = await prisma.operador.findMany({
    where: { id: { in: operadorIds } },
    select: { id: true, nombre: true, apellido: true, mail: true },
  });

  const indice = new Map(operadores.map((o) => [o.id, o]));

  return NextResponse.json(
    grupos.map((g) => {
      const op = g.operador_id ? indice.get(g.operador_id) : null;
      return {
        operador_id: g.operador_id,
        nombre: op ? `${op.nombre} ${op.apellido}` : "Desconocido",
        mail: op?.mail ?? null,
        envios_entregados: g._count._all,
      };
    })
  );
}
