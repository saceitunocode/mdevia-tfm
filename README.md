<div align="center">

# 🎓 mdevia-tfm

### Sistema CRM para Gestión Inmobiliaria
**Trabajo de Fin de Máster**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## ¿Qué es este proyecto?

**mdevia-tfm** es un sistema CRM web completo para la gestión interna de una agencia inmobiliaria, desarrollado como Trabajo de Fin de Máster.

El sistema tiene dos interfaces diferenciadas:

- **Escaparate público** — Portal sin login donde cualquier visitante puede buscar y filtrar propiedades disponibles.
- **Backoffice privado** — Panel de gestión para agentes y administradores, con acceso mediante JWT.

---

## Módulos implementados

| Módulo | Descripción |
|--------|-------------|
| **Autenticación** | Login con JWT, roles ADMIN/AGENT, opción "recuérdame" |
| **Dashboard** | KPIs en tiempo real: propiedades, clientes, visitas, operaciones + tendencias semanales |
| **Clientes** | CRUD completo con notas internas y agente responsable |
| **Propiedades** | CRUD con galería de imágenes (Cloudinary), drag-and-drop, publicación en escaparate |
| **Agenda** | Calendario con vistas mes/semana/día/agenda y 4 tipos de evento |
| **Visitas** | Gestión de visitas con sincronización automática al calendario |
| **Operaciones** | Seguimiento comercial con historial de estados (INTEREST → CLOSED) |
| **Usuarios** | Gestión de agentes (solo ADMIN) |
| **Escaparate** | Listado público con filtros, paginación y ficha de detalle |

---

## Stack tecnológico

**Frontend:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · dnd-kit  
**Backend:** Python · FastAPI 0.128 · SQLAlchemy 2.0 · Pydantic v2 · Alembic  
**Base de datos:** PostgreSQL 17  
**Imágenes:** Cloudinary (CDN con watermark configurable)  
**Despliegue:** Vercel (frontend) · Render (backend + PostgreSQL)  
**Calidad:** Vitest · pytest · ESLint v9 · Husky v9

> Detalle completo con justificación de cada elección → [`docs/04_architecture/04_stack_tecnologico.md`](docs/04_architecture/04_stack_tecnologico.md)

---

## Arranque local

**Requisitos:** Node.js ≥ 20, Python ≥ 3.11, Docker (solo para PostgreSQL)

```bash
# 1. Instalar dependencias
make install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Levantar PostgreSQL
make db-up

# 4. Aplicar migraciones y poblar BD
cd backend && . venv/bin/activate && alembic upgrade head && cd ..
make db-seed

# 5. Arrancar frontend + backend
make dev
```

**URLs locales:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Docs API (Swagger): http://localhost:8000/docs

**Usuario admin por defecto:** `faceituno@frinmobiliaria.com` / `admin123`

> Guía completa con variables de entorno → [`docs/00_GUIA_COMPLETA.md`](docs/00_GUIA_COMPLETA.md)

---

## Despliegue en producción

El sistema se despliega en dos servicios independientes:

- **Frontend → Vercel** (directorio `frontend/`, variable `NEXT_PUBLIC_API_URL`)
- **Backend + BD → Render** (directorio `backend/`, PostgreSQL gestionado por Render)
- **Imágenes → Cloudinary** (activado con `STORAGE_TYPE=cloudinary`)

> Instrucciones paso a paso → [`docs/05_operations/01_deployment_strategy.md`](docs/05_operations/01_deployment_strategy.md)

---

## Estructura del repositorio

```
mdevia-tfm/
├── frontend/               # Next.js 16 (App Router)
│   └── src/app/
│       ├── (public)/       # Escaparate: /, /propiedades, /contacto, /legal
│       └── (admin)/oficina/ # Backoffice: panel, clientes, propiedades, agenda...
├── backend/                # FastAPI
│   └── app/
│       ├── core/           # Config, seguridad JWT
│       ├── domain/         # Enums, schemas, servicios
│       ├── application/    # Casos de uso
│       └── infrastructure/ # Endpoints, modelos SQLAlchemy, repositorios
├── docs/                   # Documentación técnica completa
├── docker-compose.yml      # Solo PostgreSQL local
├── Makefile                # Comandos de desarrollo
└── .env.example            # Variables de entorno de ejemplo
```

---

## Documentación técnica

| # | Documento | Contenido |
|---|-----------|----------|
| 00 | [`docs/00_GUIA_COMPLETA.md`](docs/00_GUIA_COMPLETA.md) | Instalación local, variables de entorno, comandos |
| 01 | [`docs/01_prd/prd.md`](docs/01_prd/prd.md) | Alcance real, roles, módulos implementados |
| 02 | [`docs/02_backlog/`](docs/02_backlog/00_BACKLOG.md) | Backlog por épicas con criterios de aceptación reales |
| 03a | [`docs/03_design/01_principios_de_diseno.md`](docs/03_design/01_principios_de_diseno.md) | Sistema visual, responsive, componentes clave |
| 03b | [`docs/03_design/02_user_flows.md`](docs/03_design/02_user_flows.md) | Flujos reales de usuario |
| 03c | [`docs/03_design/03_mapa_de_pantallas.md`](docs/03_design/03_mapa_de_pantallas.md) | Rutas públicas y privadas |
| 03d | [`docs/03_design/04_wireframes_textuales.md`](docs/03_design/04_wireframes_textuales.md) | Estructura visual de pantallas clave |
| 04a | [`docs/04_architecture/01_arquitectura.md`](docs/04_architecture/01_arquitectura.md) | Diagrama lógico, componentes, flujo de auth |
| 04b | [`docs/04_architecture/02_dominio.md`](docs/04_architecture/02_dominio.md) | Entidades, enums y relaciones |
| 04c | [`docs/04_architecture/03_modelo_datos.md`](docs/04_architecture/03_modelo_datos.md) | Tablas y relaciones reales |
| 04d | [`docs/04_architecture/04_stack_tecnologico.md`](docs/04_architecture/04_stack_tecnologico.md) | Tecnologías con versiones y justificación |
| 05 | [`docs/05_operations/01_deployment_strategy.md`](docs/05_operations/01_deployment_strategy.md) | Despliegue local, Vercel y Render |
| 06a | [`docs/06_trazabilidad/mapa_requisitos.md`](docs/06_trazabilidad/mapa_requisitos.md) | Requisitos → módulos → endpoints → pantallas |
| 06b | [`docs/06_trazabilidad/linear_workflow.md`](docs/06_trazabilidad/linear_workflow.md) | Gestión del proyecto con Linear |

---

## Acceso al proyecto

| Recurso | URL |
|---------|-----|
| 🌐 **Aplicación en producción** | [frinmobiliaria.vercel.app](https://frinmobiliaria.vercel.app) |
| 🔌 **API REST (Swagger)** | [mdevia-tfm-backend.onrender.com/docs](https://mdevia-tfm-backend.onrender.com/docs) |
| 📦 **Repositorio GitHub** | [github.com/saceitunocode/mdevia-tfm](https://github.com/saceitunocode/mdevia-tfm) |
| 🎞️ **Presentación (slides)** | *(próximamente)* |

> ⚠️ **Nota sobre el backend (Render plan gratuito):** el servicio entra en hibernación tras un periodo de inactividad. Al acceder por primera vez, puede tardar entre **40 y 50 segundos** en arrancar. Una vez activo, **todas las peticiones posteriores son instantáneas** y el rendimiento es normal.

---

## Gestión del proyecto

- **Herramienta:** [Linear — MDEVIA-TFM](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae/overview)
- **Metodología:** Issues por épica (TFM-XX), ramas `feature/TFM-XX`, cierre automático por PR

---

<div align="center">

*Desarrollado como TFM · Febrero 2026*

</div>