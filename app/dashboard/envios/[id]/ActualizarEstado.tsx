"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  envioId: string;
  estadoActual: string;
}

// PENDIENTE → ASIGNADO no es una transición manual: se setea automáticamente
// al asignar un operador desde /admin/envios.
const TRANSICIONES: Record<string, string[]> = {
  PENDIENTE: [],
  ASIGNADO: ["RETIRADO"],
  RETIRADO: ["EN_CAMINO"],
  EN_CAMINO: ["ENTREGADO"],
  ENTREGADO: [],
};

const LABEL_ACCION: Record<string, { texto: string; descripcion: string; color: string }> = {
  RETIRADO: {
    texto: "Marcar como retirado",
    descripcion: "El envío fue retirado del vendedor y está en el depósito.",
    color: "bg-orange-600 hover:bg-orange-500",
  },
  EN_CAMINO: {
    texto: "Marcar en camino",
    descripcion: "El envío salió a reparto hacia el domicilio del comprador.",
    color: "bg-blue-600 hover:bg-blue-500",
  },
  ENTREGADO: {
    texto: "Marcar como entregado",
    descripcion: "El envío fue entregado al comprador. Esta acción no se puede deshacer.",
    color: "bg-green-600 hover:bg-green-500",
  },
};

export default function ActualizarEstado({ envioId, estadoActual }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const router = useRouter();

  const estadosSiguientes = TRANSICIONES[estadoActual] ?? [];

  async function handleActualizar(nuevoEstado: string) {
    // Confirmación explícita para acciones irreversibles.
    if (nuevoEstado === "ENTREGADO") {
      const ok = window.confirm(
        "¿Confirmás que este envío fue entregado? Una vez marcado como entregado, no vas a poder revertir el estado."
      );
      if (!ok) return;
    }

    setLoading(nuevoEstado);
    setMensaje(null);

    try {
      const res = await fetch(`/api/dashboard/envios/${envioId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setMensaje({ tipo: "ok", texto: "Estado actualizado correctamente" });
        router.refresh();
      } else {
        // Mostrar el mensaje real del backend en vez de un genérico.
        let detalle = `Error ${res.status}`;
        try {
          const body = await res.json();
          if (body?.message) detalle = body.message;
        } catch {
          // respuesta no era JSON, dejar el genérico
        }
        setMensaje({ tipo: "err", texto: detalle });
      }
    } catch (err) {
      setMensaje({
        tipo: "err",
        texto: err instanceof Error ? err.message : "Error de red al actualizar",
      });
    } finally {
      setLoading(null);
    }
  }

  if (estadosSiguientes.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        {estadoActual === "ENTREGADO"
          ? "Este envío ya fue entregado. No hay acciones disponibles."
          : "Este envío está pendiente de que un admin lo asigne a un operador."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {estadosSiguientes.map((next) => {
        const cfg = LABEL_ACCION[next];
        const isLoading = loading === next;
        return (
          <div key={next} className="space-y-1">
            <button
              onClick={() => handleActualizar(next)}
              disabled={loading !== null}
              className={`w-full text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${cfg.color}`}
            >
              {isLoading ? "Guardando..." : cfg.texto}
            </button>
            <p className="text-xs text-gray-500 px-1">{cfg.descripcion}</p>
          </div>
        );
      })}

      {mensaje && (
        <p
          className={`text-sm mt-2 ${
            mensaje.tipo === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}
