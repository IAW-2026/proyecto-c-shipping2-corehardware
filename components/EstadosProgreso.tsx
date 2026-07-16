interface Props {
  estadoActual: string;
}

const PASOS = [
  { key: "PENDIENTE", label: "Pendiente" },
  { key: "ASIGNADO", label: "Asignado" },
  { key: "RETIRADO", label: "Retirado" },
  { key: "EN_CAMINO", label: "En camino" },
  { key: "ENTREGADO", label: "Entregado" },
];

export default function EstadosProgreso({ estadoActual }: Props) {
  const indexActual = PASOS.findIndex((p) => p.key === estadoActual);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2">
        {PASOS.map((paso, i) => {
          const completado = i < indexActual;
          const actual = i === indexActual;
          return (
            <div key={paso.key} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center text-[10px] ${
                  completado
                    ? "bg-cyan-500 border-cyan-500 text-gray-950"
                    : actual
                      ? "bg-cyan-500 border-cyan-500 text-gray-950 ring-4 ring-cyan-500/30"
                      : "bg-gray-800 border-gray-600 text-gray-500"
                }`}
              >
                {completado ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs text-center truncate w-full ${
                  actual
                    ? "text-cyan-400 font-semibold"
                    : completado
                      ? "text-gray-300"
                      : "text-gray-600"
                }`}
              >
                {paso.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-1">
        <div className="h-1 bg-gray-700 rounded" />
        <div
          className="h-1 bg-cyan-500 rounded absolute top-0 left-0 transition-all"
          style={{
            width: indexActual >= 0 ? `${(indexActual / (PASOS.length - 1)) * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}
