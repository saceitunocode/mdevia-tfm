# EP-6 — Módulo Operaciones

> **Estado:** ✅ Implementado

---

## US-6.1 — Crear operación

**Como** agente  
**Quiero** crear una operación  
**Para** dar seguimiento a una venta o alquiler

**Criterios de aceptación**
- La operación se asocia a cliente, propiedad y agente
- Tipos: SALE (venta) o RENT (alquiler)
- Estado inicial: INTEREST

---

## US-6.2 — Cambiar estado de operación

**Como** agente  
**Quiero** cambiar el estado de una operación  
**Para** reflejar su evolución

**Criterios de aceptación**
- Estados: INTEREST → NEGOTIATION → RESERVED → CLOSED / CANCELLED
- Cada cambio de estado queda registrado en el historial automáticamente (tabla `operation_status_history`)
- El historial es visible en la ficha de la operación

---

## US-6.3 — Notas de operación

**Como** agente  
**Quiero** añadir notas a una operación  
**Para** documentar negociaciones

**Criterios de aceptación**
- Las notas son texto libre (tabla `operation_notes`)
- Son acumulativas y quedan asociadas a la operación
- Todos los agentes pueden ver las notas (historial compartido)

---

## US-6.4 — Cierre de operación

**Como** agente  
**Quiero** cerrar o cancelar una operación  
**Para** finalizar su ciclo

**Criterios de aceptación**
- El estado se actualiza a CLOSED o CANCELLED
- El historial de cambios queda registrado
