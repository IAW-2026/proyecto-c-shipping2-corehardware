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
- **Mocks:** las llamadas a Buyer App están en `src/lib/mocks.ts`, listas para reemplazarse en la Etapa 3
- **Estados de envío:** `PENDIENTE → ASIGNADO → RETIRADO → EN_CAMINO → ENTREGADO`, con transiciones validadas tanto en frontend como backend
- **Webhook de Clerk:** configurado para asignar rol `logistics` automáticamente al crear operadores

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