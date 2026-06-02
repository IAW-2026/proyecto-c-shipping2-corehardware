import { prisma } from "@/lib/prisma";
import AccionesOperador from "./AccionesOperador";
import NuevoOperadorForm from "./NuevoOperadorForm";

interface Props {
  searchParams: Promise<{ buscar?: string; page?: string }>;
}

const POR_PAGINA = 5;

export default async function AdminOperadoresPage({ searchParams }: Props) {
  const { buscar, page } = await searchParams;
  const pagina = Number(page) || 1;
  const skip = (pagina - 1) * POR_PAGINA;

  const where = buscar
    ? {
        OR: [
          { nombre: { contains: buscar, mode: "insensitive" as const } },
          { apellido: { contains: buscar, mode: "insensitive" as const } },
          { mail: { contains: buscar, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [operadores, total] = await Promise.all([
    prisma.operador.findMany({
      where,
      orderBy: { apellido: "asc" },
      skip,
      take: POR_PAGINA,
    }),
    prisma.operador.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin — Operadores</h1>
      </div>

      <NuevoOperadorForm />

      {/* Búsqueda */}
      <form method="GET" className="flex gap-2 mb-6">
        <input
          type="text"
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por nombre, apellido o email..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 px-6 py-2 rounded-lg font-semibold transition"
        >
          Buscar
        </button>
        {buscar && (
          <a
            href="/admin/operadores"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
          >
            Limpiar
          </a>
        )}
      </form>

      {/* Tabla */}
      {operadores.length === 0 ? (
        <p className="text-gray-400">No se encontraron operadores.</p>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-left text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Celular</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {operadores.map((op) => (
                <tr key={op.id} className="hover:bg-gray-800 transition text-gray-300">
                  <td className="px-6 py-4">{op.apellido}, {op.nombre}</td>
                  <td className="px-6 py-4">{op.mail}</td>
                  <td className="px-6 py-4">{op.celular}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      op.is_deleted ? "bg-red-900 text-red-400" : "bg-green-900 text-green-400"
                    }`}>
                      {op.is_deleted ? "Inactivo" : "Activo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <AccionesOperador id={op.id} isDeleted={op.is_deleted} />
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
            <a
              key={p}
              href={`/admin/operadores?${buscar ? `buscar=${buscar}&` : ""}page=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                pagina === p ? "bg-cyan-500 text-gray-950 border-cyan-500" : "border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}

      <p className="text-gray-500 text-sm mt-4">
        Mostrando {skip + 1}–{skip + operadores.length} de {total} operadores
      </p>
    </main>
  );
}