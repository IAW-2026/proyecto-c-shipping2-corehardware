// Cliente HTTP para la Buyer App
// Reemplaza los mocks de Etapa 2 con llamadas reales autenticadas con X-API-Key

const BASE_URL = process.env.BUYER_APP_URL;
const API_KEY = process.env.BUYER_API_KEY;

function headers() {
  return {
    "X-API-Key": API_KEY ?? "",
    "Content-Type": "application/json",
  };
}

export interface Comprador {
  id: number;
  dni: number;
  cuil_cuit: string;
  apellido: string;
  nombre: string;
  direccion: string;
  mail: string;
  celular: string;
  condicion_iva: string;
}

export interface Pedido {
  id: number;
  fecha: string;
  comprador_id: number;
  vendedor_id: number;
  productos: number[];
  monto: number;
  estado: string;
  envio_id: number | null;
}

export async function getComprador(id: number | string): Promise<Comprador | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/buyers/${id}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[Buyer] getComprador falló:", err);
    return null;
  }
}

export async function getPedido(id: number | string): Promise<Pedido | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[Buyer] getPedido falló:", err);
    return null;
  }
}

export async function notificarEnvioCreado(
  ordenId: number,
  envioId: string
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${ordenId}/shipment`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ shipmentID: envioId }),
    });
    if (!res.ok) {
      console.error(`[Buyer] notificarEnvioCreado: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Buyer] notificarEnvioCreado falló:", err);
    return false;
  }
}
