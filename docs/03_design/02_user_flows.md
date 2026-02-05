# User Flows (Flujos de Usuario)
## Sistema Web / CRM para Inmobiliaria Familiar

---

## 0. Propósito del documento

Este documento define los **flujos de usuario principales** del sistema,
describiendo **cómo interactúan los distintos usuarios con el producto** para
realizar sus tareas habituales.

Los flujos aquí descritos:
- Derivan directamente del PRD y del backlog funcional
- No definen diseño visual, sino **secuencia lógica de acciones**
- Sirven como base para:
  - Mapa de pantallas
  - Wireframes
  - Desarrollo

---

## 1. Flujo general de acceso al sistema (Backoffice)

### Usuario: Agente / Administrador

**Objetivo:** acceder rápidamente al trabajo diario.

**Flujo:**
1. El usuario accede a la URL privada del backoffice
2. Introduce usuario y contraseña
3. El sistema valida credenciales
4. El usuario accede directamente a la **Agenda (Calendario)**

📌 Decisión clave:
- La agenda es siempre la pantalla inicial tras login

---

## 2. Flujo diario del agente (jornada habitual)

### Usuario: Agente inmobiliario

**Objetivo:** organizar y ejecutar su día de trabajo.

**Flujo:**
1. Accede al sistema
2. Visualiza su agenda del día en formato calendario
3. Identifica:
   - Visitas programadas
   - Notas
   - Captaciones
4. Desde la agenda puede:
   - Acceder a una visita
   - Crear una nueva nota
   - Registrar una nueva visita
   - Navegar a clientes o propiedades relacionadas

📌 Este flujo sustituye completamente a la agenda en papel.

---

## 3. Flujo de captación en la calle (mobile-first)

### Usuario: Agente inmobiliario

**Objetivo:** registrar información en el momento para evitar pérdida de datos.

**Flujo:**
1. El agente detecta una oportunidad (cartel, llamada, contacto)
2. Accede al sistema desde el móvil
3. Desde la agenda:
   - Crea un evento de tipo **Captación**
   - Añade observaciones rápidas
4. Opcionalmente:
   - Registra directamente una nueva propiedad
   - O deja la captación como nota para completar después

📌 Principio clave:
- Registrar primero, completar después

---

## 4. Flujo de alta de cliente (oficina o teléfono)

### Usuario: Agente inmobiliario

**Objetivo:** crear una ficha de cliente con contexto suficiente.

**Flujo:**
1. El cliente llama o entra en la oficina
2. El agente accede al módulo Clientes
3. Crea una nueva ficha de cliente
4. Define:
   - Tipo de cliente (comprador / arrendatario / propietario)
   - Datos de contacto
   - Agente responsable
5. Añade observaciones:
   - Qué busca
   - Carácter
   - Contexto relevante
6. Guarda la ficha

📌 La información queda visible para todos los agentes.

---

## 5. Flujo de registro de propiedad

### Usuario: Agente inmobiliario

**Objetivo:** incorporar una propiedad al inventario.

**Flujo:**
1. El agente accede al módulo Propiedades
2. Crea una nueva propiedad
3. Introduce datos estructurados:
   - Dirección
   - Metros
   - Habitaciones
   - Estado
4. Asocia la propiedad a:
   - Un propietario (cliente)
   - Agente captador
5. Añade observaciones sobre la vivienda
6. Guarda la propiedad

📌 La propiedad queda disponible para todo el equipo.

---

## 6. Flujo de agendado de visita

### Usuario: Agente inmobiliario

**Objetivo:** programar una visita con un cliente.

**Flujo:**
1. El agente accede a la agenda (calendario)
2. Selecciona fecha y hora
3. Crea un evento de tipo **Visita**
4. Asocia:
   - Cliente
   - Propiedad
5. Añade observaciones si es necesario
6. Guarda el evento

Resultado:
- La visita aparece en la agenda
- Se crea el registro de visita correspondiente

---

## 7. Flujo de visita realizada (post-visita)

### Usuario: Agente inmobiliario

**Objetivo:** dejar constancia del resultado de la visita.

**Flujo:**
1. Tras la visita, el agente accede a la visita desde la agenda
2. Marca la visita como **Realizada**
3. Añade observaciones:
   - Opinión del cliente
   - Objeciones
   - Interés
4. Guarda los cambios

📌 Esta información alimenta futuras operaciones.

---

## 8. Flujo de creación y seguimiento de operación

### Usuario: Agente inmobiliario

**Objetivo:** dar seguimiento a una posible venta o alquiler.

**Flujo:**
1. El agente detecta interés real tras una o varias visitas
2. Accede al módulo Operaciones
3. Crea una nueva operación asociada a:
   - Cliente
   - Propiedad
4. Define el estado inicial (Interés / Negociación)
5. Añade observaciones de seguimiento
6. Actualiza el estado a lo largo del tiempo

📌 Al cerrar:
- La propiedad actualiza su estado (vendido / alquilado)

---

## 9. Flujo del administrador (visión global)

### Usuario: Administrador

**Objetivo:** supervisar el negocio.

**Flujo:**
1. Accede al sistema
2. Visualiza su agenda o la agenda global
3. Puede:
   - Ver agendas de todos los agentes
   - Acceder a cualquier cliente, propiedad o operación
4. Da soporte y reorganiza si es necesario

📌 El administrador trabaja como agente, pero con visión global.

---

## 10. Flujo del escaparate público

### Usuario: Cliente final (usuario público)

**Objetivo:** consultar propiedades de forma sencilla y atractiva.

**Flujo:**
1. El usuario accede a la web pública
2. Visualiza el listado de propiedades disponibles
3. Aplica filtros:
   - Ciudad
   - Precio
   - Metros
   - Habitaciones
4. Accede al detalle de una propiedad
5. Navega sin necesidad de login

📌 Nunca accede al backoffice ni ve información interna.

---

## 11. Cierre

Estos flujos representan **el uso real del sistema** por parte de sus usuarios.

Sirven como base directa para:
- Definir pantallas
- Diseñar wireframes
- Implementar sin ambigüedades

Cualquier pantalla o funcionalidad que no encaje
en alguno de estos flujos debe ser revisada.
