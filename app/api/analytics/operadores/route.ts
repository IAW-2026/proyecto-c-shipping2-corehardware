import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const offsetParam = searchParams.get("offset");
  const limitParam = searchParams.get("limit");

  const offset = offsetParam !== null && !Number.isNaN(Number(offsetParam)) ? Number(offsetParam) : 0;
  const limit = limitParam !== null && !Number.isNaN(Number(limitParam)) ? Number(limitParam) : undefined;

  const where = {
    is_deleted: false,
    ...(q ? { id: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [operadores, total] = await Promise.all([
    prisma.operador.findMany({
      where,
      orderBy: { apellido: "asc" },
      skip: offset,
      ...(limit !== undefined ? { take: limit } : {}),
      select: {
        id: true,
        nombre: true,
        apellido: true,
        sexo: true,
        direccion: true,
        mail: true,
        celular: true,
        dni: true,
        cuil_cuit: true,
      },
    }),
    prisma.operador.count({ where }),
  ]);

  return NextResponse.json({
    operadores: operadores.map((op) => ({
      id: op.id,
      nombre: op.nombre,
      apellido: op.apellido,
      sexo: op.sexo,
      direccion: op.direccion,
      mail: op.mail,
      celular: op.celular,
      dni: op.dni,
      cuil_cuit: op.cuil_cuit,
    })),
    total,
    offset,
    limit: limit ?? total,
  });
}