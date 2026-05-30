"use client";

import { useState } from "react";

const ESTADOS = ["PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  RETIRADO: "Retirado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
};

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "text-yellow-400",
  ASIGNADO: "text-blue-400",
  RETIRADO: "text-orange-400",
  EN_CAMINO: "text-purple-400",
  ENTREGADO: "text-green-400",
};

interface Envio {
  id: string;
  pedido_id: number;
  estado: string;
  direccion: string;
  monto: number;
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
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleBuscar}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition"
        >
          {loading ? "..." : "Buscar"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-center">{error}</p>
      )}

      {envio && (
        <div className="bg-gray-800 rounded-xl p-6 space-y-6 border border-gray-700">
          <div>
            <p className="text-gray-400 text-sm">ID del envío</p>
            <p className="text-white font-mono text-sm">{envio.id}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-3">Estado del envío</p>
            <div className="flex items-center justify-between">
              {ESTADOS.map((estado, index) => (
                <div key={estado} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      index <= estadoIndex
                        ? "bg-blue-500 border-blue-500"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  />
                  <span className={`text-xs ${
                    index === estadoIndex
                      ? ESTADO_COLORS[estado]
                      : index < estadoIndex
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}>
                    {ESTADO_LABELS[estado]}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="h-1 bg-gray-700 rounded" />
              <div
                className="h-1 bg-blue-500 rounded absolute top-0 left-0 transition-all"
                style={{ width: `${(estadoIndex / (ESTADOS.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Dirección</p>
              <p className="text-white">{envio.direccion}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monto</p>
              <p className="text-white">${envio.monto.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fecha estimada</p>
              <p className="text-white">
                {envio.fecha_de_entrega
                  ? new Date(envio.fecha_de_entrega).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pedido</p>
              <p className="text-white">#{envio.pedido_id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}