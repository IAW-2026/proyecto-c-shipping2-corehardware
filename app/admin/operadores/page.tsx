import { prisma } from "@/lib/prisma";

export default async function AdminOperadoresPage() {
  const operadores = await prisma.operador.findMany({
    orderBy: { apellido: "asc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin — Operadores</h1>

      {operadores.length === 0 ? (
        <p className="mt-4 text-gray-400">No hay operadores registrados.</p>
      ) : (
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Celular</th>
              <th className="p-2 border">Activo</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((op) => (
              <tr key={op.id} className="hover:bg-gray-50">
                <td className="p-2 border">{op.apellido}, {op.nombre}</td>
                <td className="p-2 border">{op.mail}</td>
                <td className="p-2 border">{op.celular}</td>
                <td className="p-2 border">
                  {op.is_deleted ? "❌" : "✅"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}