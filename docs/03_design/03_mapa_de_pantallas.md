# 03c — Mapa de Pantallas

> **Propósito:** Rutas reales del frontend.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** `frontend/src/app/`

---

## Rutas públicas `(public)`

| Ruta | Descripción | Auth |
|------|-------------|------|
| `/` | Home: hero, servicios, escaparate destacado | No |
| `/propiedades` | Listado de propiedades con filtros y paginación | No |
| `/propiedades/[id]` | Ficha de detalle de propiedad | No |
| `/contacto` | Formulario de contacto | No |
| `/legal` | Aviso legal estático | No |

---

## Rutas privadas `(admin)/oficina`

| Ruta | Descripción | Rol mínimo |
|------|-------------|-----------|
| `/oficina/acceso` | Login | — |
| `/oficina` | Redirect a `/oficina/panel` | AGENT |
| `/oficina/panel` | Dashboard con KPIs y actividad reciente | AGENT |
| `/oficina/clientes` | Listado de clientes | AGENT |
| `/oficina/clientes/nuevo` | Formulario de creación de cliente | AGENT |
| `/oficina/clientes/[id]` | Ficha de detalle y edición de cliente | AGENT |
| `/oficina/propiedades` | Listado de propiedades | AGENT |
| `/oficina/propiedades/nueva` | Formulario de creación de propiedad | AGENT |
| `/oficina/propiedades/[id]` | Ficha de detalle, edición y galería de imágenes | AGENT |
| `/oficina/agenda` | Calendario con vistas mes/semana/día/agenda | AGENT |
| `/oficina/visitas` | Listado de visitas | AGENT |
| `/oficina/visitas/[id]` | Detalle de visita | AGENT |
| `/oficina/operaciones` | Listado de operaciones | AGENT |
| `/oficina/operaciones/[id]` | Detalle de operación | AGENT |
| `/oficina/usuarios` | Listado de agentes | ADMIN |
| `/oficina/usuarios/nuevo` | Formulario de creación de agente | ADMIN |
| `/oficina/usuarios/[id]` | Ficha de detalle y edición de agente | ADMIN |

---

## Páginas de error

| Ruta | Descripción |
|------|-------------|
| `/not-found` | Página 404 personalizada |
| Error boundary | Página de error genérica (`error.tsx`) |

---

## Notas de navegación

- El layout de `(admin)` incluye sidebar de navegación y header con datos del usuario.
- El layout de `(public)` incluye header con logo y menú, y footer con aviso legal.
- Las rutas privadas redirigen a `/oficina/acceso` si no hay token JWT válido.
