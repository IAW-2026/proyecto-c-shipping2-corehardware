-- CreateTable
CREATE TABLE "Operador" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "cuil_cuit" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "nacionalidad" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Operador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Envio" (
    "id" TEXT NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "operador_id" TEXT,
    "fecha_de_entrega" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "monto" DOUBLE PRECISION NOT NULL,
    "direccion" TEXT NOT NULL,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operador_clerk_user_id_key" ON "Operador"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "Operador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
