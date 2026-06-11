# 1.4 — Modelo de Datos por Aplicación

> **Tipo C — Marketplace**

Para cada webapp, describir las entidades principales de su base de datos: tablas, campos relevantes y relaciones. No es necesario un DER formal, pero sí que quede claro qué persiste cada app.

También identificar posibles duplicados entre apps (ej: usuarios) y definir cómo se resuelven las inconsistencias.

---

## Buyer App
### Comprador
- ID
- DNI
- CUIL/CUIT
- Apellido
- Nombre
- Sexo
- Direccion
- Mail
- Celular
- Fecha de nacimiento
- Nacionalidad
- Condicion IVA
- UserID (Clerk)
- IsDeleted
### Pedido
- ID
- Fecha (Datetime)
- Comprador Id
- Vendedor Id
- Productos Id
- Monto
- Estado
- Envio Id

---

## Seller App
### Vendedor
- ID
- CUIT
- Razon social (nombre)
- Direccion
- Mail
- Celular
- Fecha de inicio de actividades
- Condicion IVA
- UserID (Clerk)
- IsDeleted
### Producto
- ID
- Nombre
- Vendedor ID
- Marca
- Modelo
- Precio
- Descripcion
- Especificaciones
- Garantia
- Stock
- Imagen
- IsDeleted
### Venta
- ID
- Fecha (Datetime)
- Vendedor Id
- Productos Id
- Monto
- IsDeleted
---

## Shipping App
### Operador
- ID
- DNI
- CUIL/CUIT
- Apellido
- Nombre
- Sexo
- Direccion
- Mail
- Celular
- Fecha de nacimiento
- Nacionalidad
- UserId(Clerk)
- IsDeleted
### Envio
- ID
- Pedido Id
- Fecha de entrega
- Estado
- Monto (Monto de productos + envío)
- Direccion

---

## Payments App
### Pago
- ID
- Forma de pago
- Estado
- Pedido Id
- Fecha (Datetime)
- Descripcion
- Monto

### Disputa
- ID
- Pedido Id
- Fecha de inicio
- Fecha de finalizacion
- Estado
- Descripcion

---

## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Usuario (clerk_user_id) | Todas | Clerk | Cada app sincroniza al primer login vía webhook o lazy load |
