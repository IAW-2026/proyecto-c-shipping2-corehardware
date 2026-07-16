import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const body = await req.json();
  const { nombre, apellido, mail, celular, dni, cuil_cuit, sexo, direccion, nacionalidad, fecha_nacimiento, password } = body;

  if (!nombre || !apellido || !mail || !celular || !dni || !password) {
    return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
  }

  let clerkUser;
  try {
    const client = await clerkClient();
    clerkUser = await client.users.createUser({
      emailAddress: [mail],
      password,
      firstName: nombre,
      lastName: apellido,
      publicMetadata: { role: "logistics" },
    });
  } catch (error) {
    console.error("Error Clerk:", error);
    return NextResponse.json({ message: "Error al crear usuario en Clerk. El email puede estar en uso." }, { status: 400 });
  }

  const operador = await prisma.operador.create({
    data: {
      clerk_user_id: clerkUser.id,
      nombre,
      apellido,
      mail,
      celular,
      dni,
      cuil_cuit: cuil_cuit || "",
      sexo: sexo || "",
      direccion: direccion || "",
      nacionalidad: nacionalidad || "",
      fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : new Date(),
      is_deleted: false,
    },
  });

  return NextResponse.json(operador, { status: 201 });
}
