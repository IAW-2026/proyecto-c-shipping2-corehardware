# 1.3 — Diseño de APIs Inter-Servicios

> **Tipo C — Marketplace**

Documentar cada endpoint que una app expone para ser consumido por otra app del sistema. Este contrato debe estar acordado por todos los integrantes antes de comenzar la Etapa 2.

---

## Buyer App — Endpoints expuestos
### Comprador
- GET api/buyers/{id}
    - Envia solo url.
        - Request body: {}
    - Recibe datos del comprador con ese id. 
        - Response (200): { "id": number, "dni": number, "cuil_cuit": string, "apellido": string, "nombre": string, "direccion": string, "mail": string,"celular": string, "condicion_iva": string  } 
        - Response (404): { "message": string }
    - Llamado por Seller, Shipping y Payments
    - Utiliza APIKey de Buyer
### Pedido
- GET api/orders/{id}
    - Envia solo url.
        - Request body: {}
    - Recibe datos del pedido con ese id
        - Response (200): { "id": number, "fecha": string, "comprador_id": number, "vendedor_id": number, "productos":[producto_id: number,... ], "monto": number, "estado": string, "envio_id": number}
        - Response (404): { "message": string }
    - Llamado por Seller y Shipping
    - Utiliza APIKey de Buyer
- PUT api/orders/{id}/shipment
    - Envia el id del envío.
        Request body: { "shimpentID" : number }
    - No recibe datos
        - Response (204): { }
        - Response (409): { "message": string } 
    - Llamado por Shipping
    - Utiliza APIKey de Buyer

<!-- Documentar los endpoints que expone esta app -->

---

## Seller App — Endpoints expuestos
### Vendedor
- GET api/sellers/{id}
    - Envia solo url.
        - Request body: {}
    - Recibe datos del vendedor con ese id
        - Response (200): { "id": number, "cuit": string,"razon_social": string, "direccion": string,"mail": string, "celular": string, "condicion_iva": string }    
        - Response (404): { "message": string }
    - Llamado por Buyer, Shipping y Payments
    - Utiliza APIKey de Seller
### Producto
- GET api/products/
    - Envia solo url.
        - Request body: {}
        - Parametros: ? offset:number , limit:number, name:string, brand:string, hasStock:boolean, seller:string 
    - Recibe una lista de productos (Va a tener filtrado por campo, y paginado)
        - Response(200): [{"id": number, "nombre": string,
    "vendedor": string, "marca": string, "modelo": string,"precio": number, "stock": number, "imagen": string }, ...]
        - Response(204): {}
        - Response (404): { "message": string }
    - Llamado por Buyer
    - Utiliza APIKey de Seller
- GET api/products/{id}
    - Envia solo url.
        - Request body: {}
    - Recibe datos del producto con ese id
        - Response (200): {"id": number, "nombre": string,
    "vendedor": string, "marca": string, "modelo": string,"precio": number, "descripcion": string,"especificaciones": string, "garantia": string,"stock": number, "imagen": string }    
        - Response (404): { "message": string }
    - Llamado por Buyer
    - Utiliza APIKey de Seller
### Venta
- POST api/sale
    - Envía los datos del pedido
        - Request body: { "id": number, "fecha": string, "comprador_id": number, "vendedor_id": number, "productos":[producto_id: number,... ], "monto": number }
    - No recibe datos
        - Response (201): { "id": number, "fecha": string, "comprador_id": number, "vendedor_id": number, "productos":[producto_id: number,... ], "monto": number }
        - Response (400): { "message": string}
        - Response (405): { "message": string}
    - Llamado por Payments
    - Utiliza APIKey de Seller

<!-- Documentar los endpoints que expone esta app -->

---

## Shipping App — Endpoints expuestos
### Envío
- GET api/shipment/{id}
    - Envia solo url.
        - Request body: {}
    - Recibe datos del envio con ese id
        - Response (200): { "id": number, "pedido_id": number, "fecha_de_entrega": string, "estado": string, "monto": number, "direccion": string }    
        - Response (404): { "message" : string}
    - Llamado por Buyer
    - Utiliza APIKey de Shipping
- POST api/shipment/
    - Envia la información de un pedido
        - Request body: { "id": number, "fecha": string, "comprador_id": number, "vendedor_id": number, "productos":[producto_id: number,... ], "monto": number }
    - No recibe datos
        - Response (201): { "id": number, "pedido_id": number, "fecha_de_entrega": string, "estado": string, "monto": number, "direccion": string } 
        - Response (400): { "message": string}
        - Response (405): { "message": string}
    - Llamado por Seller
    - Utiliza APIKey de Shipping

<!-- Documentar los endpoints que expone esta app -->

---

## Payments App — Endpoints expuestos
### Checkout
- POST api/checkout
    - Envia los datos del pedido
        - Request body: { "id": number, "fecha": string, "comprador_id": number, "vendedor_id": number, "productos":[producto_id: number,... ], "monto": number }
    - No recibe datos
        - Response (201): { "id": number, "forma_de_pago": "null", "estado": string,"pedido_id": number, "fecha": string,"descripcion": string, "monto": number }
        - Response (400): { "message": string}
        - Response (405): { "message": string}
    - Llamado por Buyer
    - El integrante responsable va a determinar si es necesario usar el JWT para determinar el usuario que hizo el checkout o simplemente usa APIKey de Payments

- POST api/webhook
    - Recibe confirmación de pago de MercadoPago
        - Request body: {"id":number, "live-mode":boolean, "type":"payment", "date_created":string, "user_id":number, "api_version":string, "action":string, "data": { "id":number} }
    - No recibe dato
        - Response: Lo que requiera la api de MercadoPago
    - Llamado por MercadoPago
    - Utiliza APIKey de Payments

<!-- Documentar los endpoints que expone esta app -->

---

<!-- Agregar secciones por cada integración adicional identificada -->