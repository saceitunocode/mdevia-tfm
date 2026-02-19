# EP-7 — Movilidad, usabilidad y calidad

> **Estado:** ✅ Implementado

---

## US-7.1 — Uso prioritario en móvil

**Como** agente  
**Quiero** usar el sistema cómodamente desde el móvil  
**Para** registrar información en la calle

**Criterios de aceptación**
- El sistema es responsive (mobile-first con Tailwind CSS v4)
- Formularios usables en móvil
- Sidebar colapsable en móvil
- Galería de imágenes con modo selección táctil en móvil (en lugar de hover)
- Botón de filtros translúcido en el escaparate público móvil

---

## US-7.2 — Notas internas en todos los módulos

**Como** agente  
**Quiero** añadir notas internas en cualquier módulo  
**Para** capturar contexto humano

**Criterios de aceptación**
- Módulos con notas: clientes (`client_notes`), propiedades (`property_notes`), visitas (`visit_notes`), operaciones (`operation_notes`)
- Las notas son acumulativas y no editables (solo se añaden nuevas)
- Las notas no se exponen en el escaparate público

---

## US-7.3 — Seguridad y privacidad

**Como** negocio  
**Quiero** proteger los datos de clientes y propiedades  
**Para** cumplir con privacidad y confianza

**Criterios de aceptación**
- Comunicación cifrada (HTTPS en producción)
- Acceso restringido mediante JWT
- No exposición de datos internos (notas, propietario, datos financieros) en el escaparate público
- Eliminación lógica (`is_active`) en lugar de borrado físico

---

## US-7.4 — Calidad del código

**Como** equipo de desarrollo  
**Quiero** garantizar la calidad del código  
**Para** mantener el proyecto estable y mantenible

**Criterios de aceptación**
- ESLint v9 configurado para el frontend
- Husky v9 con hooks pre-commit (lint) y pre-push (tests)
- Tests frontend con Vitest + Testing Library
- Tests backend con pytest (unitarios e integración)
- `make check` ejecuta linting y tests en un solo comando

---

## US-7.5 — UX transversal

**Como** agente  
**Quiero** una interfaz fluida y con feedback claro  
**Para** trabajar sin fricción

**Criterios de aceptación**
- Skeleton loading en tablas, tarjetas y calendario durante la carga de datos
- Toast notifications (Sonner) para feedback de acciones (éxito, error)
- Animaciones de transición de página con Framer Motion
