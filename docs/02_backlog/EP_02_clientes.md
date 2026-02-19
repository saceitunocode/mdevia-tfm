# EP-2 — Módulo Clientes

> **Estado:** ✅ Implementado

---

## US-2.1 — Crear cliente

**Como** agente  
**Quiero** crear una ficha de cliente  
**Para** registrar compradores, arrendatarios o propietarios

**Criterios de aceptación**
- Campos: nombre completo, email, teléfono, tipo (BUYER/TENANT/OWNER), agente responsable
- Se asigna un agente responsable
- Se pueden añadir notas internas (tabla `client_notes`)

---

## US-2.2 — Editar cliente

**Como** agente  
**Quiero** editar los datos de un cliente  
**Para** mantener la información actualizada

**Criterios de aceptación**
- Todos los campos son editables
- Las notas internas son acumulativas (no se editan, se añaden nuevas)

---

## US-2.3 — Ver clientes compartidos

**Como** agente  
**Quiero** ver todos los clientes  
**Para** tener contexto completo del negocio

**Criterios de aceptación**
- Todos los agentes ven todos los clientes activos
- Se muestra el agente responsable de cada cliente
- Búsqueda por nombre

---

## US-2.4 — Historial del cliente

**Como** agente  
**Quiero** ver el historial de un cliente  
**Para** entender su relación con la inmobiliaria

**Criterios de aceptación**
- Se muestran las visitas del cliente
- Se muestran las operaciones del cliente
- Si es propietario (OWNER), se muestran sus propiedades
- Se muestran las notas internas del cliente
