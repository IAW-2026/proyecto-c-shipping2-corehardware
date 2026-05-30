"use client";

import { useState } from "react";

const ESTADOS = [
  "PENDIENTE",
  "ASIGNADO",
  "RETIRADO",
  "EN_CAMINO",
  "ENTREGADO",
];

interface Props {
  envioId: string;
  estadoActual: string;
}

export default function ActualizarEstado({ envioId, estadoActual }: Props) {
  const [estado, setEstado] = useState(estadoActual);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

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
    } else {
      setMensaje("❌ Error al actualizar el estado");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Actualizar Estado</h2>

      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="border p-2 rounded"
      >
        {ESTADOS.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <button
        onClick={handleActualizar}
        disabled={loading}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Actualizar"}
      </button>

      {mensaje && <p className="mt-2">{mensaje}</p>}
    </div>
  );
}