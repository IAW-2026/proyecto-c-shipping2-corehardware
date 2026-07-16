// Días estimados restantes hasta la entrega, según el estado actual del envío.
// Se recalcula en cada transición para que la estimación sea más precisa
// a medida que el envío avanza.
const DIAS_RESTANTES_POR_ESTADO: Record<string, number> = {
  PENDIENTE: 5,
  ASIGNADO: 4,
  RETIRADO: 2,
  EN_CAMINO: 1,
};

export function calcularFechaEstimada(estado: string): Date | null {
  const dias = DIAS_RESTANTES_POR_ESTADO[estado];
  if (dias === undefined) return null;
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}
