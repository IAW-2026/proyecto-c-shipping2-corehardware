import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ estado?: string; page?: string; buscar?: string; fecha?: string }>;
}

const ESTADOS = ["PENDIENTE", "ASIGNADO", "RETIRADO", "EN_CAMINO", "ENTREGADO"];
const POR_PAGINA = 5;

export default async function AdminEnviosPage({ searchParams }: Props) {
  const { estado, page, buscar, fecha } = await searchParams;
  const pagina = Number(page) || 1;
  const skip = (pagina - 1) * POR_PAGINA;

  const where: Record<string, unknown> = {};

  if (estado) where.estado = estado;
  if (fecha) where.fecha_de_entrega = new Date(fecha);
  if (buscar) {
    where.OR = [
      { direccion: { contains: buscar, mode: "insensitive" } },
      { operador: { nombre: { contains: buscar, mode: "insensitive" } } },
      { operador: { apellido: { contains: buscar, mode: "insensitive" } } },
    ];
  }

  const [envios, total] = await Promise.all([
    prisma.envio.findMany({
      where,
      include: { operador: true },
      orderBy: { fecha_de_entrega: "asc" },
      skip,
      take: POR_PAGINA,
    }),
    prisma.envio.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin — Envíos</h1>

      {/* Filtro por estado */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/admin/envios"
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            !estado ? "bg-blue-600 text-white border-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
          }`}
        >
          Todos
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/envios?estado=${e}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              estado === e ? "bg-blue-600 text-white border-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
            }`}
          >
            {e}
          </Link>
        ))}
      </div>

      <form method="GET" className="flex gap-2 mb-6 flex-wrap">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <input
          type="text"
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por dirección u operador..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="fecha"
          defaultValue={fecha}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Buscar
        </button>
        {(buscar || fecha) && (
          <a
            href={`/admin/envios${estado ? `?estado=${estado}` : ""}`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            Limpiar
          </a>
        )}
      </form>
      
      {/* Tabla */}
      {envios.length === 0 ? (
        <p className="text-gray-400">No hay envíos con ese estado.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left text-gray-300">
              <th className="p-3 border border-gray-700">ID</th>
              <th className="p-3 border border-gray-700">Pedido</th>
              <th className="p-3 border border-gray-700">Estado</th>
              <th className="p-3 border border-gray-700">Dirección</th>
              <th className="p-3 border border-gray-700">Operador</th>
              <th className="p-3 border border-gray-700">Entrega estimada</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id} className="text-gray-300 hover:bg-gray-800 transition">
                <td className="p-3 border border-gray-700 font-mono text-xs">{envio.id.slice(0, 8)}...</td>
                <td className="p-3 border border-gray-700">#{envio.pedido_id}</td>
                <td className="p-3 border border-gray-700">{envio.estado}</td>
                <td className="p-3 border border-gray-700">{envio.direccion}</td>
                <td className="p-3 border border-gray-700">
                  {envio.operador ? `${envio.operador.nombre} ${envio.operador.apellido}` : "Sin asignar"}
                </td>
                <td className="p-3 border border-gray-700">
                  {envio.fecha_de_entrega
                    ? new Date(envio.fecha_de_entrega).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/envios?${estado ? `estado=${estado}&` : ""}page=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                pagina === p ? "bg-blue-600 text-white border-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">
         Mostrando {skip + 1}–{skip + envios.length} de {total} envíos
      </p>
    </main>
  );
}