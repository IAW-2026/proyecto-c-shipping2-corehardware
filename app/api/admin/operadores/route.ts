import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nombre, apellido, mail, celular, dni, cuil_cuit, sexo, direccion, nacionalidad, fecha_nacimiento } = body;

  if (!nombre || !apellido || !mail || !celular || !dni) {
    return NextResponse.json({ message: "Faltan campos requeridos" }, { status: 400 });
  }

  const operador = await prisma.operador.create({
    data: {
      clerk_user_id: `manual_${Date.now()}`,
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