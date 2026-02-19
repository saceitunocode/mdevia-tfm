# 03b — User Flows

> **Propósito:** Flujos reales de usuario implementados en el sistema.
> **Última actualización:** Febrero 2026.
> **Fuente de verdad:** código actual del repositorio.

---

## 1. Login

```
Usuario → /oficina/acceso
  → Introduce email + contraseña
  → [Opcional] Marca "Recuérdame"
  → POST /api/v1/login/access-token
    → Si correcto: JWT guardado en localStorage → Redirect a /oficina/panel
    → Si incorrecto: Toast de error
    → Si usuario inactivo: Toast "Usuario inactivo"
```

**Detalles:**
- Token con expiración de 30 min (sin remember) o 7 días (con remember).
- `AuthContext` gestiona el estado global de autenticación.
- Rutas protegidas redirigen a `/oficina/acceso` si no hay token.
- Datos del usuario (nombre, email) se muestran desde el JWT y se actualizan desde `/users/me` (stale-while-revalidate).

---

## 2. Crear propiedad con imágenes

```
Agente → /oficina/propiedades → "Nueva propiedad"
  → Formulario: título, dirección, ciudad, CP, m², habitaciones, baños, planta, ascensor, precio, tipo, operación, descripción pública, notas internas, cliente propietario
  → POST /api/v1/properties/
    → Propiedad creada con captor_agent_id = usuario actual
  → Redirect a /oficina/propiedades/{id}
  → Sección "Galería de imágenes" (PropertyGalleryManager)
    → Seleccionar archivo(s) → POST /api/v1/properties/{id}/images (multipart)
      → Imagen subida a Cloudinary → URL persistida en BD
    → Reordenar imágenes: drag-and-drop (desktop) / modo selección táctil (móvil)
      → PATCH /api/v1/properties/{id}/images/reorder
    → Establecer portada: PATCH /api/v1/properties/{id}/images/{image_id}/set-main
    → Eliminar imagen: DELETE /api/v1/properties/images/{image_id}
      → Borrado en Cloudinary + BD
```

---

## 3. Gestión de agenda

### 3a. Crear evento de calendario

```
Agente → /oficina/agenda
  → Selecciona vista (mes/semana/día/agenda)
  → Clic en "Nuevo evento" o en un día del calendario
  → Dialog: título, tipo (VISIT/NOTE/CAPTATION/REMINDER), fecha, hora inicio/fin, descripción
  → POST /api/v1/calendar-events/
    → Evento creado para el agente actual
  → Calendario se actualiza con el nuevo evento
```

### 3b. Crear visita (con sync automático al calendario)

```
Agente → /oficina/visitas → "Nueva visita"
  → Formulario: cliente, propiedad, fecha/hora, agente
  → POST /api/v1/visits/
    → Visita creada
    → Evento de calendario tipo VISIT creado automáticamente
  → Visita aparece en /oficina/visitas y en /oficina/agenda
```

### 3c. Eliminar visita

```
Agente → /oficina/visitas → Eliminar visita
  → DELETE /api/v1/visits/{id}
    → Visita eliminada
    → Evento de calendario asociado eliminado automáticamente
```

---

## 4. Gestión de operaciones

```
Agente → /oficina/operaciones → "Nueva operación"
  → Formulario: tipo (SALE/RENT), cliente, propiedad, agente
  → POST /api/v1/operations/
  → Estado inicial: INTEREST
  → Agente actualiza estado: INTEREST → NEGOTIATION → RESERVED → CLOSED/CANCELLED
    → PATCH /api/v1/operations/{id}
    → Historial de cambios de estado registrado automáticamente
  → Notas internas: POST /api/v1/operations/{id}/notes
```

---

## 5. Publicación en escaparate

```
Admin/Agente → /oficina/propiedades/{id} → Editar
  → Activa "Publicar en escaparate" (is_published = true)
  → Activa "Destacada" (is_featured = true) [opcional]
  → PUT /api/v1/properties/{id}
  → Propiedad aparece en GET /api/v1/properties/public
  → Visible en /propiedades (escaparate público)
```

**Condición para aparecer en escaparate:**
- `is_published = true`
- `status = AVAILABLE`

---

## 6. Búsqueda en escaparate público (sin login)

```
Visitante → /propiedades
  → Aplica filtros: ciudad, precio, m², habitaciones, baños, tipo, operación, ascensor
  → GET /api/v1/properties/public?{filtros}
  → Resultados en grid (tarjetas con imagen de portada, precio, características)
  → Clic en tarjeta → /propiedades/{id}
    → GET /api/v1/properties/public/{id}
    → Ficha completa: galería, descripción, características, datos de contacto del agente
```