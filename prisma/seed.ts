import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Seed de Etapa 3 — Clerk compartido del equipo.
// Carga un único operador real (linkeado al user_id del Clerk compartido)
// y envíos de demo en distintos estados para mostrar el flujo end-to-end.

async function main() {
  await prisma.envio.deleteMany();
  await prisma.operador.deleteMany();

  // Operador real — linkeado al usuario logistics+clerk_test@iaw.com del Clerk compartido
  const carlos = await prisma.operador.create({
    data: {
      clerk_user_id: "user_3FbqoYGM6Rnpd9ZCi0Ms1vsMvNu",
      dni: "30111222",
      cuil_cuit: "20-30111222-4",
      apellido: "García",
      nombre: "Carlos",
      sexo: "M",
      direccion: "Av. Colón 1234, Bahía Blanca",
      mail: "logistics+clerk_test@iaw.com",
      celular: "291-4111222",
      fecha_nacimiento: new Date("1990-05-15"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  // Envíos de demo en distintos estados.
  // pedido_id son CUIDs ficticios — no corresponden a pedidos reales en Buyer.
  await prisma.envio.createMany({
    data: [
      // 2 PENDIENTE (sin operador asignado) — para probar asignación desde admin
      {
        pedido_id: "cl_demo_pedido_pend_001",
        operador_id: null,
        estado: "PENDIENTE",
        direccion: "Av. Alem 890, Bahía Blanca",
        monto: 5600,
        fecha_de_entrega: new Date("2026-06-30"),
      },
      {
        pedido_id: "cl_demo_pedido_pend_002",
        operador_id: null,
        estado: "PENDIENTE",
        direccion: "Darregueira 789, Bahía Blanca",
        monto: 7800,
        fecha_de_entrega: new Date("2026-07-01"),
      },

      // 1 ASIGNADO a Carlos
      {
        pedido_id: "cl_demo_pedido_asig_001",
        operador_id: carlos.id,
        estado: "ASIGNADO",
        direccion: "Chiclana 456, Bahía Blanca",
        monto: 22000,
        fecha_de_entrega: new Date("2026-06-28"),
      },

      // 1 RETIRADO por Carlos
      {
        pedido_id: "cl_demo_pedido_retir_001",
        operador_id: carlos.id,
        estado: "RETIRADO",
        direccion: "Av. Fortín 321, Bahía Blanca",
        monto: 31000,
        fecha_de_entrega: new Date("2026-06-26"),
      },

      // 1 EN_CAMINO con Carlos
      {
        pedido_id: "cl_demo_pedido_camino_001",
        operador_id: carlos.id,
        estado: "EN_CAMINO",
        direccion: "Av. Cerri 234, Bahía Blanca",
        monto: 8900,
        fecha_de_entrega: new Date("2026-06-25"),
      },

      // 2 ENTREGADO por Carlos (historial)
      {
        pedido_id: "cl_demo_pedido_entreg_001",
        operador_id: carlos.id,
        estado: "ENTREGADO",
        direccion: "Av. Alem 890, Bahía Blanca",
        monto: 15500,
        fecha_de_entrega: new Date("2026-06-15"),
      },
      {
        pedido_id: "cl_demo_pedido_entreg_002",
        operador_id: carlos.id,
        estado: "ENTREGADO",
        direccion: "Av. Colón 321, Bahía Blanca",
        monto: 45000,
        fecha_de_entrega: new Date("2026-06-10"),
      },
    ],
  });

  console.log("✅ Seed completado");
  console.log("   - 1 operador real: Carlos García (logistics+clerk_test@iaw.com)");
  console.log("   - 7 envíos: 2 PENDIENTE, 1 ASIGNADO, 1 RETIRADO, 1 EN_CAMINO, 2 ENTREGADO");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
