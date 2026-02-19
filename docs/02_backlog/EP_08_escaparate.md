# EP-8 — Escaparate Público de Propiedades

> **Estado:** ✅ Implementado

El escaparate público permite a cualquier visitante consultar las propiedades disponibles sin autenticación. Está completamente separado del backoffice y no expone información interna.

---

## US-8.1 — Ver listado de propiedades disponibles

**Como** usuario público  
**Quiero** ver un listado de propiedades disponibles  
**Para** explorar la oferta de la inmobiliaria

**Criterios de aceptación**
- Solo se muestran propiedades con `is_published=true` y `status=AVAILABLE`
- Cada tarjeta muestra: imagen de portada, título, ciudad, precio (con "/mes" si es alquiler), m², habitaciones, baños y badge de operación
- El listado es accesible sin autenticación
- Paginación con `limit` y `offset`

---

## US-8.2 — Filtrar y ordenar propiedades

**Como** usuario público  
**Quiero** filtrar y ordenar propiedades  
**Para** encontrar las que se ajustan a mis necesidades

**Criterios de aceptación**
- Filtros disponibles: ciudad, precio (min/max), m² (min/max), habitaciones (mínimo), baños (mínimo), tipo (HOUSE/APARTMENT/OFFICE/LAND), operación (SALE/RENT), ascensor, destacadas
- Ordenación: precio ascendente, precio descendente, más recientes
- Los filtros se aplican solo sobre propiedades publicadas y disponibles
- No requieren login

---

## US-8.3 — Ver detalle de propiedad

**Como** usuario público  
**Quiero** ver el detalle de una propiedad  
**Para** obtener más información antes de contactar

**Criterios de aceptación**
- Se muestra: galería de imágenes (carrusel), título, dirección, precio, m², habitaciones, baños, planta, ascensor, descripción pública
- Se muestran los datos de contacto del agente captador (nombre, teléfono, email)
- No se exponen: notas internas, datos del propietario, información financiera interna
- La vista es accesible sin autenticación

---

## US-8.4 — Separación estricta entre escaparate y backoffice

**Como** negocio  
**Quiero** que el escaparate esté completamente separado del backoffice  
**Para** proteger la información interna

**Criterios de aceptación**
- El escaparate no muestra enlaces al login del backoffice
- No se exponen rutas privadas
- No existe registro público de usuarios

---

## US-8.5 — Páginas de contacto y aviso legal

**Como** visitante  
**Quiero** poder contactar con la agencia y consultar el aviso legal  
**Para** obtener información adicional o cumplir con mis derechos

**Criterios de aceptación**
- Existe una página `/contacto` con información de contacto de la agencia
- Existe una página `/legal` con el aviso legal estático
- Ambas páginas son accesibles sin autenticación desde el menú de navegación
