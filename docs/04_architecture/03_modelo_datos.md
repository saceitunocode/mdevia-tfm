# 04c — Modelo de Datos

> **Propósito:** Tablas reales de la base de datos y sus relaciones.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** `backend/app/infrastructure/database/models/`

---

## Tablas

### `users`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `email` | VARCHAR | UNIQUE, NOT NULL |
| `full_name` | VARCHAR | NOT NULL |
| `phone_number` | VARCHAR | nullable |
| `password_hash` | VARCHAR | NOT NULL |
| `role` | ENUM(UserRole) | NOT NULL, default=AGENT |
| `is_active` | BOOLEAN | NOT NULL, default=true |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `clients`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `full_name` | VARCHAR | NOT NULL |
| `email` | VARCHAR | nullable |
| `phone` | VARCHAR | nullable |
| `type` | ENUM(ClientType) | NOT NULL |
| `responsible_agent_id` | UUID | FK → users.id, nullable |
| `is_active` | BOOLEAN | NOT NULL, default=true |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `properties`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `title` | VARCHAR | NOT NULL |
| `address_line1` | VARCHAR | NOT NULL |
| `address_line2` | VARCHAR | nullable |
| `city` | VARCHAR | NOT NULL |
| `postal_code` | VARCHAR | nullable |
| `sqm` | INTEGER | NOT NULL |
| `rooms` | INTEGER | NOT NULL |
| `baths` | INTEGER | NOT NULL, default=1 |
| `floor` | INTEGER | nullable |
| `has_elevator` | BOOLEAN | NOT NULL, default=false |
| `status` | ENUM(PropertyStatus) | NOT NULL, default=AVAILABLE, INDEX |
| `property_type` | ENUM(PropertyType) | NOT NULL, default=APARTMENT, INDEX |
| `operation_type` | ENUM(OperationType) | NOT NULL, default=SALE, INDEX |
| `owner_client_id` | UUID | FK → clients.id, NOT NULL, INDEX |
| `captor_agent_id` | UUID | FK → users.id, NOT NULL, INDEX |
| `public_description` | TEXT | nullable |
| `internal_notes` | TEXT | nullable |
| `price_amount` | NUMERIC(12,2) | nullable |
| `price_currency` | VARCHAR(3) | NOT NULL, default=EUR |
| `is_published` | BOOLEAN | NOT NULL, default=true |
| `is_featured` | BOOLEAN | NOT NULL, default=false |
| `is_active` | BOOLEAN | NOT NULL, default=true |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `property_images`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `property_id` | UUID | FK → properties.id, NOT NULL |
| `url` | VARCHAR | NOT NULL |
| `public_id` | VARCHAR | nullable (ID en Cloudinary) |
| `caption` | VARCHAR | nullable |
| `alt_text` | VARCHAR | nullable |
| `is_cover` | BOOLEAN | NOT NULL, default=false |
| `position` | INTEGER | NOT NULL, default=0 |
| `is_active` | BOOLEAN | NOT NULL, default=true |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### `client_notes` / `property_notes` / `visit_notes` / `operation_notes`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `{entity}_id` | UUID | FK → {tabla}.id, NOT NULL |
| `author_id` | UUID | FK → users.id, NOT NULL |
| `text` | TEXT | NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |

### `visits`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `client_id` | UUID | FK → clients.id, NOT NULL |
| `property_id` | UUID | FK → properties.id, NOT NULL |
| `agent_id` | UUID | FK → users.id, NOT NULL |
| `scheduled_at` | TIMESTAMPTZ | NOT NULL |
| `status` | ENUM(VisitStatus) | NOT NULL, default=PENDING |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `calendar_events`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `agent_id` | UUID | FK → users.id, NOT NULL |
| `property_id` | UUID | FK → properties.id, nullable |
| `title` | VARCHAR | NOT NULL |
| `type` | ENUM(EventType) | NOT NULL |
| `status` | ENUM(EventStatus) | NOT NULL, default=ACTIVE |
| `start_at` | TIMESTAMPTZ | NOT NULL |
| `end_at` | TIMESTAMPTZ | nullable |
| `description` | TEXT | nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `operations`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `type` | ENUM(OperationType) | NOT NULL |
| `status` | ENUM(OperationStatus) | NOT NULL, default=INTEREST |
| `client_id` | UUID | FK → clients.id, NOT NULL |
| `property_id` | UUID | FK → properties.id, NOT NULL |
| `agent_id` | UUID | FK → users.id, NOT NULL |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `updated_at` | TIMESTAMPTZ | NOT NULL |

### `property_status_history` / `operation_status_history`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `{entity}_id` | UUID | FK → {tabla}.id, NOT NULL |
| `old_status` | ENUM | NOT NULL |
| `new_status` | ENUM | NOT NULL |
| `changed_by` | UUID | FK → users.id, NOT NULL |
| `changed_at` | TIMESTAMPTZ | NOT NULL |

### `domain_events`
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| `id` | UUID | PK |
| `aggregate_type` | VARCHAR | NOT NULL |
| `aggregate_id` | UUID | NOT NULL |
| `event_type` | VARCHAR | NOT NULL |
| `payload` | JSON | nullable |
| `created_at` | TIMESTAMPTZ | NOT NULL |

---

## Diagrama de relaciones (simplificado)

```
users ──────────────────────────────────────────────────┐
  │ (captor_agent_id)                                   │
  ▼                                                     │
properties ──────────────────────────────────────────┐  │
  │ (owner_client_id)                                │  │
  ▼                                                  │  │
clients                                              │  │
  │                                                  │  │
  ├──► visits ◄──────────────────────────────────────┘  │
  │      │ (sync)                                       │
  │      ▼                                              │
  │   calendar_events ◄─────────────────────────────────┘
  │
  └──► operations ◄─────────────────────────────────────┘

properties ──► property_images (Cloudinary)
properties ──► property_notes
properties ──► property_status_history
clients    ──► client_notes
visits     ──► visit_notes
operations ──► operation_notes
operations ──► operation_status_history
```
