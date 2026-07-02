"use client";

import { useState } from "react";
import CopyableId from "@/components/CopyableId";

const ESTADOS = ["PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  RETIRADO: "Retirado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
};

interface Envio {
  id: string;
  pedido_id: string;
  estado: string;
  direccion: string;
  monto: number;
  fecha_estimada: string | null;
  fecha_de_entrega: string | null;
}

export default function TrackingSearch() {
  const [query, setQuery] = useState("");
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBuscar() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setEnvio(null);

    const res = await fetch(`/api/tracking/${query.trim()}`);

    if (res.ok) {
      const data = await res.json();
      setEnvio(data);
    } else {
      setError("No se encontró ningún envío con ese ID.");
    }

    setLoading(false);
  }

  const estadoIndex = envio ? ESTADOS.indexOf(envio.estado) : -1;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          placeholder="Ingresá el ID de tu envío..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder-gray-500"
        />
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {loading ? "..." : "Buscar"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-center">{error}</p>
      )}

      {envio && (
        <div className="bg-gray-900 rounded-xl p-6 space-y-6 border border-gray-700">
          <div>
            <p className="text-gray-400 text-sm">ID del envío</p>
            <CopyableId value={envio.id} truncate={envio.id.length} className="text-cyan-400" />
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">Progreso del envío</p>
            <div className="flex items-start justify-between mb-2">
              {ESTADOS.map((estado, index) => (
                <div key={estado} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      index <= estadoIndex
                        ? "bg-cyan-500 border-cyan-500"
                        : "bg-gray-800 border-gray-600"
                    }`}
                  />
                  <span className={`text-xs text-center ${
                    index === estadoIndex
                      ? "text-cyan-400 font-semibold"
                      : index < estadoIndex
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}>
                    {ESTADO_LABELS[estado]}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-1">
              <div className="h-1 bg-gray-700 rounded" />
              <div
                className="h-1 bg-cyan-500 rounded absolute top-0 left-0 transition-all"
                style={{ width: `${(estadoIndex / (ESTADOS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-gray-400 text-sm">Dirección</p>
              <p className="text-white">{envio.direccion}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monto</p>
              <p className="text-white">${envio.monto.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {envio.estado === "ENTREGADO" ? "Entregado el" : "Fecha estimada"}
              </p>
              <p className="text-white">
                {envio.estado === "ENTREGADO" && envio.fecha_de_entrega
                  ? new Date(envio.fecha_de_entrega).toLocaleDateString("es-AR")
                  : envio.fecha_estimada
                    ? new Date(envio.fecha_estimada).toLocaleDateString("es-AR")
                    : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pedido</p>
              <CopyableId value={envio.pedido_id} prefix="#" truncate={12} align="end" className="text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}