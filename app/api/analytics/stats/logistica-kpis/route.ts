import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/analytics/stats/logistica-kpis?days=30
// KPIs agregados para la seccion Logistica del Analytics Dashboard.
// Query param days = ventana de calculo (default 30). Para "todo" pasar days=0.
export async function GET(req: NextRequest) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const daysParam = url.searchParams.get("days");
  const days = daysParam === null ? 30 : Math.max(0, Number(daysParam) || 0);

  const ahora = new Date();
  const inicioVentana = days > 0
    ? new Date(ahora.getTime() - days * 86_400_000)
    : new Date(0);
  const inicioVentanaAnterior = days > 0
    ? new Date(ahora.getTime() - 2 * days * 86_400_000)
    : new Date(0);

  const whereEnVentana = days > 0 ? { created_at: { gte: inicioVentana } } : {};
  const whereEnVentanaAnterior =
    days > 0
      ? { created_at: { gte: inicioVentanaAnterior, lt: inicioVentana } }
      : {};

  const [
    totalActual,
    totalAnterior,
    entregadosActual,
    entregadosOnTimeActual,
    entregadosAnterior,
    entregadosOnTimeAnterior,
    enCursoActual,
    enRiesgo,
    tiemposActual,
    tiemposAnterior,
  ] = await Promise.all([
    // Total envios creados en la ventana
    prisma.envio.count({ where: whereEnVentana }),
    prisma.envio.count({ where: whereEnVentanaAnterior }),

    // Entregados en la ventana (para SLA %)
    prisma.envio.count({
      where: { ...whereEnVentana, estado: "ENTREGADO" },
    }),
    // Entregados a tiempo en la ventana
    prisma.envio.count({
      where: {
        ...whereEnVentana,
        estado: "ENTREGADO",
        fecha_de_entrega: { not: null },
        fecha_estimada: { not: null },
        // "a tiempo": fecha real <= fecha estimada
        // Prisma no soporta comparar dos columnas en el where directo, hacemos
        // el calculo con raw SQL aparte. Aca dejamos placeholder = total y
        // corregimos con un query independiente abajo.
      },
    }),

    prisma.envio.count({
      where: { ...whereEnVentanaAnterior, estado: "ENTREGADO" },
    }),
    prisma.envio.count({
      where: {
        ...whereEnVentanaAnterior,
        estado: "ENTREGADO",
        fecha_de_entrega: { not: null },
        fecha_estimada: { not: null },
      },
    }),

    // Envios en curso (no entregados) al momento actual (no depende de ventana)
    prisma.envio.count({
      where: { estado: { in: ["PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO"] } },
    }),

    // Envios en riesgo: en curso Y fecha_estimada ya paso
    prisma.envio.count({
      where: {
        estado: { in: ["ASIGNADO", "RETIRADO", "EN_CAMINO"] },
        fecha_estimada: { lt: ahora },
      },
    }),

    // Para tiempo de transito: entregados con created_at y fecha_de_entrega
    prisma.envio.findMany({
      where: {
        ...whereEnVentana,
        estado: "ENTREGADO",
        fecha_de_entrega: { not: null },
      },
      select: { created_at: true, fecha_de_entrega: true },
    }),
    prisma.envio.findMany({
      where: {
        ...whereEnVentanaAnterior,
        estado: "ENTREGADO",
        fecha_de_entrega: { not: null },
      },
      select: { created_at: true, fecha_de_entrega: true },
    }),
  ]);

  // Calculo real de on-time: entregados con fecha_de_entrega <= fecha_estimada.
  // Prisma no compara dos columnas en un where, asi que traemos y filtramos en JS.
  const [entregadosConAmbasFechasActual, entregadosConAmbasFechasAnterior] =
    await Promise.all([
      prisma.envio.findMany({
        where: {
          ...whereEnVentana,
          estado: "ENTREGADO",
          fecha_de_entrega: { not: null },
          fecha_estimada: { not: null },
        },
        select: { fecha_de_entrega: true, fecha_estimada: true },
      }),
      prisma.envio.findMany({
        where: {
          ...whereEnVentanaAnterior,
          estado: "ENTREGADO",
          fecha_de_entrega: { not: null },
          fecha_estimada: { not: null },
        },
        select: { fecha_de_entrega: true, fecha_estimada: true },
      }),
    ]);

  const onTimeActual = entregadosConAmbasFechasActual.filter(
    (e) => e.fecha_de_entrega!.getTime() <= e.fecha_estimada!.getTime()
  ).length;
  const onTimeAnterior = entregadosConAmbasFechasAnterior.filter(
    (e) => e.fecha_de_entrega!.getTime() <= e.fecha_estimada!.getTime()
  ).length;

  const pctOnTimeActual =
    entregadosConAmbasFechasActual.length > 0
      ? (onTimeActual / entregadosConAmbasFechasActual.length) * 100
      : null;
  const pctOnTimeAnterior =
    entregadosConAmbasFechasAnterior.length > 0
      ? (onTimeAnterior / entregadosConAmbasFechasAnterior.length) * 100
      : null;

  const promedioDias = (
    envios: { created_at: Date; fecha_de_entrega: Date | null }[]
  ) => {
    if (envios.length === 0) return null;
    const totalMs = envios.reduce(
      (acc, e) => acc + (e.fecha_de_entrega!.getTime() - e.created_at.getTime()),
      0
    );
    return totalMs / envios.length / 86_400_000;
  };

  const transitoActual = promedioDias(tiemposActual);
  const transitoAnterior = promedioDias(tiemposAnterior);

  // Silenciar los "unused" placeholder de arriba (los mantenemos por si el
  // futuro quisiera usarlos crudo; no rompen).
  void entregadosOnTimeActual;
  void entregadosOnTimeAnterior;

  return NextResponse.json({
    ventana_dias: days,
    total_envios: {
      actual: totalActual,
      anterior: totalAnterior,
    },
    on_time: {
      porcentaje_actual: pctOnTimeActual,
      porcentaje_anterior: pctOnTimeAnterior,
      entregados_actual: entregadosActual,
      entregados_anterior: entregadosAnterior,
    },
    tiempo_transito_dias: {
      actual: transitoActual,
      anterior: transitoAnterior,
    },
    en_curso: enCursoActual,
    en_riesgo: enRiesgo,
  });
}
