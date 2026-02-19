# 04b — Dominio

> **Propósito:** Entidades del dominio y sus responsabilidades.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** `backend/app/domain/` y `backend/app/infrastructure/database/models/`

---

## Entidades principales

### User (Usuario / Agente)
- Representa a un miembro del equipo de la agencia.
- Roles: `ADMIN` (acceso total) o `AGENT` (acceso restringido a su agenda).
- Puede captar propiedades, gestionar visitas y eventos de calendario.

### Client (Cliente)
- Persona interesada en comprar, alquilar o vender un inmueble.
- Tipos: `BUYER` (comprador), `TENANT` (inquilino), `OWNER` (propietario).
- Tiene un agente responsable asignado.
- Puede ser propietario de propiedades y protagonista de visitas y operaciones.

### Property (Propiedad)
- Inmueble gestionado por la agencia.
- Tipos: `HOUSE`, `APARTMENT`, `OFFICE`, `LAND`.
- Operación: `SALE` (venta) o `RENT` (alquiler).
- Estados: `AVAILABLE`, `SOLD`, `RENTED`.
- Tiene un agente captador y un cliente propietario.
- Puede tener múltiples imágenes (gestionadas en Cloudinary).
- Puede publicarse en el escaparate público.

### PropertyImage (Imagen de propiedad)
- Imagen asociada a una propiedad.
- Almacenada en Cloudinary; URL y `public_id` persistidos en BD.
- Tiene posición (para ordenación) y flag de portada (`is_cover`).

### CalendarEvent (Evento de calendario)
- Evento en la agenda de un agente.
- Tipos: `VISIT`, `NOTE`, `CAPTATION`, `REMINDER`.
- Estados: `ACTIVE`, `CANCELLED`.
- Puede estar asociado a una propiedad (opcional).
- Los agentes solo ven sus propios eventos.

### Visit (Visita)
- Visita de un cliente a una propiedad, gestionada por un agente.
- Estados: `PENDING`, `DONE`, `CANCELLED`.
- Al crear una visita, se genera automáticamente un `CalendarEvent` de tipo `VISIT`.
- Al eliminar una visita, se elimina el evento de calendario asociado.

### Operation (Operación)
- Proceso de venta o alquiler de una propiedad a un cliente.
- Tipos: `SALE`, `RENT`.
- Estados: `INTEREST` → `NEGOTIATION` → `RESERVED` → `CLOSED` / `CANCELLED`.
- Historial de cambios de estado registrado automáticamente.
- Visible para todos los agentes (historial compartido).

---

## Entidades de soporte

| Entidad | Propósito |
|---------|-----------|
| `ClientNote` | Nota interna sobre un cliente |
| `PropertyNote` | Nota interna sobre una propiedad |
| `PropertyStatusHistory` | Historial de cambios de estado de una propiedad |
| `OperationNote` | Nota interna sobre una operación |
| `OperationStatusHistory` | Historial de cambios de estado de una operación |
| `VisitNote` | Nota interna sobre una visita |
| `DomainEvent` | Registro de eventos de dominio (auditoría) |

---

## Enumeraciones del dominio

| Enum | Valores |
|------|---------|
| `UserRole` | `ADMIN`, `AGENT` |
| `ClientType` | `BUYER`, `TENANT`, `OWNER` |
| `PropertyStatus` | `AVAILABLE`, `SOLD`, `RENTED` |
| `PropertyType` | `HOUSE`, `APARTMENT`, `OFFICE`, `LAND` |
| `OperationType` | `SALE`, `RENT` |
| `OperationStatus` | `INTEREST`, `NEGOTIATION`, `RESERVED`, `CLOSED`, `CANCELLED` |
| `VisitStatus` | `PENDING`, `DONE`, `CANCELLED` |
| `EventType` | `VISIT`, `NOTE`, `CAPTATION`, `REMINDER` |
| `EventStatus` | `ACTIVE`, `CANCELLED` |

---

## Relaciones clave

- `Property` → `Client` (propietario) — N:1
- `Property` → `User` (agente captador) — N:1
- `Property` → `PropertyImage[]` — 1:N (cascade delete)
- `Visit` → `Client`, `Property`, `User` — N:1 cada una
- `Visit` → `CalendarEvent` — 1:1 (sync automático)
- `Operation` → `Client`, `Property`, `User` — N:1 cada una
- `CalendarEvent` → `User` — N:1
- `CalendarEvent` → `Property` — N:1 (opcional)
