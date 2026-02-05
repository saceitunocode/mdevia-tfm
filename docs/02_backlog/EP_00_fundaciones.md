# EP-0 — Fundaciones del sistema

---

## US-0.1 — Usuario administrador inicial
**Como** propietario del negocio  
**Quiero** que exista un usuario administrador creado automáticamente  
**Para** poder acceder al sistema y gestionar a los agentes desde el primer momento  

**Criterios de aceptación**
- Existe un usuario administrador al arrancar el sistema
- El usuario se crea vía seed o variables de entorno
- El administrador puede acceder al backoffice

---

## US-0.2 — Autenticación de usuarios
**Como** empleado  
**Quiero** iniciar sesión con usuario y contraseña  
**Para** acceder de forma segura al backoffice  

**Criterios de aceptación**
- No existe registro público
- El login solo es accesible vía URL directa
- Las contraseñas se almacenan de forma segura

---

## US-0.3 — Separación escaparate / backoffice
**Como** negocio  
**Quiero** separar claramente la parte pública y la privada  
**Para** evitar accesos indebidos y confusión de clientes  

**Criterios de aceptación**
- El escaparate no muestra enlaces al login
- El backoffice no es accesible sin autenticación

---
