import { prisma } from "@/lib/prisma";

export default async function AdminEnviosPage() {
  const envios = await prisma.envio.findMany({
    include: { operador: true },
    orderBy: { fecha_de_entrega: "asc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Admin — Envíos</h1>

      {envios.length === 0 ? (
        <p className="mt-4 text-gray-400">No hay envíos registrados.</p>
      ) : (
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Pedido</th>
              <th className="p-2 border">Estado</th>
              <th className="p-2 border">Dirección</th>
              <th className="p-2 border">Operador</th>
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
                  {envio.operador ? envio.operador.nombre : "Sin asignar"}
                </td>
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