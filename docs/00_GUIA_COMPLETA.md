# 00 — Guía Completa

> **Propósito:** Referencia de instalación local, variables de entorno y comandos.  
> **Última actualización:** Febrero 2026.

---

## Instalación y arranque local

**Requisitos:** Node.js ≥ 20 + pnpm, Python ≥ 3.11, Docker (solo para PostgreSQL)

```bash
# 1. Instalar dependencias (frontend + backend)
make install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Levantar PostgreSQL
make db-up

# 4. Aplicar migraciones
cd backend && . venv/bin/activate && alembic upgrade head && cd ..

# 5. Poblar base de datos con datos de prueba
make db-seed

# 6. Arrancar frontend + backend
make dev
```

**URLs locales:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Docs API (Swagger): `http://localhost:8000/docs`

**Usuario admin por defecto:** `faceituno@frinmobiliaria.com` / `admin123`

---

## Variables de entorno

### `.env` en la raíz del proyecto

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `POSTGRES_USER` | Usuario PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Contraseña PostgreSQL | `postgres` |
| `POSTGRES_DB` | Nombre de la BD | `mdevia_tfm` |
| `POSTGRES_HOST` | Host de la BD | `localhost` |
| `POSTGRES_PORT` | Puerto de la BD | `5432` |
| `STORAGE_TYPE` | Motor de almacenamiento | `local` o `cloudinary` |
| `STORAGE_LOCAL_PATH` | Ruta local para imágenes | `storage` |
| `STORAGE_BASE_URL` | URL base para imágenes locales | `http://localhost:8000/static` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary | — |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | — |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | — |
| `CLOUDINARY_FOLDER` | Carpeta en Cloudinary | `mdevia_tfm` |
| `CLOUDINARY_WATERMARK_ID` | ID del watermark (opcional) | — |

### Variables adicionales del backend

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `SECRET_KEY` | Clave secreta JWT | `changeme` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | `30` |
| `BACKEND_CORS_ORIGINS` | Orígenes CORS permitidos | `http://localhost:3000` |
| `DATABASE_URL` | URL completa de PostgreSQL (Render la provee en producción) | — |


> Para variables de producción e instrucciones de despliegue → [`05_operations/01_deployment_strategy.md`](./05_operations/01_deployment_strategy.md)



---

## Comandos de desarrollo

| Comando | Descripción |
|---------|-------------|
| `make install` | Instala dependencias de frontend y backend |
| `make dev` | Arranca frontend y backend en modo desarrollo |
| `make db-up` | Levanta PostgreSQL con Docker |
| `make db-down` | Detiene PostgreSQL |
| `make db-seed` | Resetea y puebla la BD con datos de prueba |
| `make check` | Ejecuta ESLint + Vitest + pytest |

---

## Comandos de test

```bash
# Calidad completa (ESLint + Vitest + pytest)
make check

# Solo tests frontend
cd frontend && pnpm test

# Solo tests backend
cd backend && . venv/bin/activate && pytest

# Tests con cobertura (backend)
cd backend && . venv/bin/activate && pytest --cov=app

# Lint frontend
cd frontend && pnpm lint
```




## Datos de prueba (seed)

Tras ejecutar `make db-seed` se crean:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| ADMIN | `faceituno@frinmobiliaria.com` | `admin123` |
| ADMIN | `mpoyatos@frinmobiliaria.com` | `admin123` |
| AGENT | `saceituno@frinmobiliaria.com` | `agente123` |
| AGENT | `rmartinez@frinmobiliaria.com` | `agente123` |

Además se crean clientes, propiedades con imágenes, visitas, operaciones y eventos de calendario de ejemplo.
