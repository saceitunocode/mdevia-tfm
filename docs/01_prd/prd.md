# PRD — Sistema Web / CRM para Inmobiliaria Familiar

## Documento de Requisitos de Producto (Product Requirements Document)

---

## 0. Naturaleza del documento

Este documento define **de forma completa, detallada y vinculante** los requisitos funcionales y no funcionales del sistema web / CRM para una inmobiliaria familiar.

Todas las decisiones aquí reflejadas:
- Han sido consensuadas
- Están validadas
- Deben regir:
  - Arquitectura
  - Diseño UX/UI
  - Desarrollo
  - Evaluación y defensa del proyecto

Cualquier cambio posterior deberá considerarse una **evolución del PRD**.

---

## 1. Contexto del negocio

La empresa es una **inmobiliaria familiar** con las siguientes características:

- Menos de 10 empleados
- Dos oficinas físicas en ciudades distintas
- Trabajo muy orientado a:
  - Trato personal
  - Captación en calle
  - Gestión manual (agenda en papel, memoria del agente)

Actualmente:
- La información se pierde
- No existe trazabilidad
- El conocimiento queda en personas, no en el sistema

---

## 2. Objetivo del producto

El objetivo del sistema es:

- Digitalizar y centralizar la gestión inmobiliaria
- Sustituir agendas en papel y notas mentales
- Evitar pérdida de información
- Facilitar el trabajo **en oficina y en movilidad**
- Garantizar privacidad y seguridad de los datos

❗ No se busca:
- Un CRM genérico
- Un SaaS reutilizable
- Una solución sobredimensionada

✔ Se busca:
- Un sistema **hecho a medida**
- Alineado con la realidad del negocio
- Práctico, rápido y humano

---

## 3. Visión general del sistema

El sistema se divide en **dos grandes partes claramente separadas**:

### 3.1 Escaparate público

- Accesible para cualquier usuario
- Sin autenticación
- Función exclusiva:
  - Mostrar propiedades disponibles
  - Permitir filtros (metros, habitaciones, precio, ciudad, etc.)
- No permite:
  - Registro
  - Acceso a datos internos
  - Gestión de información

El escaparate público muestra las propiedades como anuncios comerciales.

Cada propiedad visible públicamente debe incluir:
- Imagen principal
- Título
- Descripción
- Características básicas (ciudad, metros, habitaciones, precio si aplica)

No se mostrará bajo ningún concepto:
- Observaciones internas
- Datos del propietario
- Información interna de agentes

---

### 3.2 Backoffice privado

- Acceso exclusivo para empleados
- Acceso mediante:
  - URL directa conocida por los agentes
- No existe botón de “Iniciar sesión” en el escaparate

Motivo:
- Evitar confusión de clientes
- Separar claramente usuario público y sistema interno

---

## 4. Usuarios y roles

### 4.1 Administrador

Perfil:
- Dueño o responsable del negocio

Comportamiento:
- Trabaja exactamente igual que un agente

Diferencias clave:
- Puede ver **la agenda de todos los agentes**
- Puede crear, editar y desactivar usuarios
- Tiene visibilidad total del sistema

---

### 4.2 Agente inmobiliario

Perfil:
- Usuario operativo principal

Funciones:
- Registrar clientes
- Registrar propiedades
- Gestionar visitas
- Usar la agenda (calendario)
- Dar seguimiento a operaciones

Permisos:
- Ve todos los clientes, propiedades, visitas y operaciones
- Solo ve **su propia agenda**

---

### 4.3 Cliente final (usuario público)

- No tiene cuenta
- No interactúa con el backoffice
- Solo accede al escaparate

---

## 5. Principios clave del producto

1. **La información es compartida**
   - No existen silos por agente

2. **La responsabilidad es individual**
   - Todo tiene un agente responsable

3. **Las observaciones son críticas**
   - Texto libre en todos los módulos

4. **La agenda es el centro del sistema**
   - Calendario como vista principal

5. **Prioridad absoluta al uso en móvil**
   - El agente trabaja en la calle

6. **Privacidad y seguridad como pilares**
   - Se gestionan datos personales sensibles

---

## 6. Journeys actuales (AS-IS)

Un agente:
1. Llega a la oficina
2. Revisa agenda en papel
3. Si no hay citas:
   - Sale a captar (calle, llamadas)
4. Si hay citas:
   - Enseña propiedades
5. La información:
   - Se queda en su memoria
   - O en notas en papel

Problemas:
- Información no compartida
- Pérdida de contexto
- Dependencia de personas

---

## 7. Journeys deseados (TO-BE)

Con el sistema:
- Agenda centralizada (calendario)
- Registro inmediato desde móvil
- Historial accesible por cualquier agente
- Continuidad incluso si cambia el agente

---

## 8. Módulos funcionales del backoffice

---

## 8.1 Módulo Clientes

### Objetivo
Gestionar clientes y mantener contexto comercial completo.

### Tipos de cliente
- Comprador
- Arrendatario
- Propietario

### Funcionalidades
- CRUD completo
- Asignación de agente responsable
- Observaciones libres:
  - Carácter
  - Forma de trato
  - Contexto personal
- Historial visible:
  - Visitas
  - Operaciones
  - Propiedades (si es propietario)

### Visibilidad
- Todos los agentes ven todos los clientes
- El administrador ve todo

---

## 8.2 Módulo Propiedades

### Objetivo
Gestionar el inventario inmobiliario.

### Datos estructurados
- Dirección
- Ciudad
- Metros cuadrados
- Habitaciones
- Planta
- Ascensor
- Estado:
  - Libre
  - Vendido
  - Alquilado

### Datos de la Propiedad

Además de los datos estructurados (metros, habitaciones, planta, estado, etc.),
cada propiedad debe incluir:

- **Título**: texto corto y comercial que identifique la vivienda.
- **Descripción**: texto descriptivo orientado a clientes finales.
- **Imágenes**:
  - Al menos una imagen principal.
  - Posibilidad de añadir varias imágenes adicionales.

Estos campos son obligatorios para garantizar la correcta visualización
de la propiedad en el escaparate público.

### Relaciones
- Propietario (cliente)
- Agente captador

### Funcionalidades
- CRUD completo
- Observaciones libres:
  - Estado real
  - Reformas
  - Flexibilidad del propietario
- Historial:
  - Visitas
  - Operaciones

---

## 8.3 Módulo Visitas

### Objetivo
Registrar el evento central del negocio.

### Funcionalidades
- Registro de visita:
  - Cliente
  - Propiedad
  - Agente
  - Fecha y hora
- Estado:
  - Pendiente
  - Realizada
  - Cancelada
- Observaciones post-visita
- Integración con agenda
- Historial permanente

---

## 8.4 Módulo Agenda (CALENDARIO)

### Objetivo
Sustituir completamente la agenda en papel.

### Principio irrenunciable
> La agenda se visualiza como un CALENDARIO.

### Características
- Vistas:
  - Día
  - Semana
  - Mes
- Eventos:
  - Visitas
  - Notas
  - Captaciones
  - Recordatorios
- Cada evento:
  - Fecha / hora
  - Tipo
  - Descripción
  - Observaciones libres

### Permisos
- Agente: solo su agenda
- Administrador: todas las agendas

### UX
- Pantalla inicial tras login
- Acceso rápido a entidades relacionadas

---

## 8.5 Módulo Operaciones

### Objetivo
Seguimiento comercial hasta cierre o cancelación.

### Definición
Una operación representa una intención real de:
- Venta
- Alquiler

### Relaciones
- Cliente
- Propiedad
- Agente

### Estados
- Interés
- Negociación
- Reservado
- Cerrado
- Cancelado

### Funcionalidades
- Observaciones de seguimiento
- Historial de cambios
- Relación con visitas
- Al cerrar:
  - Actualiza estado de la propiedad

❗ No incluye contabilidad ni facturación.

---

## 9. Requisitos No Funcionales

---

## 9.1 Seguridad y privacidad (CRÍTICO)

- Autenticación obligatoria
- Contraseñas almacenadas de forma segura
- No existe registro público
- Separación estricta:
  - Escaparate
  - Backoffice
- Protección de datos personales:
  - Clientes
  - Propiedades
  - Observaciones internas
- Comunicación cifrada (HTTPS)
- Prevención de accesos no autorizados

---

## 9.2 Usabilidad

- Curva de aprendizaje mínima
- No requiere formación
- Patrones consistentes
- Observaciones siempre visibles
- Diseño orientado a rapidez, no estética

---

## 9.3 Dispositivos (PRIORIDAD MÓVIL)

- Uso en móvil es prioritario
- El agente pasa gran parte del tiempo en la calle
- Registro inmediato para evitar pérdida de información
- Escritorio sigue siendo importante
- Responsive real

---

## 9.4 Rendimiento

- Carga < 2 segundos en vistas clave
- Agenda optimizada
- Fluidez en acciones comunes

---

## 9.5 Datos y fiabilidad

- No se borran datos críticos
- Uso de estados en lugar de eliminación
- Historial siempre accesible
- Backups automáticos

---

## 10. Cierre

Este PRD constituye la **fuente única de verdad del proyecto**.

Cualquier decisión técnica, de diseño o de negocio debe:
- Alinearse con este documento
- O justificar explícitamente su desviación

Este documento es válido para:
- Desarrollo
- Evaluación académica
- Defensa ante jurado
- Evolución futura del sistema
