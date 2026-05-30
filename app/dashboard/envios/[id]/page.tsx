import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ActualizarEstado from "./ActualizarEstado";

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
      <h1 className="text-2xl font-bold">Detalle del Envío</h1>

      <div className="mt-4 space-y-2">
        <p><span className="font-semibold">ID:</span> {envio.id}</p>
        <p><span className="font-semibold">Pedido ID:</span> {envio.pedido_id}</p>
        <p><span className="font-semibold">Estado:</span> {envio.estado}</p>
        <p><span className="font-semibold">Dirección:</span> {envio.direccion}</p>
        <p><span className="font-semibold">Monto:</span> ${envio.monto}</p>
        <p>
          <span className="font-semibold">Fecha estimada:</span>{" "}
          {envio.fecha_de_entrega
            ? new Date(envio.fecha_de_entrega).toLocaleDateString()
            : "-"}
        </p>
        <p>
          <span className="font-semibold">Operador:</span>{" "}
          {envio.operador ? `${envio.operador.nombre} ${envio.operador.apellido}` : "Sin asignar"}
        </p>
      </div>

      <div className="mt-8">
        <ActualizarEstado envioId={envio.id} estadoActual={envio.estado} />
      </div>
    </main>
  );
}