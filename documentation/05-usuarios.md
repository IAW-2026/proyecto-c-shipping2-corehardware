# 1.5 — Usuarios Compartidos

> **Tipo C — Marketplace**

El sistema utiliza **Clerk** como servicio centralizado de autenticación. Los usuarios se autentican a través de Clerk independientemente de qué app estén usando, y la identidad se propaga entre servicios mediante el token JWT emitido por Clerk.

---

## ¿Qué apps comparten usuarios?

| Usuario | Apps donde puede autenticarse |
|---------|------------------------------|
| Comprador | Buyer, Payments |
| Vendedor | Seller, Payments |
| Operador | Shipping |
| Administrador | Buyer, Seller, Shipping, Payments |

<!-- Definir claramente qué roles de usuario existen y en qué apps pueden autenticarse. Un mismo usuario de Clerk puede tener acceso a más de una app. Por ejemplo, ¿un usuario puede ser comprador y vendedor al mismo tiempo? -->

---

## Claims del JWT relevantes por app

| App | Claims utilizados | Para qué |
|-----|------------------|----------|
| Buyer App | `sub`, `role:buyer`, `role:admin` | Identificar comprador, verificar rol `buyer`, verificar rol `admin` |
| Seller App | `sub`, `role:seller`, `role:admin` | Identificar vendedor, verificar rol `seller`, verificar rol `admin` |
| Shipping App | `sub`, `role:logistics`, `role:admin` | Identificar operador, verificar rol `logistics`, verificar rol `admin` |
| Payments App | `sub`, `role:buyer`, `role:seller`, `role:admin` | Asociar transacciones al usuario, verificar rol `buyer` o `seller`, verificar rol `admin` |

Los roles se gestionan como metadata en Clerk.
<!-- Definir si los roles se gestionan como metadata en Clerk (publicMetadata) o de otra forma. -->

---

## Estrategia de roles

La estrategia sera metadata en Clerk: `publicMetadata.role = "buyer" | "seller" | "logistics" | "admin"`

<!-- Describir cómo se define si un usuario es comprador, vendedor, operador logístico o administrador.
Opciones comunes:
- Metadata en Clerk: `publicMetadata.role = "buyer" | "seller" | "logistics" | "admin"`
- Roles múltiples: `publicMetadata.roles = ["buyer", "seller"]` (si un usuario puede tener ambos roles)
- Organización separada por tipo de usuario en Clerk
- Roles gestionados localmente en cada app
-->