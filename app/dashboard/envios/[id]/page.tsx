import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ActualizarEstado from "./ActualizarEstado";
import MapaWrapper from "./MapaWrapper";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EnvioDetailPage({ params }: Props) {
  const { id } = await params;

  const envio = await prisma.envio.findUnique({
    where: { id },
    include: { operador: true },
  });

  if (!envio) notFound();

  return (
    <main className="p-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm transition">
          ← Volver a mis envíos
        </Link>
        <h1 className="text-3xl font-bold text-white mt-2">Detalle del Envío</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Información del envío</h2>
          <div className="flex justify-between">
            <span className="text-gray-400">ID</span>
            <span className="text-white font-mono text-sm">{envio.id.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pedido</span>
            <span className="text-white">#{envio.pedido_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estado</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              envio.estado === "ENTREGADO" ? "bg-green-900 text-green-400" :
              envio.estado === "EN_CAMINO" ? "bg-blue-900 text-blue-400" :
              envio.estado === "RETIRADO" ? "bg-orange-900 text-orange-400" :
              envio.estado === "ASIGNADO" ? "bg-cyan-900 text-cyan-400" :
              "bg-gray-800 text-gray-400"
            }`}>
              {envio.estado}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dirección</span>
            <span className="text-white text-right max-w-xs">{envio.direccion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Monto</span>
            <span className="text-white">${envio.monto.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Entrega estimada</span>
            <span className="text-white">
              {envio.fecha_de_entrega
                ? new Date(envio.fecha_de_entrega).toLocaleDateString()
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Operador</span>
            <span className="text-white">
              {envio.operador ? `${envio.operador.nombre} ${envio.operador.apellido}` : "Sin asignar"}
            </span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Actualizar Estado</h2>
          <ActualizarEstado envioId={envio.id} estadoActual={envio.estado} />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4">Ruta del envío</h2>
        <MapaWrapper
          origen={envio.operador?.direccion || "Bahía Blanca, Argentina"}
          destino={envio.direccion}
        />
      </div>
    </main>
  );
}