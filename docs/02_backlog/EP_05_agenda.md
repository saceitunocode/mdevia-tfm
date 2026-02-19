# EP-5 — Agenda (Calendario)

> **Estado:** ✅ Implementado

---

## US-5.1 — Ver agenda como calendario

**Como** agente  
**Quiero** ver mi agenda en formato calendario  
**Para** organizar mi día de forma visual

**Criterios de aceptación**
- Existen 4 vistas: mes, semana, día y agenda (lista cronológica)
- Los eventos se muestran con colores por tipo: VISIT (azul), NOTE (amarillo), CAPTATION (naranja), REMINDER (verde)
- La vista activa y la fecha se persisten en los parámetros de la URL

---

## US-5.2 — Crear y gestionar eventos

**Como** agente  
**Quiero** crear, editar y eliminar eventos en mi agenda  
**Para** organizar visitas, notas, captaciones y recordatorios

**Criterios de aceptación**
- Tipos de evento: VISIT, NOTE, CAPTATION, REMINDER
- Cada evento tiene: título, tipo, fecha/hora inicio, hora fin (opcional), descripción
- Los eventos se crean desde el botón "Nuevo evento" o haciendo clic en un día del calendario
- Se pueden editar y eliminar

---

## US-5.3 — Permisos de agenda

**Como** sistema  
**Quiero** limitar la visibilidad de agendas  
**Para** respetar roles

**Criterios de aceptación**
- El agente solo ve sus propios eventos
- El administrador puede ver todos los eventos
- Un agente no puede crear eventos para otro agente

---

## US-5.4 — Sincronización automática con visitas

**Como** sistema  
**Quiero** que las visitas se reflejen automáticamente en el calendario  
**Para** que el agente no tenga que duplicar el registro

**Criterios de aceptación**
- Al crear una visita, se genera automáticamente un evento de tipo VISIT en el calendario
- Al eliminar una visita, se elimina el evento de calendario asociado
- Los eventos generados por visitas no se pueden editar directamente desde el calendario
