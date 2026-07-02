"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  envioId: string;
  estadoActual: string;
}

export default function ActualizarEstado({ envioId, estadoActual }: Props) {
  const [estado, setEstado] = useState(estadoActual);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  async function handleActualizar() {
    setLoading(true);
    setMensaje("");

    const res = await fetch(`/api/dashboard/envios/${envioId}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });

    if (res.ok) {
      setMensaje("✅ Estado actualizado correctamente");
      router.refresh();
    } else {
      setMensaje("❌ Error al actualizar el estado");
    }

    setLoading(false);
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

  const estadosSiguientes = TRANSICIONES[estadoActual] || [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Actualizar Estado</h2>

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        disabled={estadosSiguientes.length === 0}
        className="border p-2 rounded bg-gray-800 text-white border-gray-600"
      >
        <option value={estadoActual}>{estadoActual}</option>
        {estadosSiguientes.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <button
        onClick={handleActualizar}
        disabled={loading || estadosSiguientes.length === 0}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Guardando..." : estadosSiguientes.length === 0 ? "Entregado" : "Actualizar"}
      </button>

      {mensaje && <p className="mt-2">{mensaje}</p>}
    </div>
  );
}