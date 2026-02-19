# EP-3 — Módulo Propiedades

> **Estado:** ✅ Implementado

---

## US-3.1 — Registrar propiedad

**Como** agente  
**Quiero** registrar una propiedad  
**Para** incorporarla al inventario

**Criterios de aceptación**
- Campos: título, dirección, ciudad, código postal, m², habitaciones, baños, planta, ascensor, precio, tipo (HOUSE/APARTMENT/OFFICE/LAND), operación (SALE/RENT), descripción pública, notas internas
- Se asigna propietario (cliente) y agente captador
- Se pueden añadir notas internas (tabla `property_notes`)
- La propiedad se puede publicar en el escaparate (`is_published`, `is_featured`)

---

## US-3.2 — Gestión de imágenes (Cloudinary)

**Como** agente  
**Quiero** subir, ordenar y gestionar imágenes de una propiedad  
**Para** presentarla visualmente en el escaparate

**Criterios de aceptación**
- Subida de imágenes vía formulario multipart; se almacenan en Cloudinary
- Reordenación drag-and-drop en escritorio y modo selección táctil en móvil
- Se puede establecer una imagen como portada
- Se puede eliminar una imagen (borrado en Cloudinary y en BD)
- Watermark configurable por variable de entorno

---

## US-3.3 — Editar propiedad

**Como** agente  
**Quiero** editar una propiedad  
**Para** actualizar su estado o información

**Criterios de aceptación**
- Todos los campos son editables
- Se puede cambiar el estado (AVAILABLE, SOLD, RENTED)
- Se puede publicar o despublicar del escaparate

---

## US-3.4 — Ver historial de propiedad

**Como** agente  
**Quiero** ver el historial de una propiedad  
**Para** conocer su evolución

**Criterios de aceptación**
- Se muestran las visitas realizadas a la propiedad
- Se muestran las operaciones asociadas
- Se muestran las notas internas
