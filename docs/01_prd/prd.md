# 01 — PRD (Product Requirements Document)

> **Propósito:** Alcance real implementado en el proyecto.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** código actual del repositorio.

---

## Descripción del producto

**mdevia-tfm** es un CRM inmobiliario web con dos áreas diferenciadas:

1. **Backoffice privado** — gestión interna para agentes y administradores.
2. **Escaparate público** — portal de búsqueda de propiedades para clientes finales.

---

## Roles y permisos

| Rol | Acceso |
|-----|--------|
| **ADMIN** | Acceso total: gestión de usuarios, clientes, propiedades, visitas, operaciones, agenda, dashboard |
| **AGENT** | Acceso restringido: solo ve sus propias visitas y eventos de calendario; puede gestionar clientes y propiedades |

### Restricciones por rol (implementadas en backend)
- Agentes **no pueden** crear eventos de calendario para otros agentes.
- Agentes **solo ven** sus propios eventos de calendario y visitas.
- Gestión de usuarios (crear, editar, listar) es **exclusiva de ADMIN**.
- Operaciones son visibles para todos los agentes (historial compartido).

---

## Módulos implementados

### 1. Autenticación
- Login con email y contraseña.
- JWT con expiración de 30 minutos (o 7 días con "Recuérdame").
- Protección de rutas en frontend mediante `AuthContext`.
- Seed inicial con 2 administradores y 2 agentes.

---

### 2. Dashboard
- KPIs en tiempo real: total propiedades, clientes activos, visitas pendientes, operaciones activas.
- Tendencias semanales (comparativa con semana anterior).
- Desglose de propiedades por estado (disponible, vendida, alquilada).
- Próximas visitas (7 días).
- Propiedades recientes (últimas 5).
- Operaciones recientes (últimas 5).

---

### 3. Clientes
- Listado con búsqueda.
- Ficha de detalle con historial de notas.
- Creación y edición (nombre, email, teléfono, tipo: BUYER/TENANT/OWNER, agente responsable).
- Eliminación lógica (`is_active`).
- Notas internas por cliente.

---

### 4. Propiedades
- Listado con filtros (estado, tipo, operación).
- Ficha de detalle con galería de imágenes.
- Creación y edición (título, dirección, ciudad, código postal, m², habitaciones, baños, planta, ascensor, precio, descripción pública, notas internas).
- Tipos: HOUSE, APARTMENT, OFFICE, LAND.
- Operación: SALE o RENT.
- Estados: AVAILABLE, SOLD, RENTED.
- Publicación en escaparate (`is_published`, `is_featured`).
- Notas internas por propiedad.

#### Gestión de imágenes (Cloudinary)
- Subida múltiple de imágenes vía formulario multipart.
- Reordenación drag-and-drop (escritorio) y modo selección táctil (móvil).
- Establecer imagen de portada.
- Eliminación individual con borrado en Cloudinary.
- Watermark configurable.
- URLs persistidas en BD; frontend las consume directamente.

---

### 5. Agenda (Calendario)
- Vistas: mes, semana, día y agenda.
- Tipos de evento: VISIT, NOTE, CAPTATION, REMINDER.
- Creación, edición y eliminación de eventos.
- Agentes solo ven sus propios eventos.
- Admins pueden ver todos los eventos o filtrar por agente.
- Sincronización automática con visitas (crear una visita genera un evento de calendario).

---

### 6. Visitas
- Listado de visitas con filtros (agente, propiedad, cliente).
- Creación con sincronización automática al calendario.
- Edición de estado: PENDING, DONE, CANCELLED.
- Eliminación con borrado automático del evento de calendario asociado.
- Notas por visita.

---

### 7. Operaciones
- Listado de operaciones (historial compartido entre agentes).
- Tipos: SALE, RENT.
- Estados: INTEREST → NEGOTIATION → RESERVED → CLOSED / CANCELLED.
- Historial de cambios de estado automático.
- Notas por operación.

---

### 8. Usuarios (solo ADMIN)
- Listado de agentes.
- Creación de nuevos agentes (rol forzado a AGENT).
- Edición de datos y estado (activo/inactivo).
- Perfil propio (`/users/me`).

---

### 9. Escaparate público (sin autenticación)
- Listado de propiedades publicadas y disponibles.
- Filtros: ciudad, precio (min/max), m² (min/max), habitaciones, baños, tipo, operación, ascensor, destacadas.
- Ordenación: precio ascendente, precio descendente, más recientes.
- Paginación (limit/offset).
- Ficha de detalle pública con galería, descripción, características y datos de contacto del agente.
- Página de contacto.
- Aviso legal estático.

---

## Alcance NO implementado

- Tests E2E (Playwright).
- Monitorización de errores (Sentry).
- Notificaciones push o email.
- Integración con portales inmobiliarios externos.
