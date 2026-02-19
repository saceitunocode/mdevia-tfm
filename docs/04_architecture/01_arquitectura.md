# 04a — Arquitectura del Sistema

> **Propósito:** Arquitectura lógica real del sistema.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** código actual del repositorio.

---

## Diagrama lógico

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                             │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│   VERCEL        │            │   CLOUDINARY    │
│   Frontend      │            │   Imágenes      │
│   Next.js 16    │◄──URLs────►│   (CDN global)  │
└────────┬────────┘            └─────────────────┘
         │ HTTPS REST API
         ▼
┌─────────────────┐
│   RENDER        │
│   Backend       │
│   FastAPI       │
│   Python        │
└────────┬────────┘
         │ SQLAlchemy / psycopg2
         ▼
┌─────────────────┐
│   RENDER        │
│   PostgreSQL 17 │
│   Base de datos │
└─────────────────┘
```

---

## Componentes del sistema

### Frontend — Vercel
- **Framework:** Next.js 16 (App Router)
- **Renderizado:** SSR para escaparate público, CSR para backoffice
- **Autenticación:** JWT almacenado en localStorage, gestionado por `AuthContext`
- **Comunicación:** Fetch API hacia el backend en Render
- **Imágenes:** URLs de Cloudinary consumidas directamente (sin proxy)

### Backend — Render
- **Framework:** FastAPI 0.128 con Uvicorn
- **Arquitectura:** Capas: API → Application (use cases) → Domain → Infrastructure
- **Autenticación:** JWT HS256, validado en cada request mediante dependencias de FastAPI
- **Storage:** Abstracción `StorageService` con implementaciones `local` y `cloudinary`
- **Migraciones:** Alembic

### Base de datos — Render (PostgreSQL)
- **Motor:** PostgreSQL 17
- **ORM:** SQLAlchemy 2.0 (modo síncrono)
- **Conexión:** `DATABASE_URL` proporcionada por Render (con corrección automática `postgres://` → `postgresql://`)

### Cloudinary (CDN de imágenes)
- Activado con `STORAGE_TYPE=cloudinary`
- Subida desde el backend (no desde el frontend)
- `public_id` almacenado en BD para borrado posterior
- Watermark configurable por `CLOUDINARY_WATERMARK_ID`
- URLs servidas directamente al frontend

---

## Arquitectura del backend (capas)

```
app/
├── core/           # Configuración, seguridad (JWT, hashing)
├── domain/
│   ├── enums.py    # Enumeraciones del dominio
│   ├── schemas/    # Schemas Pydantic (request/response)
│   ├── models/     # Modelos de dominio (si aplica)
│   ├── services/   # StorageService (abstracción)
│   └── repositories/ # Interfaces de repositorio
├── application/
│   └── use_cases/  # Lógica de negocio orquestada
└── infrastructure/
    ├── api/v1/     # Routers y endpoints FastAPI
    ├── database/   # Modelos SQLAlchemy, sesión, base
    ├── repositories/ # Implementaciones de repositorio
    └── storage/    # LocalStorage, CloudinaryStorage
```

---

## Flujo de autenticación

```
Frontend → POST /api/v1/login/access-token (email + password)
  Backend → Verifica credenciales en BD
  Backend → Genera JWT (sub=email, role, full_name, exp)
  Frontend ← JWT
  Frontend → Almacena JWT en localStorage
  Frontend → Incluye JWT en header: Authorization: Bearer {token}
  Backend → Valida JWT en cada endpoint protegido (deps.py)
```

---

## Entorno local vs. producción

| Aspecto | Local | Producción |
|---------|-------|-----------|
| Frontend | `localhost:3000` | [Vercel](https://frinmobiliaria.vercel.app/) |
| Backend | `localhost:8000` | [Render](https://mdevia-tfm-backend.onrender.com/) |
| PostgreSQL | Docker Compose | Render |
| Imágenes | Local (`/storage`) | Cloudinary |
| CORS | `localhost:3000` | Dominio Vercel |
