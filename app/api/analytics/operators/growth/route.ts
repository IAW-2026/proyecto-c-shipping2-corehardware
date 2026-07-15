import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/analytics/operators/growth?from=YYYY-MM-DD&to=YYYY-MM-DD
// Contrato acordado con Yanina para uniformar los 3 servicios (Buyer, Seller, Shipping).
// Devuelve una serie temporal con la cantidad de operadores creados por día en el rango.
// Los días sin altas devuelven cantidad: 0 (serie completa, no salteada).
async function getOperadorGrowthForRange(from: Date, to: Date) {
  const operadores = await prisma.operador.findMany({
    where: {
      is_deleted: false,
      created_at: { gte: from, lte: to },
    },
    select: { created_at: true },
  });

  const countsByDay = new Map<string, number>();
  for (const o of operadores) {
    const dayKey = o.created_at.toISOString().slice(0, 10);
    countsByDay.set(dayKey, (countsByDay.get(dayKey) ?? 0) + 1);
  }

  const result: { fecha: string; cantidad: number }[] = [];
  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(0, 0, 0, 0);

  while (cursor.getTime() <= end.getTime()) {
    const dayKey = cursor.toISOString().slice(0, 10);
    result.push({ fecha: dayKey, cantidad: countsByDay.get(dayKey) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}

export async function GET(request: NextRequest) {
  if (request.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Acceso no autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json(
      { message: "Parámetros from y to son requeridos (formato YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return NextResponse.json(
        { message: "Fechas inválidas (formato esperado YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    // IMPORTANTE: sin esto, un operador creado hoy despues de las 00:00 UTC
    // queda afuera del filtro cuando to=hoy (bug que ya paso en Seller).
    toDate.setUTCHours(23, 59, 59, 999);

    const growth = await getOperadorGrowthForRange(fromDate, toDate);
    return NextResponse.json({ total: growth.length, items: growth }, { status: 200 });
  } catch (e) {
    console.error("[/api/analytics/operators/growth]", e);
    return NextResponse.json(
      { message: "Error interno del servidor. No se pudo obtener el crecimiento de operadores." },
      { status: 500 }
    );
  }
}
