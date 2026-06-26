export async function geocodificar(direccion: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`;
  
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CoreHardware-Shipping/1.0",
    },
  });

  const data = await res.json();

  if (!data || data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}