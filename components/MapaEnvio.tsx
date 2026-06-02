"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Props {
  origen: string;
  destino: string;
}

interface Coordenada {
  lat: number;
  lon: number;
}

async function geocodificar(direccion: string): Promise<Coordenada | null> {
  
  const direccionLimpia = direccion.replace(/'/g, "");
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccionLimpia)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "CoreHardware-Shipping/1.0" },
  });
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

async function obtenerRuta(origen: Coordenada, destino: Coordenada): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origen.lon},${origen.lat};${destino.lon},${destino.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) return [];
  return data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => [lat, lon]);
}

export default function MapaEnvio({ origen, destino }: Props) {
  const [coordOrigen, setCoordOrigen] = useState<Coordenada | null>(null);
  const [coordDestino, setCoordDestino] = useState<Coordenada | null>(null);
  const [ruta, setRuta] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  function normalizarDireccion(dir: string): string {
    if (!dir.toLowerCase().includes("argentina")) {
      return `${dir}, Argentina`;
    }
    return dir;
  }

  useEffect(() => {
    async function cargarMapa() {

      console.log("Origen:", origen);
      console.log("Destino:", destino);

      const [co, cd] = await Promise.all([
        geocodificar(normalizarDireccion(origen)),
        geocodificar(normalizarDireccion(destino)),
      ]);

      setCoordOrigen(co);
      setCoordDestino(cd);

      if (co && cd) {
        const rutaCoords = await obtenerRuta(co, cd);
        setRuta(rutaCoords);
      }

      setLoading(false);
    }

    cargarMapa();
  }, [origen, destino]);

  if (loading) return <p className="text-gray-400">Cargando mapa...</p>;
  if (!coordOrigen || !coordDestino) return <p className="text-red-400">No se pudo cargar el mapa.</p>;

  const centro: [number, number] = [
    (coordOrigen.lat + coordDestino.lat) / 2,
    (coordOrigen.lon + coordDestino.lon) / 2,
  ];

  return (
    <MapContainer
      center={centro}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[coordOrigen.lat, coordOrigen.lon]}>
        <Popup>Origen: {origen}</Popup>
      </Marker>
      <Marker position={[coordDestino.lat, coordDestino.lon]}>
        <Popup>Destino: {destino}</Popup>
      </Marker>
      {ruta.length > 0 && (
        <Polyline positions={ruta} color="blue" weight={4} />
      )}
    </MapContainer>
  );
}