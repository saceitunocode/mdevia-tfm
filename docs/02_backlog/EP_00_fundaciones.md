# EP-0 — Fundaciones del sistema

> **Estado:** ✅ Implementado

---

## US-0.1 — Usuario administrador inicial

**Como** propietario del negocio  
**Quiero** que existan usuarios administradores creados automáticamente  
**Para** poder acceder al sistema desde el primer momento

**Criterios de aceptación**
- Existen 2 administradores y 2 agentes creados vía script de seed
- Los administradores pueden acceder al backoffice
- Las contraseñas se almacenan hasheadas con bcrypt

---

## US-0.2 — Autenticación de usuarios

**Como** empleado  
**Quiero** iniciar sesión con email y contraseña  
**Para** acceder de forma segura al backoffice

**Criterios de aceptación**
- No existe registro público; los usuarios solo los crea un administrador
- El login es accesible en `/oficina/acceso`
- Las contraseñas se almacenan hasheadas con bcrypt
- El token JWT incluye email, rol y nombre completo
- Opción "Recuérdame": token de 7 días en lugar de 30 minutos

---

## US-0.3 — Separación escaparate / backoffice

**Como** negocio  
**Quiero** separar claramente la parte pública y la privada  
**Para** evitar accesos indebidos

**Criterios de aceptación**
- El escaparate no muestra enlaces al login del backoffice
- El backoffice no es accesible sin autenticación válida
- Las rutas privadas redirigen a `/oficina/acceso` si no hay token

---

## US-0.4 — Dashboard como pantalla inicial

**Como** agente  
**Quiero** ver un resumen del negocio al entrar al backoffice  
**Para** tener contexto inmediato sin navegar

**Criterios de aceptación**
- Tras login, se muestra el dashboard en `/oficina/panel`
- El dashboard muestra KPIs: propiedades, clientes activos, visitas pendientes, operaciones activas
- Se muestran tendencias semanales (comparativa con semana anterior)
- Se muestran próximas visitas (7 días), propiedades recientes y operaciones recientes
