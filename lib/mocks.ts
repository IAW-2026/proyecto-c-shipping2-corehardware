// MOCKS — datos simulados de otras apps
// Etapa 3: reemplazar cada función por un fetch real al endpoint correspondiente

// Buyer App — GET /api/buyer/buyers/{id}
export async function getComprador(compradorId: string) {
  return {
    id: compradorId,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@email.com",
    celular: "291-4123456",
    direccion: "Av. Colón 1234, Bahía Blanca",
  };
}

// Buyer App — GET /api/buyer/orders/{id}
export async function getPedido(pedidoId: number) {
  return {
    id: pedidoId,
    comprador_id: "mock-comprador-001",
    vendedor_id: "mock-vendedor-001",
    direccion_entrega: "Av. Colón 1234, Bahía Blanca",
    total: 15500,
    estado: "CONFIRMADO",
    fecha_creacion: "2026-05-01T10:00:00Z",
  };
}

// Seller App — GET /api/seller/sellers/{id}
export async function getVendedor(vendedorId: string) {
  return {
    id: vendedorId,
    nombre: "Tech",
    apellido: "Store",
    email: "techstore@email.com",
    celular: "291-4654321",
    direccion: "Av. Alem 890, Bahía Blanca",
  };
}

// Buyer App — PUT /api/buyer/orders/{id}/shipment
// Notifica a Buyer App el ID del envío creado para ese pedido
export async function notificarEnvioCreado(ordenId: number, envioId: string) {
  // Etapa 3: reemplazar por fetch real
  // await fetch(`${process.env.BUYER_APP_URL}/api/orders/${ordenId}/shipment`, {
  //   method: "PUT",
  //   headers: { "X-API-Key": process.env.BUYER_API_KEY!, "Content-Type": "application/json" },
  //   body: JSON.stringify({ shipmentID: envioId }),
  // });
  
  console.log(`[MOCK] Notificando a Buyer App: orden ${ordenId} → envío ${envioId}`);
  return { success: true };
}
