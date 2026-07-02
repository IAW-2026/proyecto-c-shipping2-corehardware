import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AsignarOperador from "./AsignarOperador";
import CopyableId from "@/components/CopyableId";

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

  const [envios, total, operadores] = await Promise.all([
    prisma.envio.findMany({
      where,
      include: { operador: true },
      orderBy: { fecha_estimada: "asc" },
      skip,
      take: POR_PAGINA,
    }),
    prisma.envio.count({ where }),
    prisma.operador.findMany({ where: { is_deleted: false }, orderBy: { apellido: "asc" } }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin — Envíos</h1>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link
          href="/admin/envios"
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            !estado ? "bg-cyan-500 text-gray-950 border-cyan-500" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
          }`}
        >
          Todos
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/admin/envios?estado=${e}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              estado === e ? "bg-cyan-500 text-gray-950 border-cyan-500" : "border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
            }`}
          >
            {e}
          </Link>
        ))}
      </div>

      {/* Búsqueda */}
      <form method="GET" className="flex gap-2 mb-6 flex-wrap">
        {estado && <input type="hidden" name="estado" value={estado} />}
        <input
          type="text"
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por dirección u operador..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 placeholder-gray-500"
        />
        <input
          type="date"
          name="fecha"
          defaultValue={fecha}
          className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 px-6 py-2 rounded-lg font-semibold transition"
        >
          Buscar
        </button>
        {(buscar || fecha) && (
          <Link
            href={`/admin/envios${estado ? `?estado=${estado}` : ""}`}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      {envios.length === 0 ? (
        <p className="text-gray-400">No hay envíos con ese criterio.</p>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-left text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3">Operador</th>
                <th className="px-6 py-3">Entrega</th>
                <th className="px-6 py-3">Asignar operador</th>
                <th className="px-6 py-3">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {envios.map((envio) => (
                <tr key={envio.id} className="hover:bg-gray-800 transition text-gray-300">
                  <td className="px-6 py-4"><CopyableId value={envio.id} className="text-cyan-400" /></td>
                  <td className="px-6 py-4"><CopyableId value={envio.pedido_id} prefix="#" align="end" /></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      envio.estado === "ENTREGADO" ? "bg-green-900 text-green-400" :
                      envio.estado === "EN_CAMINO" ? "bg-blue-900 text-blue-400" :
                      envio.estado === "RETIRADO" ? "bg-orange-900 text-orange-400" :
                      envio.estado === "ASIGNADO" ? "bg-cyan-900 text-cyan-400" :
                      "bg-gray-800 text-gray-400"
                    }`}>
                      {envio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">{envio.direccion}</td>
                  <td className="px-6 py-4">
                    {envio.operador ? `${envio.operador.nombre} ${envio.operador.apellido}` : "Sin asignar"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {envio.estado === "ENTREGADO" && envio.fecha_de_entrega
                        ? new Date(envio.fecha_de_entrega).toLocaleDateString("es-AR")
                        : envio.fecha_estimada
                          ? new Date(envio.fecha_estimada).toLocaleDateString("es-AR")
                          : "-"}
                      {envio.estado === "ENTREGADO" && envio.fecha_de_entrega && envio.fecha_estimada && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          envio.fecha_de_entrega.getTime() <= envio.fecha_estimada.getTime()
                            ? "bg-green-900 text-green-400"
                            : "bg-red-900 text-red-400"
                        }`}>
                          {envio.fecha_de_entrega.getTime() <= envio.fecha_estimada.getTime() ? "A tiempo" : "Tardío"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <AsignarOperador
                      envioId={envio.id}
                      operadorActual={envio.operador_id}
                      operadores={operadores}
                      estado={envio.estado}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/envios/${envio.id}`}
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/envios?${estado ? `estado=${estado}&` : ""}page=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                pagina === p ? "bg-cyan-500 text-gray-950 border-cyan-500" : "border-gray-700 text-gray-400 hover:text-white"
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