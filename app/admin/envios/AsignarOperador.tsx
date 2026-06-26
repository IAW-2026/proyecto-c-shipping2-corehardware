"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Operador {
  id: string;
  nombre: string;
  apellido: string;
}

interface Props {
  envioId: string;
  operadorActual: string | null;
  operadores: Operador[];
  estado: string;
}

export default function AsignarOperador({ envioId, operadorActual, operadores, estado }: Props) {
  const [operadorId, setOperadorId] = useState(operadorActual || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const puedeAsignar = estado === "PENDIENTE" || estado === "ASIGNADO";

  async function handleAsignar() {
    setLoading(true);
    await fetch(`/api/admin/envios/${envioId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operador_id: operadorId || null }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        disabled={!puedeAsignar}
        value={operadorId}
        onChange={(e) => setOperadorId(e.target.value)}
        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
      >
        <option value="">Sin asignar</option>
        {operadores.map((op) => (
          <option key={op.id} value={op.id}>
            {op.apellido}, {op.nombre}
          </option>
        ))}
      </select>
      <button
        disabled={loading || !puedeAsignar}
        onClick={handleAsignar}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {loading ? "..." : "Asignar"}
      </button>
    </div>
  );
}