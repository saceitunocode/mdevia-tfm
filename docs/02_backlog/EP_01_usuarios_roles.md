# EP-1 — Gestión de usuarios y roles

> **Estado:** ✅ Implementado

---

## US-1.1 — Crear y gestionar agentes (solo ADMIN)

**Como** administrador  
**Quiero** crear y gestionar usuarios agentes  
**Para** que puedan trabajar en el sistema

**Criterios de aceptación**
- Solo el administrador puede crear, editar y listar usuarios
- Los agentes pueden iniciar sesión tras ser creados
- Se puede activar o desactivar el acceso de un agente
- El rol de los nuevos usuarios se fuerza a AGENT

---

## US-1.2 — Permisos por rol

**Como** sistema  
**Quiero** aplicar permisos según rol  
**Para** garantizar visibilidad y seguridad correctas

**Criterios de aceptación**
- El agente solo ve sus propios eventos de calendario y visitas
- El agente puede gestionar clientes y propiedades (compartidos)
- El agente puede ver operaciones (historial compartido)
- El administrador tiene acceso total al sistema
- Los permisos se aplican en el backend, no solo en el frontend

---

## US-1.3 — Perfil propio

**Como** agente o administrador  
**Quiero** ver y actualizar mis datos de perfil  
**Para** mantener mi información actualizada

**Criterios de aceptación**
- El endpoint `GET /api/v1/users/me` devuelve los datos del usuario autenticado
- El nombre y email del header se actualizan con stale-while-revalidate
