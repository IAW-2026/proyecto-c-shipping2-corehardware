import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ActualizarEstado from "./ActualizarEstado";
import MapaWrapper from "./MapaWrapper";
import Link from "next/link";
import { getPedido, getComprador } from "@/lib/clients/buyer";
import { getVendedor } from "@/lib/clients/seller";
import CopyableId from "@/components/CopyableId";
import EstadosProgreso from "@/components/EstadosProgreso";

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

  const pedido = await getPedido(envio.pedido_id);
  const [comprador, vendedor] = pedido
    ? await Promise.all([
        getComprador(pedido.comprador_id),
        getVendedor(pedido.vendedor_id),
      ])
    : [null, null];

  const origenMapa =
    vendedor?.direccion || envio.operador?.direccion || "Bahía Blanca, Argentina";

  return (
    <main className="p-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm transition">
          ← Volver a mis envíos
        </Link>
        <h1 className="text-3xl font-bold text-white mt-2">Detalle del Envío</h1>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Progreso del envío
        </h2>
        <EstadosProgreso estadoActual={envio.estado} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Información del envío</h2>
          <div className="flex justify-between">
            <span className="text-gray-400">ID</span>
            <CopyableId value={envio.id} truncate={12} className="text-white" />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Pedido</span>
            <CopyableId value={envio.pedido_id} prefix="#" truncate={12} align="end" />
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
            <span className="text-gray-400">
              {envio.estado === "ENTREGADO" ? "Entregado el" : "Entrega estimada"}
            </span>
            <span className="text-white flex items-center gap-2">
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
            </span>
          </div>
          {envio.estado === "ENTREGADO" && envio.fecha_estimada && (
            <div className="flex justify-between">
              <span className="text-gray-400">Estimaba</span>
              <span className="text-gray-400">
                {new Date(envio.fecha_estimada).toLocaleDateString("es-AR")}
              </span>
            </div>
          )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Comprador</h2>
          {comprador ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Nombre</span>
                <span className="text-white">{comprador.nombre} {comprador.apellido}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{comprador.mail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Celular</span>
                <span className="text-white">{comprador.celular}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Datos del comprador no disponibles.</p>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Vendedor (origen)</h2>
          {vendedor ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Razón social</span>
                <span className="text-white">{vendedor.razon_social}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dirección</span>
                <span className="text-white text-right max-w-xs">{vendedor.direccion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{vendedor.mail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Celular</span>
                <span className="text-white">{vendedor.celular}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Datos del vendedor no disponibles.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4">Ruta del envío</h2>
        <MapaWrapper
          origen={origenMapa}
          destino={envio.direccion}
        />
      </div>
    </main>
  );
}
