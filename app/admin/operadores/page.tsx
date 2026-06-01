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
      <h1 className="text-2xl font-bold mb-6">Admin — Operadores</h1>

      <NuevoOperadorForm />

      {/* Búsqueda */}
      <form method="GET" className="flex gap-2 mb-6">
        <input
          type="text"
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por nombre, apellido o email..."
          className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left text-gray-300">
              <th className="p-3 border border-gray-700">Nombre</th>
              <th className="p-3 border border-gray-700">Email</th>
              <th className="p-3 border border-gray-700">Celular</th>
              <th className="p-3 border border-gray-700">Estado</th>
              <th className="p-3 border border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((op) => (
              <tr key={op.id} className="text-gray-300 hover:bg-gray-800 transition">
                <td className="p-3 border border-gray-700">{op.apellido}, {op.nombre}</td>
                <td className="p-3 border border-gray-700">{op.mail}</td>
                <td className="p-3 border border-gray-700">{op.celular}</td>
                <td className="p-3 border border-gray-700">
                  {op.is_deleted ? "❌ Inactivo" : "✅ Activo"}
                </td>
                <td className="p-3 border border-gray-700">
                  <AccionesOperador id={op.id} isDeleted={op.is_deleted} />
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
            <a
              key={p}
              href={`/admin/operadores?${buscar ? `buscar=${buscar}&` : ""}page=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                pagina === p ? "bg-blue-600 text-white border-blue-600" : "border-gray-600 text-gray-400 hover:text-white"
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