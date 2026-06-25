import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import CopyableId from "@/components/CopyableId";

export const dynamic = "force-dynamic";

function getRole(sessionClaims: unknown): string | undefined {
  const claims = sessionClaims as Record<string, unknown> | null | undefined;
  if (!claims) return undefined;
  const meta =
    (claims.metadata as Record<string, unknown> | undefined) ??
    (claims.publicMetadata as Record<string, unknown> | undefined);
  return meta?.role as string | undefined;
}

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/");

  // Si el usuario es admin (no operador), lo mandamos a su panel correspondiente.
  if (getRole(sessionClaims) === "admin") {
    redirect("/admin/envios");
  }

  const operador = await prisma.operador.findUnique({
    where: { clerk_user_id: userId },
  });

  if (!operador) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold text-white">Panel del Operador</h1>
        <p className="mt-4 text-red-400">
          Tu usuario no está registrado como operador.
        </p>
      </main>
    );
  }

  const envios = await prisma.envio.findMany({
    where: { operador_id: operador.id },
    orderBy: { fecha_estimada: "asc" },
  });

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Panel del Operador</h1>
        <p className="mt-1 text-cyan-400">Bienvenido, {operador.nombre} {operador.apellido}</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Mis envíos</h2>
          <p className="text-sm text-gray-400">{envios.length} envío{envios.length !== 1 ? "s" : ""} asignado{envios.length !== 1 ? "s" : ""}</p>
        </div>

        {envios.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No tenés envíos asignados.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-left text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3">Entrega estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {envios.map((envio) => (
                <tr key={envio.id} className="hover:bg-gray-800 transition text-gray-300">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/envios/${envio.id}`}
                      className="text-cyan-400 hover:text-cyan-300 underline font-mono text-sm"
                    >
                      {envio.id.slice(0, 8)}...
                    </Link>
                  </td>
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
                    {envio.estado === "ENTREGADO" && envio.fecha_de_entrega
                      ? new Date(envio.fecha_de_entrega).toLocaleDateString()
                      : envio.fecha_estimada
                        ? new Date(envio.fecha_estimada).toLocaleDateString()
                        : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}