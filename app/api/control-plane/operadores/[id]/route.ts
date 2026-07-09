import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_FIELDS = [
  "nombre",
  "apellido",
  "sexo",
  "direccion",
  "mail",
  "celular",
] as const;

type PatchOperadorData = Partial<Record<(typeof ALLOWED_FIELDS)[number], string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePatchOperador(body: unknown): {
  success: true; data: PatchOperadorData
} | {
  success: false; errors: Record<string, string[]>
} {
  const errors: Record<string, string[]> = {};

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { success: false, errors: { _root: ["El cuerpo debe ser un objeto"] } };
  }

  const input = body as Record<string, unknown>;

  // Campos desconocidos (equivalente a .strict())
  const unknownFields = Object.keys(input).filter(
    (key) => !ALLOWED_FIELDS.includes(key as any)
  );
  if (unknownFields.length > 0) {
    errors._root = [`Campos no permitidos: ${unknownFields.join(", ")}`];
  }

  const data: PatchOperadorData = {};

  for (const field of ALLOWED_FIELDS) {
    if (input[field] === undefined) continue;

    const value = input[field];
    if (typeof value !== "string") {
      errors[field] = [`${field} debe ser un texto`];
      continue;
    }

    if (field === "mail" && !EMAIL_REGEX.test(value)) {
      errors[field] = ["El correo electrónico debe ser válido"];
      continue;
    }

    data[field] = value;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data };
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("X-API-Key") !== process.env.SHIPPING_API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const validatedData = validatePatchOperador(body);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        message: "Datos de entrada inválidos. No se pudo actualizar el operador.",
        errors: validatedData.errors,
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