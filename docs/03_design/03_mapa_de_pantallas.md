# Mapa de Pantallas
## Sistema Web / CRM para Inmobiliaria Familiar

---

## 0. Propósito del documento

Este documento define el **mapa completo de pantallas del sistema**, tanto del
**backoffice privado** como del **escaparate público**, así como su jerarquía y navegación.

Sirve como base directa para:
- Wireframes
- Diseño visual
- Implementación frontend

---

## 1. Visión general del sistema

El sistema se divide en dos grandes áreas:

1. **Backoffice privado**
2. **Escaparate público**

Ambas áreas:
- Comparten identidad visual básica (marca)
- No comparten navegación ni acceso

---

## 2. Backoffice privado — Mapa de pantallas

### 2.1 Pantallas principales (núcleo del sistema)

---

### 🗓️ Agenda / Calendario (HOME)
**Rol:** Agente / Administrador

**Descripción:**
- Pantalla principal tras login
- Vista calendario con:
  - Día
  - Semana
  - Mes
- Navegación entre fechas, incluyendo **navegar entre meses** para planificar eventos futuros

**Desde aquí se puede:**
- Ver eventos del día/semana/mes
- Crear:
  - Visitas
  - Notas
  - Captaciones
  - Recordatorios
- Acceder a:
  - Visitas
  - Clientes
  - Propiedades relacionadas

---

### 👤 Listado de Clientes
**Rol:** Agente / Administrador

**Acciones principales:**
- Buscar clientes
- Filtrar por tipo (comprador / arrendatario / propietario)
- Acceder a ficha de cliente
- Crear nuevo cliente

---

### 🏠 Listado de Propiedades
**Rol:** Agente / Administrador

**Descripción:**
- Listado de todas las propiedades
- Indicador claro de estado (libre, vendido, alquilado)
- Cada propiedad debe mostrar, como mínimo en listado:
  - **Título**
  - Ciudad
  - Estado
  - (Opcional según negocio) Precio

**Acciones principales:**
- Buscar propiedades
- Filtrar por ciudad, estado, habitaciones, metros
- Acceder a ficha de propiedad
- Crear nueva propiedad

---

### 📄 Listado de Operaciones
**Rol:** Agente / Administrador

**Acciones principales:**
- Filtrar por estado (interés, negociación, reservado, cerrado, cancelado)
- Acceder a detalle de operación
- Crear nueva operación

---

## 2.2 Pantallas de detalle (fichas)

---

### 👤 Ficha de Cliente
**Contenido:**
- Datos del cliente
- Tipo de cliente
- Agente responsable
- Observaciones (visibles y editables)
- Historial:
  - Visitas
  - Operaciones
  - Propiedades (si el cliente es propietario)

---

### 🏠 Ficha de Propiedad
**Contenido:**
- **Título**
- **Descripción**
- **Galería/gestión de imágenes**
- Datos estructurados
- Estado de la propiedad
- Propietario
- Agente captador
- Observaciones internas
- Historial:
  - Visitas
  - Operaciones

📌 Regla: el escaparate público mostrará título/descr./imágenes, pero **nunca** observaciones internas ni datos del propietario.

---

### 📄 Ficha de Operación
**Contenido:**
- Cliente
- Propiedad
- Agente
- Estado actual
- Observaciones de seguimiento
- Historial de cambios

---

### 🗓️ Ficha de Visita
**Contenido:**
- Cliente
- Propiedad
- Fecha y hora
- Estado (pendiente, realizada, cancelada)
- Observaciones post-visita

---

## 2.3 Pantallas de creación / edición (formularios)

Patrones compartidos:
- Campos esenciales primero
- Observaciones siempre visibles
- Experiencia optimizada para móvil

Pantallas:
- ➕ Crear / Editar Cliente
- ➕ Crear / Editar Propiedad (**incluye título, descripción e imágenes**)
- ➕ Crear / Editar Visita
- ➕ Crear / Editar Operación

---

## 2.4 Pantallas específicas de administración

### 👥 Gestión de Usuarios
**Rol:** Administrador
- Listado de usuarios (agentes)
- Crear / editar / desactivar usuarios

### 🗓️ Agenda Global (Administrador)
**Rol:** Administrador
- Vista de agendas de todos los agentes (calendario)
- Filtros por agente, fecha y tipo de evento

---

## 3. Escaparate público — Mapa de pantallas

### 3.1 Pantallas principales

---

### 🏠 Listado público de propiedades
**Usuario:** Público

**Contenido de tarjeta (mínimo):**
- **Imagen principal**
- **Título**
- Ciudad
- Metros / habitaciones
- (Opcional) Precio

**Acciones:**
- Filtrar propiedades (ciudad, precio, metros, habitaciones)
- Acceder a detalle

---

### 🏠 Detalle público de propiedad
**Usuario:** Público

**Contenido:**
- **Galería de imágenes**
- **Título**
- **Descripción**
- Características principales

📌 No se muestra:
- Observaciones internas
- Datos del propietario
- Información interna de agentes

---

## 4. Navegación general

### 4.1 Backoffice
Menú principal persistente:
- Agenda
- Clientes
- Propiedades
- Operaciones
- (Administrador) Usuarios / Agenda global

Accesos cruzados entre fichas:
- Cliente ↔ Visitas ↔ Propiedad ↔ Operación

### 4.2 Escaparate
Navegación simple:
- Listado
- Filtros
- Detalle

Sin acceso a login del backoffice.

---

## 5. Jerarquía de pantallas (resumen)

### Backoffice
1. Agenda (HOME)
2. Listados
3. Fichas de detalle
4. Formularios

### Escaparate
1. Listado de propiedades
2. Detalle de propiedad

---

## 6. Cierre

Este mapa define la estructura completa del sistema.
Cualquier pantalla fuera de este mapa debe justificarse y revisarse.
