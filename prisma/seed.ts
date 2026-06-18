import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.envio.deleteMany();
  await prisma.operador.deleteMany();
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
      direccion: "Brown 567, Bahía Blanca",
      mail: "laura.martinez@corehardware.com",
      celular: "291-4444555",
      fecha_nacimiento: new Date("1995-08-20"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  const op3 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_003",
      dni: "28333444",
      cuil_cuit: "20-28333444-5",
      apellido: "López",
      nombre: "Roberto",
      sexo: "M",
      direccion: "Chiclana 123, Bahía Blanca",
      mail: "roberto.lopez@corehardware.com",
      celular: "291-4333444",
      fecha_nacimiento: new Date("1988-03-10"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  const op4 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_004",
      dni: "35666777",
      cuil_cuit: "27-35666777-3",
      apellido: "Fernández",
      nombre: "Ana",
      sexo: "F",
      direccion: "Av. Alem 567, Bahía Blanca",
      mail: "ana.fernandez@corehardware.com",
      celular: "291-4666777",
      fecha_nacimiento: new Date("1997-11-25"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  const op5 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_005",
      dni: "31888999",
      cuil_cuit: "20-31888999-7",
      apellido: "Rodríguez",
      nombre: "Diego",
      sexo: "M",
      direccion: "Brown 890, Bahía Blanca",
      mail: "diego.rodriguez@corehardware.com",
      celular: "291-4888999",
      fecha_nacimiento: new Date("1993-07-15"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  const op6 = await prisma.operador.create({
    data: {
      clerk_user_id: "user_seed_006",
      dni: "33111222",
      cuil_cuit: "20-33111222-8",
      apellido: "Sánchez",
      nombre: "María",
      sexo: "F",
      direccion: "Av. Colón 789, Bahía Blanca",
      mail: "maria.sanchez@corehardware.com",
      celular: "291-4111333",
      fecha_nacimiento: new Date("1991-04-20"),
      nacionalidad: "Argentina",
      is_deleted: false,
    },
  });

  // Crear envíos
  await prisma.envio.createMany({
    data: [
      {
        pedido_id: "cl1001seedpedidoabc123",
        operador_id: op1.id,
        estado: "ENTREGADO",
        direccion: "Av. Alem 890, Bahía Blanca",
        monto: 15500,
        fecha_de_entrega: new Date("2026-05-10"),
      },
      {
        pedido_id: "cl1002seedpedidoabc456",
        operador_id: op1.id,
        estado: "EN_CAMINO",
        direccion: "Av. Cerri 234, Bahía Blanca",
        monto: 8900,
        fecha_de_entrega: new Date("2026-06-01"),
      },
      {
        pedido_id: "cl1003seedpedidoabc789",
        operador_id: op2.id,
        estado: "ASIGNADO",
        direccion: "Chiclana 456, Bahía Blanca",
        monto: 22000,
        fecha_de_entrega: new Date("2026-06-02"),
      },
      {
        pedido_id: "cl1004seedpedidoabcdef",
        operador_id: null,
        estado: "PENDIENTE",
        direccion: "Av. Alem 890, Bahía Blanca",
        monto: 5600,
        fecha_de_entrega: new Date("2026-06-03"),
      },
      {
        pedido_id: "cl1005seedpedidoaceghi",
        operador_id: op2.id,
        estado: "RETIRADO",
        direccion: "Av. Fortín 321, Bahía Blanca",
        monto: 31000,
        fecha_de_entrega: new Date("2026-06-04"),
      },
      {
        pedido_id: "cl1006seedpedidoacjklm",
        operador_id: op1.id,
        estado: "PENDIENTE",
        direccion: "Moreno 123, Bahía Blanca",
        monto: 12000,
        fecha_de_entrega: new Date("2026-06-05"),
      },
      {
        pedido_id: "cl1007seedpedidoacnopq",
        operador_id: op2.id,
        estado: "EN_CAMINO",
        direccion: "Av. Alem 456, Bahía Blanca",
        monto: 9500,
        fecha_de_entrega: new Date("2026-06-06"),
      },
      {
        pedido_id: "cl1008seedpedidoacrstu",
        operador_id: null,
        estado: "PENDIENTE",
        direccion: "Darregueira 789, Bahía Blanca",
        monto: 7800,
        fecha_de_entrega: new Date("2026-06-07"),
      },
      {
        pedido_id: "cl1009seedpedidoacvwxy",
        operador_id: op1.id,
        estado: "ENTREGADO",
        direccion: "Av. Colón 321, Bahía Blanca",
        monto: 45000,
        fecha_de_entrega: new Date("2026-05-28"),
      },
      {
        pedido_id: "cl1010seedpedidoazabcd",
        operador_id: op2.id,
        estado: "ASIGNADO",
        direccion: "Brown 654, Bahía Blanca",
        monto: 18000,
        fecha_de_entrega: new Date("2026-06-08"),
      },
      {
        pedido_id: "cl1011seedpedidoazefgh",
        operador_id: op1.id,
        estado: "RETIRADO",
        direccion: "Av. Cerri 987, Bahía Blanca",
        monto: 33000,
        fecha_de_entrega: new Date("2026-06-09"),
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