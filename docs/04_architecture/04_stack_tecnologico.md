# 04d — Stack Tecnológico

> **Propósito:** Tecnologías utilizadas y justificación de cada elección.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** `package.json`, `requirements.txt`, código actual.

---

## Frontend

| Tecnología | Versión | Justificación |
|-----------|---------|---------------|
| **Next.js** | 16 | App Router, SSR para escaparate público, CSR para backoffice. Despliegue nativo en Vercel. |
| **React** | 19 | Ecosistema maduro, componentes reutilizables, hooks. |
| **TypeScript** | 5 | Tipado estático, detección de errores en compilación, mejor DX. |
| **Tailwind CSS** | v4 | Utilidades CSS, diseño mobile-first, configuración CSS-first sin fichero JS. |
| **Framer Motion** | 12 | Animaciones declarativas, transiciones de página fluidas. |
| **react-hook-form** | 7 | Formularios performantes, integración con Zod. |
| **Zod** | 4 | Validación de esquemas en frontend y backend (TypeScript-first). |
| **dnd-kit** | 6/10 | Drag-and-drop accesible para reordenación de imágenes, soporte táctil. |
| **Embla Carousel** | 8 | Carrusel de imágenes en ficha pública, autoplay. |
| **date-fns** | 4 | Manipulación de fechas sin dependencias pesadas. |
| **Leaflet / react-leaflet** | 1.9/5 | Mapas interactivos (integración opcional en fichas). |
| **Lucide React** | 0.563 | Iconografía consistente y ligera. |
| **Sonner** | 2 | Notificaciones toast accesibles. |
| **jwt-decode** | 4 | Decodificación de JWT en cliente para leer claims. |
| **Vitest** | 4 | Tests unitarios rápidos, compatible con Vite/Next.js. |
| **Testing Library** | 16 | Tests de componentes centrados en comportamiento del usuario. |
| **ESLint** | 9 | Linting con reglas de Next.js. |
| **Husky** | 9 | Hooks de Git para calidad automática. |
| **pnpm** | — | Gestor de paquetes eficiente (workspaces). |

---

## Backend

| Tecnología | Versión | Justificación |
|-----------|---------|---------------|
| **Python** | 3.11+ | Ecosistema maduro para APIs, tipado progresivo. |
| **FastAPI** | 0.128 | Alto rendimiento, validación automática con Pydantic, docs OpenAPI automáticas. |
| **Pydantic** | v2 | Validación y serialización de datos, schemas de request/response. |
| **SQLAlchemy** | 2.0 | ORM maduro, soporte PostgreSQL, migraciones con Alembic. |
| **Alembic** | 1.18 | Migraciones de BD versionadas. |
| **Uvicorn** | 0.40 | Servidor ASGI de alto rendimiento para FastAPI. |
| **psycopg2-binary** | 2.9 | Driver PostgreSQL para Python. |
| **python-jose** | 3.5 | Generación y validación de JWT. |
| **bcrypt / passlib** | — | Hashing seguro de contraseñas. |
| **cloudinary** | 1.42 | SDK oficial de Cloudinary para subida y gestión de imágenes. |
| **Pillow** | 12 | Procesamiento de imágenes (validación de tipo). |
| **pytest** | 9 | Framework de tests con fixtures y parametrización. |
| **pydantic-settings** | 2.12 | Configuración tipada desde variables de entorno. |

---

## Infraestructura

| Servicio | Propósito |
|---------|-----------|
| **Vercel** | Hosting del frontend Next.js. CI/CD automático desde GitHub. |
| **Render** | Hosting del backend FastAPI y PostgreSQL. |
| **Cloudinary** | CDN de imágenes con transformaciones y watermark. |
| **Docker Compose** | Solo para levantar PostgreSQL en desarrollo local. |
| **GitHub** | Control de versiones y CI/CD. |
| **Linear** | Gestión de tareas y sprints del proyecto. |
