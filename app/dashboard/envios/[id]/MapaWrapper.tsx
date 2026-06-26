"use client";

import dynamic from "next/dynamic";

const MapaEnvio = dynamic(() => import("@/components/MapaEnvio"), {
  ssr: false,
  loading: () => <p className="text-gray-400">Cargando mapa...</p>,
});

interface Props {
  origen: string;
  destino: string;
}

export default function MapaWrapper({ origen, destino }: Props) {
  return <MapaEnvio origen={origen} destino={destino} />;
}