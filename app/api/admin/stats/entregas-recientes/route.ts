import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Volumen de entregas por ventana temporal (últimos 7, 30, 90 días)
// segun fecha_de_entrega registrada.
export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const ahora = new Date();
  const desde = (dias: number) => new Date(ahora.getTime() - dias * 86_400_000);

  const [ultimos7, ultimos30, ultimos90] = await Promise.all([
    prisma.envio.count({
      where: { estado: "ENTREGADO", fecha_de_entrega: { gte: desde(7) } },
    }),
    prisma.envio.count({
      where: { estado: "ENTREGADO", fecha_de_entrega: { gte: desde(30) } },
    }),
    prisma.envio.count({
      where: { estado: "ENTREGADO", fecha_de_entrega: { gte: desde(90) } },
    }),
  ]);

  return NextResponse.json({
    entregas: {
      ultimos_7_dias: ultimos7,
      ultimos_30_dias: ultimos30,
      ultimos_90_dias: ultimos90,
    },
  });
}
