// Cliente HTTP para la Seller App

const BASE_URL = process.env.SELLER_APP_URL;
const API_KEY = process.env.SELLER_API_KEY;

function headers() {
  return {
    "X-API-Key": API_KEY ?? "",
    "Content-Type": "application/json",
  };
}

export interface Vendedor {
  id: string;
  cuit: string;
  razon_social: string;
  direccion: string;
  mail: string;
  celular: string;
  condicion_iva: string;
}

export async function getVendedor(id: string): Promise<Vendedor | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/sellers/${id}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[Seller] getVendedor falló:", err);
    return null;
  }
}
