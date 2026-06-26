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
  id: string;
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
  id: string;
  fecha: string;
  comprador_id: string;
  vendedor_id: string;
  productos: string[];
  monto: number;
  estado: string;
  envio_id: string | null;
}

export async function getComprador(id: string): Promise<Comprador | null> {
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

export async function getPedido(id: string): Promise<Pedido | null> {
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
  ordenId: string,
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

export async function actualizarEstadoPedido(
  ordenId: string,
  estado: string
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/orders/${ordenId}/status`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) {
      console.error(`[Buyer] actualizarEstadoPedido: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Buyer] actualizarEstadoPedido falló:", err);
    return false;
  }
}
