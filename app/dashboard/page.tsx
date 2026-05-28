import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Pedido</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Dirección</th>
              <th className="p-2 border">Entrega estimada</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((envio) => (
              <tr key={envio.id} className="hover:bg-gray-50">
                <td className="p-2 border">{envio.id}</td>
                <td className="p-2 border">{envio.pedido_id}</td>
                <td className="p-2 border">{envio.estado}</td>
                <td className="p-2 border">{envio.direccion}</td>
                <td className="p-2 border">
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