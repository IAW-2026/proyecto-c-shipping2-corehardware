import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear operadores
  const op1 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_001",
      dni: "30111222",
      cuil_cuit: "20-30111222-4",
      apellido: "García",
      nombre: "Carlos",
      sexo: "M",
      direccion: "Av. Colón 1234, Bahía Blanca",
      mail: "carlos.garcia@corehardware.com",
      celular: "291-4111222",
      fecha_nacimiento: new Date("1990-05-15"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  const op2 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_002",
      dni: "32444555",
      cuil_cuit: "20-32444555-6",
      apellido: "Martínez",
      nombre: "Laura",
      sexo: "F",
      direccion: "Calle Brown 567, Bahía Blanca",
      mail: "laura.martinez@corehardware.com",
      celular: "291-4444555",
      fecha_nacimiento: new Date("1995-08-20"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  // Crear envíos
  await prisma.envio.createMany({
    data: [
      {
        pedido_id: 1001,
        operador_id: op1.id,
        estado: "ENTREGADO",
        direccion: "Av. Alem 890, Bahía Blanca",
        monto: 15500,
        fecha_de_entrega: new Date("2026-05-10"),
      },
      {
        pedido_id: 1002,
        operador_id: op1.id,
        estado: "EN_CAMINO",
        direccion: "Av. Cerri 234, Bahía Blanca",
        monto: 8900,
        fecha_de_entrega: new Date("2026-06-01"),
      },
      {
        pedido_id: 1003,
        operador_id: op2.id,
        estado: "ASIGNADO",
        direccion: "Calle Chiclana 456, Bahía Blanca",
        monto: 22000,
        fecha_de_entrega: new Date("2026-06-02"),
      },
      {
        pedido_id: 1004,
        operador_id: null,
        estado: "PENDIENTE",
        direccion: "Calle O'Higgins 789, Bahía Blanca",
        monto: 5600,
        fecha_de_entrega: new Date("2026-06-03"),
      },
      {
        pedido_id: 1005,
        operador_id: op2.id,
        estado: "RETIRADO",
        direccion: "Av. Fortín 321, Bahía Blanca",
        monto: 31000,
        fecha_de_entrega: new Date("2026-06-04"),
      },
    ],
  });

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });