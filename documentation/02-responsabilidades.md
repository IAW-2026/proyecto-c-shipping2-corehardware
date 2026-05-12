# 1.2 — Asignación de Responsabilidades

> **Tipo C — Marketplace**

## Distribución de webapps

| App | Responsable | Repositorio |
|-----|-------------|-------------|
| Buyer App | Yanina Rivera | `proyecto-c-buyer-corehardware` |
| Seller App | Sebastián Pereda | `proyecto-c-seller-corehardware` |
| Shipping App | Matias Junca | `proyecto-c-shipping-corehardware` |
| Payments App | Agustin Ferrante | `proyecto-c-payments-corehardware` |

---

## Datos propios de cada app

### Buyer App
<!-- Entidades que viven en la base de datos de esta app -->
- Comprador
- Pedido

### Seller App
<!-- Entidades que viven en la base de datos de esta app -->
- Vendedor
- Producto
- Venta

### Shipping App
<!-- Entidades que viven en la base de datos de esta app -->
- Operador
- Envío

### Payments App
<!-- Entidades que viven en la base de datos de esta app -->
- Pago
- Disputa

---

## Datos o acciones que requieren comunicación entre apps

| App que expone | Acción / dato necesario | App(s) que llaman | API involucrada |
|------------|------------------------|-------------|-----------------|
| Seller App | Vendedor (dato) | Buyer App / Shipping App / Payments App | GET api/sellers/{id} |
| Seller App | Producto (dato) | Buyer App | GET api/products/{id} |
| Seller App | Lista de productos (dato) | Buyer App | GET api/products/ |
| Seller App | Notifica pago exitoso de pedido (acción) | Payments App | POST api/sale |
| Shipping App | Envío (dato) | Buyer App | GET api/shipment/{id} |
| Shipping App | Notifica un nuevo pedido a enviar (acción) | Seller App | POST api/shipment/ |
| Payments App | Hacer el checkout de un pedido (acción) | Buyer App | POST api/checkout |
| Buyer App | Comprador (dato) | Seller App / Shipping App / Payments App | GET api/buyers/{id} |
| Buyer App | Pedido (dato) | Seller App / Shipping App | GET api/orders/{id} |
| Buyer App | Editar el id del envío de un pedido (acción)  | Shipping App | POST api/orders/{id}/shipment |
