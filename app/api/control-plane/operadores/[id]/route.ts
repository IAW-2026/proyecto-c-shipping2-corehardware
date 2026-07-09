import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchOperadorSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  sexo: z.string().optional(),
  direccion: z.string().optional(),
  mail: z.string().email({ message: "El correo electrónico debe ser válido" }).optional(),
  celular: z.string().optional(),
}).strict();

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const validatedData = patchOperadorSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        message: "Datos de entrada inválidos. No se pudo actualizar el operador.",
        errors: validatedData.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const operador = await prisma.operador.findUnique({ where: { id, is_deleted: false } });
  if (!operador) {
    return NextResponse.json({ message: "Operador no encontrado" }, { status: 404 });
  }

  const actualizado = await prisma.operador.update({
    where: { id, is_deleted: false },
    data: validatedData.data,
  });

  return NextResponse.json({
    id: actualizado.id,
    nombre: actualizado.nombre,
    apellido: actualizado.apellido,
    sexo: actualizado.sexo,
    direccion: actualizado.direccion,
    mail: actualizado.mail,
    celular: actualizado.celular,
    dni: actualizado.dni,
    cuil_cuit: actualizado.cuil_cuit,
  });
}