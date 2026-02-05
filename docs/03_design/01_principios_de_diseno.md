# Principios de Diseño UX/UI
## Sistema Web / CRM para Inmobiliaria Familiar

---

## 0. Propósito del documento

Este documento define los **principios de diseño UX/UI** que deben guiar
todo el diseño del sistema, tanto en el **backoffice privado** como en el
**escaparate público**.

Estos principios:
- Derivan directamente del PRD y del backlog funcional
- Son vinculantes para cualquier decisión de diseño posterior
- Deben respetarse en wireframes, UI final y desarrollo

---

## 1. Principio fundamental: doble naturaleza del producto

El sistema tiene **dos caras claramente diferenciadas**:

### 1.1 Backoffice (uso interno)
- Orientado a agentes inmobiliarios y administrador
- Uso intensivo y diario
- Alta densidad de información
- Prioridad: **eficiencia y claridad**

### 1.2 Escaparate público (uso externo)
- Orientado a clientes finales
- Uso ocasional
- Baja densidad de información
- Prioridad: **estética, confianza y claridad comercial**

❗ Ambos comparten marca y coherencia visual,  
pero **no comparten objetivos ni complejidad**.

---

## 2. Equilibrio funcionalidad ↔ estética

### Principio clave
> El sistema debe ser **agradable de usar** y **eficiente al mismo tiempo**.

Esto implica:
- No sacrificar usabilidad por estética
- No sacrificar estética por funcionalidad
- Diseñar cada pantalla según su público objetivo

---

## 3. Mobile-first real (no solo responsive)

### 3.1 Prioridad móvil
El diseño debe pensarse **primero para móvil** y luego escalar a escritorio.

Motivo:
- El agente trabaja gran parte del tiempo en la calle
- El sistema debe permitir registrar información en el momento

---

### 3.2 Implicaciones de diseño
- Formularios:
  - Campos esenciales visibles primero
  - Observaciones siempre accesibles
- Navegación:
  - Clara y directa
  - Sin menús complejos
- Botones:
  - Claros
  - Accionables con una mano

---

## 4. La agenda como centro del backoffice

### Principio irrenunciable
> La agenda (calendario) es la pantalla principal del sistema.

### Implicaciones
- Tras el login, el usuario accede directamente al calendario
- El calendario es:
  - Visual
  - Rápido de interpretar
  - Fácil de navegar por días y semanas
- Desde la agenda se accede a:
  - Visitas
  - Clientes
  - Propiedades relacionadas

---

## 5. Observaciones como elemento de primera clase

### Principio
> El texto libre es tan importante como los datos estructurados.

### Implicaciones
- Todos los módulos incluyen observaciones visibles
- Las observaciones:
  - No deben ocultarse en pestañas secundarias
  - No deben ser difíciles de editar
- El diseño debe invitar a escribir, no a evitarlo

---

## 6. Claridad y baja carga cognitiva (backoffice)

### Objetivo
Reducir el esfuerzo mental del agente.

### Reglas de diseño
- No sobrecargar pantallas
- Priorizar información clave
- Evitar iconografía confusa
- Patrones consistentes en todos los módulos:
  - Crear
  - Editar
  - Guardar
  - Cancelar

---

## 7. Escaparate público: confianza y atractivo visual

### Objetivo principal
Transmitir:
- Profesionalidad
- Confianza
- Claridad

---

### Principios visuales del escaparate
- Diseño limpio
- Espacios en blanco
- Tipografía legible
- Imágenes protagonistas
- Información clara y ordenada

---

### Reglas clave
- Nunca mostrar:
  - Observaciones internas
  - Información de agentes
  - Datos de propietarios
- El usuario nunca debe sentir que está “viendo algo interno”

---

## 8. Separación visual y conceptual

Aunque compartan identidad visual:
- El backoffice debe sentirse como una **herramienta**
- El escaparate debe sentirse como una **web comercial**

Esto se consigue con:
- Diferente densidad de información
- Diferente jerarquía visual
- Diferente tono de diseño

---

## 9. Consistencia global

Todo el sistema debe:
- Usar los mismos patrones de interacción
- Mantener coherencia visual
- No sorprender al usuario con comportamientos distintos

La consistencia reduce:
- Errores
- Fricción
- Curva de aprendizaje

---

## 10. Cierre

Estos principios son la base de todo el diseño posterior:
- Flujos de usuario
- Mapa de pantallas
- Wireframes
- UI final

Cualquier diseño que contradiga estos principios
debe considerarse incorrecto, aunque sea visualmente atractivo.
