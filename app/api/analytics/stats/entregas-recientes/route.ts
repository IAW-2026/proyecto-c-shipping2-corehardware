import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
