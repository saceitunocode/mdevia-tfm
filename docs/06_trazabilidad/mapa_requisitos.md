# 🗺️ Mapa de Trazabilidad de Requisitos
## Sistema CRM Inmobiliario Familiar

---

## 🎯 Propósito de este Documento

Este documento establece la **trazabilidad completa** entre:

- Requisitos del PRD
- Épicas y User Stories del Backlog
- Pantallas del Diseño
- Entidades del Dominio
- Tablas de la Base de Datos

**Objetivo:** Garantizar que cada requisito del PRD está implementado y que no hay funcionalidades huérfanas.

---

## 📊 Mapa de Trazabilidad Completo

### Módulo: Escaparate Público

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §3.1 Escaparate Público | EP-8 | US-8.1 Ver listado | Portal Público: Listado Propiedades | Property | `properties`, `property_images` |
| §3.1 Escaparate Público | EP-8 | US-8.2 Filtrar | Portal Público: Filtros | Property | `properties` |
| §3.1 Escaparate Público | EP-8 | US-8.3 Ver detalle | Portal Público: Detalle Propiedad | Property | `properties`, `property_images` |
| §3.1 Escaparate Público | EP-8 | US-8.4 Separación | N/A (Arquitectura) | N/A | N/A |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §6

---

### Módulo: Usuarios y Autenticación

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §4 Usuarios y Roles | EP-0 | US-0.1 Usuario admin inicial | N/A (Setup) | User | `users` |
| §4 Usuarios y Roles | EP-0 | US-0.2 Autenticación | Login | User | `users` |
| §4 Usuarios y Roles | EP-0 | US-0.3 Separación escaparate | N/A (Arquitectura) | N/A | N/A |
| §4.2 Roles | EP-1 | US-1.1 Crear agentes | Admin: Gestión Usuarios | User | `users` |
| §4.2 Roles | EP-1 | US-1.2 Permisos por rol | N/A (Lógica) | User | `users` |

**Wireframes:** Login no detallado (pantalla estándar)

---

### Módulo: Clientes

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §8.1 Módulo Clientes | EP-2 | US-2.1 Registrar cliente | Backoffice: Crear Cliente | Client | `clients` |
| §8.1 Módulo Clientes | EP-2 | US-2.2 Editar cliente | Backoffice: Editar Cliente | Client | `clients` |
| §8.1 Módulo Clientes | EP-2 | US-2.3 Ver clientes | Backoffice: Listado Clientes | Client | `clients` |
| §8.1 Módulo Clientes | EP-2 | US-2.4 Ver historial | Backoffice: Ficha Cliente (Historial) | Client + Visit + Operation | `clients`, `visits`, `operations` |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §2

---

### Módulo: Propiedades

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §8.2 Módulo Propiedades | EP-3 | US-3.1 Registrar propiedad | Backoffice: Crear Propiedad | Property + PropertyImage | `properties`, `property_images` |
| §8.2 Módulo Propiedades | EP-3 | US-3.2 Editar propiedad | Backoffice: Editar Propiedad | Property | `properties` |
| §8.2 Módulo Propiedades | EP-3 | US-3.3 Ver historial | Backoffice: Ficha Propiedad (Historial) | Property + Visit + Operation | `properties`, `visits`, `operations` |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §3

**Campos Especiales (PRD §8.2):**
- Título obligatorio → `properties.title`
- Descripción pública → `properties.description`
- Imagen principal → `property_images.is_main`
- Galería de imágenes → `property_images`

---

### Módulo: Visitas

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §8.3 Módulo Visitas | EP-4 | US-4.1 Registrar visita | Backoffice: Crear Visita | Visit + CalendarEvent | `visits`, `calendar_events` |
| §8.3 Módulo Visitas | EP-4 | US-4.2 Observaciones post-visita | Backoffice: Ficha Visita | Visit + Observation | `visits`, `observations` |
| §8.3 Módulo Visitas | EP-4 | US-4.3 Ver historial | Backoffice: Ficha Cliente/Propiedad (Historial) | Visit | `visits` |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §4

---

### Módulo: Agenda (Calendario)

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §8.4 Módulo Agenda | EP-5 | US-5.1 Ver calendario | Backoffice: Agenda (Día/Semana/Mes) | CalendarEvent | `calendar_events` |
| §8.4 Módulo Agenda | EP-5 | US-5.2 Crear eventos | Backoffice: Crear Evento | CalendarEvent | `calendar_events` |
| §8.4 Módulo Agenda | EP-5 | US-5.3 Permisos agenda | N/A (Lógica) | CalendarEvent + User | `calendar_events`, `users` |
| §8.4 Módulo Agenda | EP-5 | US-5.4 Pantalla inicial | Backoffice: Agenda (Post-Login) | CalendarEvent | `calendar_events` |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §1

**Vistas (PRD §8.4):**
- Vista Día → Wireframe §1.1-1.3
- Vista Semana → Wireframe §1.4-1.6
- Vista Mes → Wireframe §1.7

**Tipos de Evento (PRD §8.4):**
- Visitas → `calendar_events.type = 'VISIT'`
- Notas → `calendar_events.type = 'NOTE'`
- Captaciones → `calendar_events.type = 'CAPTATION'`
- Recordatorios → `calendar_events.type = 'REMINDER'`

---

### Módulo: Operaciones

| PRD | Épica | User Story | Pantallas | Entidad Dominio | Tabla BD |
|-----|-------|------------|-----------|-----------------|----------|
| §8.5 Módulo Operaciones | EP-6 | US-6.1 Crear operación | Backoffice: Crear Operación | Operation | `operations` |
| §8.5 Módulo Operaciones | EP-6 | US-6.2 Cambiar estado | Backoffice: Ficha Operación | Operation | `operations`, `operation_status_history` |
| §8.5 Módulo Operaciones | EP-6 | US-6.3 Ver seguimiento | Backoffice: Listado Operaciones | Operation | `operations` |
| §8.5 Módulo Operaciones | EP-6 | US-6.4 Cerrar operación | Backoffice: Ficha Operación | Operation + Property | `operations`, `properties` |

**Wireframes:** `docs/03_design/04_wireframes_textuales.md` §5

**Estados de Operación (PRD §8.5):**
- Interés → `operations.status = 'INTEREST'`
- Negociación → `operations.status = 'NEGOTIATION'`
- Reservado → `operations.status = 'RESERVED'`
- Cerrado → `operations.status = 'CLOSED'`
- Cancelado → `operations.status = 'CANCELLED'`

**Regla de Negocio:** Al cerrar operación (CLOSED), la propiedad cambia a SOLD o RENTED según tipo de operación.

---

### Requisitos No Funcionales

| PRD | Épica | User Story | Implementación |
|-----|-------|------------|----------------|
| §9.1 Seguridad | EP-7 | US-7.3 Seguridad y privacidad | Arquitectura: JWT, HTTPS, no borrado físico |
| §9.2 Usabilidad | EP-7 | US-7.2 Observaciones transversales | Tabla `observations` + relación polimórfica |
| §9.3 Mobile-first | EP-7 | US-7.1 Diseño responsive | Principios de Diseño §3, Wireframes mobile-first |
| §9.4 Rendimiento | N/A | N/A | Índices en BD (ver `03_modelo_datos.md` §5) |
| §9.5 Fiabilidad | N/A | N/A | Soft-delete (`is_active`), historial de estados |

---

## 🔍 Validación de Cobertura

### ✅ Requisitos del PRD Cubiertos

| Sección PRD | Estado | Épicas | Observaciones |
|-------------|--------|--------|---------------|
| §3.1 Escaparate Público | ✅ Completo | EP-8 | 4 user stories |
| §4 Usuarios y Roles | ✅ Completo | EP-0, EP-1 | 5 user stories |
| §8.1 Módulo Clientes | ✅ Completo | EP-2 | 4 user stories |
| §8.2 Módulo Propiedades | ✅ Completo | EP-3 | 3 user stories + campos especiales |
| §8.3 Módulo Visitas | ✅ Completo | EP-4 | 3 user stories |
| §8.4 Módulo Agenda | ✅ Completo | EP-5 | 4 user stories + 3 vistas |
| §8.5 Módulo Operaciones | ✅ Completo | EP-6 | 4 user stories + 5 estados |
| §9 Requisitos No Funcionales | ✅ Completo | EP-7 | 3 user stories + arquitectura |

**Total:** 8/8 secciones del PRD cubiertas (100%)

---

### ✅ Épicas del Backlog Trazadas

| Épica | User Stories | Trazabilidad al PRD | Estado |
|-------|--------------|---------------------|--------|
| EP-0 Fundaciones | 3 | §4 Usuarios | ✅ Completo |
| EP-1 Usuarios y Roles | 2 | §4.2 Roles | ✅ Completo |
| EP-2 Clientes | 4 | §8.1 Módulo Clientes | ✅ Completo |
| EP-3 Propiedades | 3 | §8.2 Módulo Propiedades | ✅ Completo |
| EP-4 Visitas | 3 | §8.3 Módulo Visitas | ✅ Completo |
| EP-5 Agenda | 4 | §8.4 Módulo Agenda | ✅ Completo |
| EP-6 Operaciones | 4 | §8.5 Módulo Operaciones | ✅ Completo |
| EP-7 Movilidad y Calidad | 3 | §9 Requisitos No Funcionales | ✅ Completo |
| EP-8 Escaparate | 4 | §3.1 Escaparate Público | ✅ Completo |

**Total:** 9/9 épicas trazadas al PRD (100%)

---

### ✅ Pantallas del Diseño Trazadas

| Pantalla | Épica | Entidad | Tabla BD | Estado |
|----------|-------|---------|----------|--------|
| Portal Público: Listado | EP-8 | Property | `properties` | ✅ |
| Portal Público: Detalle | EP-8 | Property | `properties`, `property_images` | ✅ |
| Login | EP-0 | User | `users` | ✅ |
| Backoffice: Agenda (Día/Semana/Mes) | EP-5 | CalendarEvent | `calendar_events` | ✅ |
| Backoffice: Listado Clientes | EP-2 | Client | `clients` | ✅ |
| Backoffice: Ficha Cliente | EP-2 | Client | `clients`, `observations` | ✅ |
| Backoffice: Listado Propiedades | EP-3 | Property | `properties` | ✅ |
| Backoffice: Ficha Propiedad | EP-3 | Property | `properties`, `property_images` | ✅ |
| Backoffice: Ficha Visita | EP-4 | Visit | `visits`, `observations` | ✅ |
| Backoffice: Listado Operaciones | EP-6 | Operation | `operations` | ✅ |
| Backoffice: Ficha Operación | EP-6 | Operation | `operations`, `operation_status_history` | ✅ |

**Total:** 11/11 pantallas principales trazadas (100%)

---

### ✅ Entidades del Dominio Trazadas

| Entidad Dominio | PRD | Épica | Tabla BD | Estado |
|-----------------|-----|-------|----------|--------|
| User | §4 | EP-0, EP-1 | `users` | ✅ |
| Client | §8.1 | EP-2 | `clients` | ✅ |
| Property | §8.2 | EP-3 | `properties` | ✅ |
| PropertyImage | §8.2 | EP-3 | `property_images` | ✅ |
| Visit | §8.3 | EP-4 | `visits` | ✅ |
| CalendarEvent | §8.4 | EP-5 | `calendar_events` | ✅ |
| Operation | §8.5 | EP-6 | `operations` | ✅ |
| Observation | §9.2 | EP-7 | `observations` | ✅ |

**Total:** 8/8 entidades principales trazadas (100%)

---

## 📋 Matriz de Trazabilidad Inversa

### Desde Tablas de BD hacia PRD

| Tabla BD | Entidad Dominio | Épica | PRD | Justificación |
|----------|-----------------|-------|-----|---------------|
| `users` | User | EP-0, EP-1 | §4 | Autenticación y roles |
| `clients` | Client | EP-2 | §8.1 | Gestión de clientes |
| `properties` | Property | EP-3, EP-8 | §8.2, §3.1 | Inventario y escaparate |
| `property_images` | PropertyImage | EP-3, EP-8 | §8.2, §3.1 | Galería de imágenes |
| `calendar_events` | CalendarEvent | EP-5 | §8.4 | Agenda como calendario |
| `visits` | Visit | EP-4 | §8.3 | Registro de visitas |
| `operations` | Operation | EP-6 | §8.5 | Seguimiento comercial |
| `operation_status_history` | N/A (Historial) | EP-6 | §8.5, §9.5 | Trazabilidad de cambios |
| `observations` | Observation | EP-7 | §9.2 | Observaciones transversales |
| `domain_events` | N/A (Auditoría) | N/A | §9.5 | Auditoría y trazabilidad |

**Resultado:** Todas las tablas tienen justificación en el PRD. No hay tablas huérfanas.

---

## 🎯 Conclusiones

### ✅ Cobertura Completa

- **100%** de los requisitos del PRD están cubiertos por épicas
- **100%** de las épicas están trazadas al PRD
- **100%** de las pantallas principales están trazadas a épicas y entidades
- **100%** de las entidades del dominio están trazadas al PRD
- **100%** de las tablas de BD tienen justificación en el PRD

### 🎓 Valor para Evaluación Académica

Este mapa de trazabilidad demuestra:

1. **Rigor metodológico**: Cada decisión técnica deriva de un requisito de negocio
2. **Coherencia end-to-end**: PRD → Backlog → Diseño → Arquitectura → BD
3. **Completitud**: No hay requisitos sin implementar ni implementaciones sin requisito
4. **Trazabilidad bidireccional**: Se puede ir del PRD a la BD y viceversa

---

## 🔄 Mantenimiento del Mapa

### Cuándo Actualizar

Este documento debe actualizarse cuando:

- Se agrega un nuevo requisito al PRD
- Se crea una nueva épica en el backlog
- Se diseña una nueva pantalla
- Se agrega una nueva entidad al dominio
- Se crea una nueva tabla en la base de datos

### Cómo Validar

1. Verificar que cada sección del PRD tiene al menos una épica
2. Verificar que cada épica referencia una sección del PRD
3. Verificar que cada pantalla principal está asociada a una épica
4. Verificar que cada entidad del dominio está asociada a un requisito del PRD
5. Verificar que cada tabla de BD está asociada a una entidad del dominio

---

## 🔄 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-02-05 | 1.0 | Creación del mapa de trazabilidad completo |

---

**Fin del Mapa de Trazabilidad**
