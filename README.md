# SOAINT Test — POS System

Ejercicio técnico de frontend. Nuxt 4 + Nuxt UI + Tailwind CSS 4 con autenticación JWT, roles (Supervisor/Operador), transacciones de venta, consultas, cancelaciones y devoluciones con cifrado AES.

## Stack

- **Nuxt 4** / Vue 3 / TypeScript
- **Nuxt UI** — componentes base
- **Tailwind CSS 4** — estilos
- **jsonwebtoken** — JWT con claims estándar (iss, iat, exp, aud, sub, Role)
- **crypto-js** — cifrado AES de datos sensibles de tarjeta
- **zod** — validación de formularios y payloads

## Usuarios de prueba

| Usuario      | Contraseña      | Rol        | Acceso                          |
| ------------ | --------------- | ---------- | ------------------------------- |
| `supervisor` | `supervisor123` | Supervisor | Cancelaciones y devoluciones    |
| `operador`   | `operador123`   | Operador   | Ventas y consultas              |

## Setup

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Abre `http://localhost:3000` — redirige al login.

## Scripts

```bash
pnpm dev        # Servidor de desarrollo
pnpm build      # Build de producción
pnpm lint       # ESLint
pnpm typecheck  # Verificación de tipos
```

## Estructura

```
app/
├── components/    # ConfirmModal, SuccessModal, ErrorAlert, GlobalLoader...
├── composables/   # useAuth, useCardInput, useCrypto, useConfirmModal...
├── layouts/       # default (sidebar + header), auth (login)
├── middleware/    # auth, role
└── pages/         # login, main, operador/*, supervisor/*

server/
├── api/auth/login.post.ts
├── api/transactions/    # sale.post, index.get, cancel.patch, refund.patch
└── utils/               # jwt.ts, mock-data.ts
```

## Endpoints

| Método | Ruta                        | Rol        |
| ------ | --------------------------- | ---------- |
| POST   | `/api/auth/login`           | —          |
| POST   | `/api/transactions/sale`    | Operador   |
| GET    | `/api/transactions`         | Operador   |
| PATCH  | `/api/transactions/cancel`  | Supervisor |
| PATCH  | `/api/transactions/refund`  | Supervisor |

Los datos de tarjeta (número, expiración, CVV) viajan cifrados con AES y nunca se muestran sin enmascarar en la UI.
