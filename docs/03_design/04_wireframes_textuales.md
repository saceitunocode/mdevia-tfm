# Wireframes Textuales
## Sistema Web / CRM para Inmobiliaria Familiar

---

## 0. Propósito del documento

Wireframes **conceptuales** en texto para definir:
- Estructura de pantallas
- Jerarquía de información
- Prioridades mobile vs desktop

No es UI final; guía para diseño visual y desarrollo.

---

## 1. Backoffice — Agenda / Calendario (HOME)

### 1.1 Objetivo
Pantalla principal tras login. Permite organizar el día y crear/consultar eventos.

### 1.2 Controles comunes (todas las vistas)
- Selector de vista: **Día | Semana | Mes**
- Navegación de fecha:
  - Día/Semana: anterior / siguiente
  - Mes: **mes anterior / mes siguiente**
- Acción principal: **+ Nuevo evento**
- Tipos de evento:
  - Visita
  - Nota
  - Captación
  - Recordatorio

---

### 1.3 Desktop — Layout conceptual (sin romper Markdown)

    ┌─────────────────────────────────────────────────────────┐
    │ Top bar: [Mes/Año]  [<] [>]  [Día|Semana|Mes]   [+]     │
    ├───────────────┬─────────────────────────────────────────┤
    │ Menú lateral  │ Calendario (según vista seleccionada)   │
    │ - Agenda      │                                         │
    │ - Clientes    │                                         │
    │ - Propiedades │                                         │
    │ - Operaciones │                                         │
    │ (+ Admin)     │                                         │
    │ - Usuarios    │                                         │
    │ - Agenda global│                                        │
    └───────────────┴─────────────────────────────────────────┘

---

### 1.4 Móvil — Layout conceptual

    ┌───────────────────────────────┐
    │ [Mes/Año]  [<] [>]            │
    │ [Día | Semana | Mes]          │
    ├───────────────────────────────┤
    │ Calendario (scroll/swipe)     │
    │                               │
    ├───────────────────────────────┤
    │ Botón flotante: [+]           │
    └───────────────────────────────┘

---

### 1.5 Vista Día (calendario)
- Línea temporal por horas
- Eventos como bloques con:
  - Hora
  - Tipo
  - Texto corto

Acciones:
- Tap/click evento → Detalle
- Tap/click hueco → Crear evento en esa hora

---

### 1.6 Vista Semana (calendario)
- Columnas por día
- Eventos distribuidos por horas
- Indicadores visuales de carga

Acciones:
- Tap/click evento → Detalle
- Tap/click hueco → Crear evento

---

### 1.7 Vista Mes (calendario)
- Cuadrícula mensual
- Cada día muestra:
  - Indicador de nº de eventos (o iconos)
- Navegación:
  - Mes anterior / Mes siguiente

Acciones:
- Tap/click en día → abrir detalle del día (lista de eventos) o saltar a vista Día

---

### 1.8 Crear evento (modal / pantalla)
Campos mínimos:
- Tipo de evento (visita/nota/captación/recordatorio)
- Fecha y hora
- Título / descripción breve
- Observaciones (texto libre)

Si tipo = Visita:
- Seleccionar Cliente
- Seleccionar Propiedad
- Estado: Pendiente (por defecto)

---

## 2. Backoffice — Clientes

### 2.1 Listado de Clientes (móvil prioritario)
Estructura:
- Header: “Clientes”
- Buscador siempre visible
- Filtros:
  - Tipo de cliente (comprador/arrendatario/propietario)
  - Agente responsable (opcional)
- Lista:
  - Nombre
  - Tipo
  - Teléfono (acceso rápido)
- CTA: “+ Nuevo cliente”

---

### 2.2 Ficha de Cliente
Secciones:
1. Cabecera
   - Nombre
   - Tipo de cliente
   - Agente responsable
2. Contacto
   - Teléfono, email
3. Observaciones (texto libre) **visible y editable**
4. Historial
   - Visitas
   - Operaciones
   - Propiedades (si propietario)

Acciones:
- Editar
- Crear visita

---

### 2.3 Crear / Editar Cliente (formulario)
Orden recomendado:
1. Datos mínimos (nombre, teléfono, email)
2. Tipo de cliente
3. Agente responsable
4. Observaciones (siempre visible)

---

## 3. Backoffice — Propiedades

### 3.1 Listado de Propiedades
- Buscador
- Filtros:
  - Ciudad
  - Estado (libre/vendido/alquilado)
  - Habitaciones
  - Metros
  - Agente captador (opcional)
- Tarjeta/row (mínimo):
  - **Imagen miniatura (si existe)**
  - **Título**
  - Ciudad
  - Estado
  - (Opcional) Precio
- CTA: “+ Nueva propiedad”

---

### 3.2 Ficha de Propiedad
Secciones:
1. Cabecera
   - **Título**
   - Ciudad / Dirección
   - Estado (badge)
2. Galería de imágenes
   - Imagen principal destacada
   - Carrusel/galería (móvil-friendly)
3. Descripción pública
   - **Descripción (texto)**
4. Datos estructurados
   - Metros, habitaciones, planta, ascensor
5. Relaciones
   - Propietario (cliente)
   - Agente captador
6. Observaciones internas
   - Texto libre visible (uso interno)
7. Historial
   - Visitas
   - Operaciones

Regla:
- La **descripción e imágenes** alimentan el escaparate.
- Las **observaciones internas** NO se publican.

---

### 3.3 Crear / Editar Propiedad (formulario)
Orden recomendado:
1. Título
2. Ciudad / Dirección
3. Subida de imágenes (una principal + galería)
4. Descripción (pública)
5. Datos estructurados (metros, habitaciones, planta, ascensor)
6. Estado
7. Propietario
8. Agente captador
9. Observaciones internas (no públicas)

---

## 4. Backoffice — Visitas

### 4.1 Ficha de Visita
Secciones:
- Fecha y hora
- Estado (pendiente/realizada/cancelada)
- Cliente (link)
- Propiedad (link)
- Observaciones post-visita (texto libre)

Acciones:
- Cambiar estado
- Editar observaciones

---

## 5. Backoffice — Operaciones

### 5.1 Listado de Operaciones
- Filtros por estado
- Lista:
  - Cliente
  - Propiedad
  - Estado
  - Agente
- CTA: “+ Nueva operación”

---

### 5.2 Ficha de Operación
Secciones:
- Estado actual (selector)
- Cliente / Propiedad (links)
- Observaciones de seguimiento (texto libre) **visible**
- Historial de cambios

Acciones:
- Cambiar estado
- Añadir nota de seguimiento

---

## 6. Escaparate Público

### 6.1 Listado público de propiedades
Objetivo: estética, confianza y claridad comercial.

Estructura:
- Header con marca
- Filtros (ciudad, precio, metros, habitaciones)
- Grid/tarjetas:
  - **Imagen protagonista**
  - **Título**
  - Precio (si aplica)
  - Ciudad
  - Metros / habitaciones

---

### 6.2 Detalle público de propiedad
Estructura:
- **Galería de imágenes**
- **Título**
- Precio + ubicación (si aplica)
- Características
- **Descripción**

Reglas:
- No mostrar observaciones internas
- No mostrar datos de propietario
- No mostrar información interna de agentes

---

## 7. Cierre

Estos wireframes textuales definen la estructura base del sistema, incluyendo:
- Agenda HOME con vistas Día/Semana/Mes y navegación mensual
- Propiedades con **título, descripción e imágenes** para el escaparate
- Observaciones internas separadas de contenido público
