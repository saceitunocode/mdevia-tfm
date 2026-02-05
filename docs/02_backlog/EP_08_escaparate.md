# EP-8 — Escaparate Público de Propiedades

---

## Descripción de la épica
El escaparate público permite a cualquier usuario externo consultar las propiedades disponibles de la inmobiliaria sin necesidad de autenticación.

Este módulo está completamente separado del backoffice y **no expone información interna**, actuando únicamente como canal de visibilidad comercial.

No forma parte del CRM interno, pero sí del producto global.

---

## US-8.1 — Ver listado de propiedades disponibles
**Como** usuario público  
**Quiero** ver un listado de propiedades disponibles  
**Para** explorar la oferta de la inmobiliaria  

**Criterios de aceptación**
- Solo se muestran propiedades con estado "libre"
- Se muestran datos básicos de cada propiedad:
  - Ciudad
  - Precio
  - Metros cuadrados
  - Número de habitaciones
- El listado es accesible sin autenticación
- Cada tarjeta de propiedad muestra:
  - Imagen principal
  - Título
- El detalle de la propiedad muestra:
  - Galería de imágenes
  - Título
  - Descripción pública

---

## US-8.2 — Filtrar propiedades
**Como** usuario público  
**Quiero** filtrar propiedades  
**Para** encontrar las que se ajustan a mis necesidades  

**Criterios de aceptación**
- Existen filtros por:
  - Ciudad
  - Precio
  - Metros cuadrados
  - Número de habitaciones
- Los filtros se aplican solo sobre propiedades disponibles
- Los filtros no requieren login

---

## US-8.3 — Ver detalle de propiedad
**Como** usuario público  
**Quiero** ver el detalle de una propiedad  
**Para** obtener más información antes de contactar  

**Criterios de aceptación**
- Se muestra información detallada de la propiedad
- No se muestran:
  - Observaciones internas
  - Datos del propietario
  - Información de agentes
- La vista es accesible sin autenticación


---

## US-8.4 — Separación estricta entre escaparate y backoffice
**Como** negocio  
**Quiero** que el escaparate público esté completamente separado del backoffice  
**Para** proteger la información interna y evitar accesos indebidos  

**Criterios de aceptación**
- El escaparate no muestra enlaces al login del backoffice
- No se exponen rutas privadas
- No existe registro público de usuarios
- El acceso al backoffice solo es posible mediante URL directa y autenticación

---
