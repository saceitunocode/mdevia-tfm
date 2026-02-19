# 06a — Mapa de Trazabilidad de Requisitos

> **Propósito:** Trazabilidad entre requisitos, módulos, endpoints y pantallas.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** código actual del repositorio.

---

## Módulo: Autenticación

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Login con email/contraseña | Auth | `POST /api/v1/login/access-token` | `/oficina/acceso` |
| JWT con remember-me (7d/30min) | Auth | `POST /api/v1/login/access-token` | `/oficina/acceso` |
| Perfil del usuario actual | Auth | `GET /api/v1/users/me` | Header del backoffice |
| Protección de rutas privadas | Auth | Middleware `deps.py` | Todas las rutas `/oficina/*` |

---

## Módulo: Usuarios (solo ADMIN)

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listar agentes | Usuarios | `GET /api/v1/users/` | `/oficina/usuarios` |
| Crear agente | Usuarios | `POST /api/v1/users/` | `/oficina/usuarios/nuevo` |
| Ver detalle de agente | Usuarios | `GET /api/v1/users/{id}` | `/oficina/usuarios/[id]` |
| Editar agente (datos + estado) | Usuarios | `PATCH /api/v1/users/{id}` | `/oficina/usuarios/[id]` |

---

## Módulo: Clientes

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listar clientes | Clientes | `GET /api/v1/clients/` | `/oficina/clientes` |
| Crear cliente | Clientes | `POST /api/v1/clients/` | `/oficina/clientes/nuevo` |
| Ver detalle de cliente | Clientes | `GET /api/v1/clients/{id}` | `/oficina/clientes/[id]` |
| Editar cliente | Clientes | `PUT /api/v1/clients/{id}` | `/oficina/clientes/[id]` |
| Eliminar cliente | Clientes | `DELETE /api/v1/clients/{id}` | `/oficina/clientes/[id]` |
| Notas internas por cliente | Clientes | `POST /api/v1/clients/{id}/notes` | `/oficina/clientes/[id]` |

**Tablas:** `clients`, `client_notes`

---

## Módulo: Propiedades

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listar propiedades | Propiedades | `GET /api/v1/properties/` | `/oficina/propiedades` |
| Crear propiedad | Propiedades | `POST /api/v1/properties/` | `/oficina/propiedades/nueva` |
| Ver detalle | Propiedades | `GET /api/v1/properties/{id}` | `/oficina/propiedades/[id]` |
| Editar propiedad | Propiedades | `PUT /api/v1/properties/{id}` | `/oficina/propiedades/[id]` |
| Notas internas | Propiedades | `POST /api/v1/properties/{id}/notes` | `/oficina/propiedades/[id]` |
| Subir imagen | Imágenes | `POST /api/v1/properties/{id}/images` | `/oficina/propiedades/[id]` |
| Eliminar imagen | Imágenes | `DELETE /api/v1/properties/images/{id}` | `/oficina/propiedades/[id]` |
| Reordenar imágenes | Imágenes | `PATCH /api/v1/properties/{id}/images/reorder` | `/oficina/propiedades/[id]` |
| Establecer portada | Imágenes | `PATCH /api/v1/properties/{id}/images/{id}/set-main` | `/oficina/propiedades/[id]` |

**Tablas:** `properties`, `property_images`, `property_notes`, `property_status_history`

---

## Módulo: Agenda (Calendario)

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Ver eventos (mes/semana/día/agenda) | Agenda | `GET /api/v1/calendar-events/` | `/oficina/agenda` |
| Crear evento | Agenda | `POST /api/v1/calendar-events/` | `/oficina/agenda` |
| Ver evento | Agenda | `GET /api/v1/calendar-events/{id}` | `/oficina/agenda` |
| Editar evento | Agenda | `PUT /api/v1/calendar-events/{id}` | `/oficina/agenda` |
| Eliminar evento | Agenda | `DELETE /api/v1/calendar-events/{id}` | `/oficina/agenda` |
| Agentes solo ven sus eventos | Agenda | Lógica en `deps.py` | `/oficina/agenda` |

**Tablas:** `calendar_events`
**Tipos de evento:** `VISIT`, `NOTE`, `CAPTATION`, `REMINDER`

---

## Módulo: Visitas

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listar visitas | Visitas | `GET /api/v1/visits/` | `/oficina/visitas` |
| Crear visita (+ sync calendario) | Visitas | `POST /api/v1/visits/` | `/oficina/visitas` |
| Ver detalle | Visitas | `GET /api/v1/visits/{id}` | `/oficina/visitas/[id]` |
| Editar visita | Visitas | `PATCH /api/v1/visits/{id}` | `/oficina/visitas/[id]` |
| Eliminar visita (+ borrar evento) | Visitas | `DELETE /api/v1/visits/{id}` | `/oficina/visitas/[id]` |
| Notas por visita | Visitas | `POST /api/v1/visits/{id}/notes` | `/oficina/visitas/[id]` |

**Tablas:** `visits`, `visit_notes`

---

## Módulo: Operaciones

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listar operaciones | Operaciones | `GET /api/v1/operations/` | `/oficina/operaciones` |
| Crear operación | Operaciones | `POST /api/v1/operations/` | `/oficina/operaciones` |
| Ver detalle | Operaciones | `GET /api/v1/operations/{id}` | `/oficina/operaciones/[id]` |
| Cambiar estado (con historial) | Operaciones | `PATCH /api/v1/operations/{id}` | `/oficina/operaciones/[id]` |
| Notas por operación | Operaciones | `POST /api/v1/operations/{id}/notes` | `/oficina/operaciones/[id]` |

**Tablas:** `operations`, `operation_notes`, `operation_status_history`
**Estados:** `INTEREST` → `NEGOTIATION` → `RESERVED` → `CLOSED` / `CANCELLED`

---

## Módulo: Dashboard

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| KPIs (propiedades, clientes, visitas, operaciones) | Dashboard | `GET /api/v1/dashboard/` | `/oficina/panel` |
| Tendencias semanales | Dashboard | `GET /api/v1/dashboard/` | `/oficina/panel` |
| Próximas visitas (7 días) | Dashboard | `GET /api/v1/dashboard/` | `/oficina/panel` |
| Propiedades recientes | Dashboard | `GET /api/v1/dashboard/` | `/oficina/panel` |
| Operaciones recientes | Dashboard | `GET /api/v1/dashboard/` | `/oficina/panel` |

---

## Módulo: Escaparate Público

| Requisito | Módulo | Endpoint | Pantalla |
|-----------|--------|----------|---------|
| Listado de propiedades disponibles | Escaparate | `GET /api/v1/properties/public` | `/propiedades` |
| Filtros (ciudad, precio, m², hab., baños, tipo, operación, ascensor, destacadas) | Escaparate | `GET /api/v1/properties/public?{filtros}` | `/propiedades` |
| Ordenación (precio asc/desc, más recientes) | Escaparate | `GET /api/v1/properties/public?sort=...` | `/propiedades` |
| Paginación | Escaparate | `GET /api/v1/properties/public?limit=&offset=` | `/propiedades` |
| Ficha de detalle pública | Escaparate | `GET /api/v1/properties/public/{id}` | `/propiedades/[id]` |
| Página de contacto | Escaparate | — | `/contacto` |
| Aviso legal | Escaparate | — | `/legal` |

**Condición:** `is_published=true` AND `status=AVAILABLE`

---

## Cobertura de tests

| Módulo | Tests de integración | Tests unitarios |
|--------|---------------------|-----------------|
| Autenticación | `test_security_audit_api.py` | — |
| Usuarios | `test_users_api.py` | — |
| Clientes | `test_clients_api.py`, `test_clients_full_flow.py` | — |
| Propiedades | `test_properties_api.py`, `test_properties_full_flow.py`, `test_property_filters.py`, `test_property_relationships.py` | — |
| Imágenes | `test_property_gallery_api.py`, `test_property_image_filtering.py` | — |
| Operaciones | `test_operation_api.py`, `test_operation_flow.py`, `test_operation_notes_api.py` | — |
| Visitas | `test_visit_flow.py`, `test_visit_use_case.py` | — |
| Visitas + Calendario | `test_visit_calendar_flow.py` | — |
| Calendario | `test_calendar_api.py` | — |
| Modelos transversales | `test_transversal_models.py` | — |
| Frontend (componentes) | — | `PropertyGalleryManager.test.tsx`, `smoke.test.ts` |
