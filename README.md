[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/nFGegyNh)

# CoreHardware — Shipping App

## Deploy

🔗 https://proyecto-c-shipping2-corehardware.vercel.app

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Operador logístico | `logistics+clerk_test@iaw.com` | `iawuser#` |
| Administrador | `admin+clerk_test@iaw.com` | `iawuser#` |

---

## Instrucciones de uso

**Página pública — Tracking:**
- Entrás a la URL de producción sin loguearte
- Ingresás el ID de un envío para ver su estado y ruta en el mapa

**Panel del Operador:**
- Logueate con las credenciales de operador
- En "Mis envíos" ves los envíos asignados
- Hacé clic en el ID de un envío para ver el detalle, la ruta en el mapa y actualizar el estado

**Panel de Administrador:**
- Logueate con las credenciales de admin
- En "Admin — Envíos" podés filtrar por estado, buscar por dirección u operador, y asignar operadores a envíos pendientes
- En "Admin — Operadores" podés buscar operadores, crear nuevos (se crean automáticamente en Clerk) y darlos de baja o reactivarlos

---

## Descripción

Aplicación **Shipping** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión CoreHardware.

Esta app forma parte de un ecosistema de marketplace de hardware, siendo responsable de la gestión logística de envíos. Permite a operadores logísticos gestionar sus envíos asignados y actualizar sus estados, mientras que los administradores pueden supervisar todos los envíos y gestionar el equipo de operadores.

El sistema se integra con las demás apps del ecosistema (Buyer, Seller y Payments) mediante APIs REST autenticadas con API Keys. Durante la Etapa 2, las llamadas a APIs externas están mockeadas.

---

## Notas para la corrección

- **API externa:** se integró OpenStreetMap (Nominatim para geocodificación) y OSRM para el cálculo de rutas reales, visible en el detalle de cada envío
- **Autenticación:** Clerk con roles `logistics` y `admin`. Los operadores creados desde el panel admin se registran automáticamente en Clerk
- **API Key:** los endpoints REST expuestos usan el header `X-API-Key` para autenticación entre servicios
- **Integración inter-servicio (Etapa 3):** los mocks fueron reemplazados por clientes HTTP reales en `lib/clients/buyer.ts` y `lib/clients/seller.ts`. URLs y API Keys se configuran por variables de entorno (`BUYER_APP_URL`, `BUYER_API_KEY`, `SELLER_APP_URL`, `SELLER_API_KEY`)
- **Estados de envío:** `PENDIENTE → ASIGNADO → RETIRADO → EN_CAMINO → ENTREGADO`, con transiciones validadas tanto en frontend como backend
- **Webhook de Clerk:** configurado para asignar rol `logistics` automáticamente al crear operadores

---

## Estrategia de autorización (defense in depth)

A partir del feedback de la defensa se reforzó la seguridad aplicando el principio de **separación entre front y back**: cada capa valida lo suyo y ninguna confía en que la anterior haya validado.

### Tres capas de control

| Capa | Qué valida | Cómo |
|------|-----------|------|
| **Middleware** (`middleware.ts`) | Sesión activa + rol para acceso a páginas | `auth.protect()` + chequeo de `publicMetadata.role` para rutas `/admin/*` y `/dashboard/*` |
| **API routes mutantes** (POST/PUT/PATCH/DELETE) | Rol del usuario que invoca el endpoint | Helpers `requireAdmin()` / `requireOperador()` en `lib/auth.ts` |
| **API del operador** (cambio de estado) | Ownership: el operador solo modifica sus propios envíos | Lookup del operador por `clerk_user_id` y comparación con `envio.operador_id` |

### Por qué la triple capa

- El **front** oculta opciones por UX (mejor experiencia), pero un atacante no usa la UI: usa `curl` o las DevTools.
- El **middleware** redirige en navegación normal, pero podría tener bugs de configuración o no cubrir todos los casos edge.
- Cada **endpoint** valida su propia autorización como última línea de defensa. Es la única fuente de verdad confiable.

### Endpoints y su validación

| Endpoint | Método | Validación |
|----------|--------|-----------|
| `/api/admin/operadores` | POST | `requireAdmin` |
| `/api/admin/operadores/[id]` | PATCH | `requireAdmin` |
| `/api/admin/envios/[id]` | PATCH | `requireAdmin` |
| `/api/dashboard/envios/[id]/estado` | PUT | `requireOperador` + ownership check |
| `/api/shipping/shipments` | POST | API Key (`X-API-Key`) — inter-servicio |
| `/api/shipping/shipments/[id]` | GET | API Key (`X-API-Key`) — inter-servicio |
| `/api/webhooks/clerk` | POST | Firma `svix` |
| `/api/tracking/[id]` | GET | Público (sin auth, solo expone campos seguros) |

### Cómo verificar que funciona

Con un usuario operador logueado, una llamada directa a un endpoint admin devuelve **403 Forbidden** sin tocar la DB. Igualmente, un operador intentando cambiar el estado de un envío de otro operador recibe **403**.

---

## Integración con otras apps (Etapa 3)

Los mocks de Etapa 2 fueron reemplazados por clientes HTTP reales:

| Cliente | App externa | Funciones |
|---------|-------------|-----------|
| `lib/clients/buyer.ts` | Buyer App | `getComprador`, `getPedido`, `notificarEnvioCreado` |
| `lib/clients/seller.ts` | Seller App | `getVendedor` |

### Variables de entorno requeridas

```
BUYER_APP_URL=https://proyecto-c-buyer2-corehardware.vercel.app
BUYER_API_KEY=<provista por el equipo Buyer>
SELLER_APP_URL=https://proyecto-c-seller2-corehardware.vercel.app
SELLER_API_KEY=<provista por el equipo Seller>
```

### Comportamiento ante fallos

Cada cliente está diseñado para **fallar de forma degradada**:

- Si Buyer no responde al crear un envío, el envío se persiste igual y se loguea el error de notificación (no se pierde el dato).
- Si Buyer o Seller no responden al cargar el detalle, la página muestra solo los datos locales con un mensaje "Datos no disponibles" en las secciones afectadas.
- El origen del mapa usa la dirección del vendedor; si no está disponible, cae a la del operador, y por último a Bahía Blanca como default.

Esto asegura que una caída de otra app no rompa la experiencia del operador en su panel.

---

**Dependencias:**
- **Framework:** Next.js 15
- **Autenticación:** Clerk
- **Base de datos:** PostgreSQL (Neon)
- **ORM:** Prisma 6
- **Estilos:** Tailwind CSS
- **Deploy:** Vercel
- **APIs externas:** OpenStreetMap (Nominatim) + OSRM

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>