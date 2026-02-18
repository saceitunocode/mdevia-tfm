# EP-4 — Módulo Visitas

> **Estado:** ✅ Implementado

---

## US-4.1 — Registrar visita

**Como** agente  
**Quiero** registrar una visita  
**Para** dejar constancia del encuentro y organizarme en la agenda

**Criterios de aceptación**
- La visita relaciona cliente, propiedad y agente
- Se define fecha y hora
- Al crear la visita, se genera automáticamente un evento de calendario de tipo VISIT
- El agente puede ver sus propias visitas; el administrador ve todas

---

## US-4.2 — Gestionar estado y notas de visita

**Como** agente  
**Quiero** actualizar el estado de una visita y añadir notas  
**Para** documentar el resultado del encuentro

**Criterios de aceptación**
- Estados: PENDING, DONE, CANCELLED
- Se pueden añadir notas internas (tabla `visit_notes`)
- Se puede eliminar una visita; al hacerlo, se elimina automáticamente el evento de calendario asociado

---

## US-4.3 — Historial de visitas

**Como** agente  
**Quiero** consultar visitas pasadas  
**Para** tener trazabilidad

**Criterios de aceptación**
- Las visitas son visibles para todos los agentes
- Se pueden filtrar por agente, propiedad y cliente
