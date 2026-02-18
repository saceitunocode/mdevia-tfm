# 05 — Estrategia de Despliegue

> **Propósito:** Cómo desplegar el sistema en local y en producción.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** `docker-compose.yml`, `Makefile`, `config.py`, código actual.

---

## Entorno local

> Para arrancar el proyecto en local, ver [`docs/00_GUIA_COMPLETA.md`](../00_GUIA_COMPLETA.md).

---


## Producción

### Arquitectura de producción

```
GitHub (push a master)
  ├── Vercel (frontend) — deploy automático
  └── Render (backend + PostgreSQL) — deploy automático
```

### Frontend — Vercel

1. Conectar repositorio GitHub a Vercel.
2. Configurar directorio raíz: `frontend/`.
3. Framework: Next.js (detectado automáticamente).
4. Variables de entorno en Vercel:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | URL del backend en Render (ej: `https://tu-backend.onrender.com`) |

### Backend — Render

1. Crear un nuevo **Web Service** en Render.
2. Conectar repositorio GitHub.
3. Directorio raíz: `backend/`.
4. Comando de build: `pip install -r requirements.txt`
5. Comando de start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Variables de entorno en Render:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Proporcionada por Render (PostgreSQL) |
| `SECRET_KEY` | Clave secreta segura (mínimo 32 chars) |
| `BACKEND_CORS_ORIGINS` | `https://tu-dominio.vercel.app,http://localhost:3000` |
| `STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | Tu cloud name |
| `CLOUDINARY_API_KEY` | Tu API key |
| `CLOUDINARY_API_SECRET` | Tu API secret |
| `CLOUDINARY_FOLDER` | `mdevia_tfm` |
| `CLOUDINARY_WATERMARK_ID` | ID del watermark (opcional) |

> **Nota:** Render convierte automáticamente `postgres://` a `postgresql://`. El backend también lo hace en `config.py` como salvaguarda.

### Base de datos — Render (PostgreSQL)

1. Crear un nuevo **PostgreSQL** en Render.
2. Render proporciona `DATABASE_URL` automáticamente al Web Service.
3. Aplicar migraciones tras el primer despliegue:

```bash
# Desde el shell de Render o localmente con DATABASE_URL de producción
alembic upgrade head
```

---

## Flujo de despliegue (paso a paso)

```
1. Desarrollar en rama feature/TFM-XX
2. Pull Request a develop
3. make check (ESLint + Vitest + pytest) — CI local
4. Merge a develop
5. Merge a master
6. Vercel detecta push a master → build y deploy automático del frontend
7. Render detecta push a master → build y deploy automático del backend
8. Verificar en producción:
   - Escaparate público accesible
   - Login funciona
   - Imágenes se suben a Cloudinary
```
