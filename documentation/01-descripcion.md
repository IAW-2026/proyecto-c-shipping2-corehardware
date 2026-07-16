# 1.1 — Descripción del Sistema

> **Tipo C — Marketplace**

## ¿Qué problema resuelve?

El sistema facilita la organización entre compradores y vendedores de hardware. La idea es centralizar todo en un solo lugar para facilitar la coordinación de las ventas, el manejo de los envíos y la gestión de los pagos, logrando que todo el proceso sea mucho más fluido y seguro para las dos partes.

<!-- Describir el problema que resuelve el sistema y el dominio de aplicación específico elegido por la comisión. Ejemplo: un marketplace de artículos de diseño y decoración llamado Craftly, que conecta artesanos y compradores particulares. -->

## Actores del sistema

| Actor | Descripción | Apps donde interactúa |
|-------|-------------|----------------------|
| Comprador | Usuario final que busca y compra productos, visualiza su historial de compras y sus seguimientos. Ademas, gestiona sus pagos y disputas. | Buyer App, Payments App |
| Vendedor | Usuario que gestiona stock, publicaciones y despachos. Ademas, gestiona sus acreditaciones de pagos y disputas. | Seller App, Payments App |
| Operador | Gestiona los envios, actualizacion de estados e historial de entregas. | Shipping App |
| Administrador | Control total de las plataformas y gestion del dashboard de cada webapp. | Buyer App, Seller App, Shipping App, Payments App |

## Flujo principal de uso

1. Un comprador selecciona uno o mas productos en **Buyer App**.
2. **Buyer App** envía los datos del pedido a **Payments App**.
3. Se procesa el pago en **Payments App**.
4. **Payments App** notifica al vendedor del pedido en **Seller App**
5. **Seller App** notifica la creación del pedido a **Shipping App**
6. Se asigna automáticamente el pedido a un operador logistico en **Shipping App**
7. **Shipping App** le envía a **Buyer App** el id del envío para hacer el seguimiento 
8. El Operador Logístico marca el pedido como entregado en **Shipping App**
9. (Opcional) El comprador inicia una disputa en **Payments App**
10. (Opcional) El vendedor recibe la notificación de la disputa por el pedido en **Payments App**
11. (Opcional) El vendedor resuelve la disputa en **Payments App**

## Flujo con pago rechazado

1. Un comprador selecciona uno o mas productos en **Buyer App**
2. **Buyer App** envía los datos del pedido a **Payments App**.
3. Se intenta procesar el pago en **Payments App**, pero falla
4. Se notifica al comprador en **Payments App** que falló el pago
<!-- Describir el flujo de punta a punta del caso de uso central del sistema. Ejemplo:

1. El comprador busca productos y realiza una compra desde la **Buyer App**.
2. El pago se procesa en la **Payments App**.
3. El vendedor recibe la orden y despacha el producto desde la **Seller App**.
4. El operador logístico gestiona el envío y actualiza el estado desde la **Shipping App**.
5. Una vez entregado, el pago se acredita al vendedor desde la **Payments App**.
-->