import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const operador = await prisma.operador.findUnique({
    where: { clerk_user_id: userId },
  });

  if (!operador) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Panel del Operador</h1>
        <p className="mt-4 text-red-500">
          Tu usuario no está registrado como operador.
        </p>
      </main>
    );
  }

  const envios = await prisma.envio.findMany({
    where: { operador_id: operador.id },
    orderBy: { fecha_de_entrega: "asc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Panel del Operador</h1>
      <p className="mt-2 text-gray-500">Bienvenido, {operador.nombre}</p>

      <h2 className="mt-6 text-xl font-semibold">Mis envíos</h2>

      {envios.length === 0 ? (
        <p className="mt-4 text-gray-400">No tenés envíos asignados.</p>
      ) : (
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left text-gray-300">
              <th className="p-3 border border-gray-700">ID</th>
              <th className="p-3 border border-gray-700">Pedido</th>
              <th className="p-3 border border-gray-700">Estado</th>
              <th className="p-3 border border-gray-700">Dirección</th>
              <th className="p-3 border border-gray-700">Entrega estimada</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id} className="text-gray-300 hover:bg-gray-800 transition">
                <td className="p-3 border border-gray-700">
                  <Link
                    href={`/dashboard/envios/${envio.id}`}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {envio.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="p-3 border border-gray-700">{envio.pedido_id}</td>
                <td className="p-3 border border-gray-700">{envio.estado}</td>
                <td className="p-3 border border-gray-700">{envio.direccion}</td>
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
    </main>
  );
}