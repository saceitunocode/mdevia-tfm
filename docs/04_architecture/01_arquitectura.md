# Arquitectura del Sistema — CRM Inmobiliario Familiar

## 1. Propósito del documento

Este documento define la **arquitectura técnica oficial** del sistema web / CRM para la inmobiliaria familiar.

Constituye parte de la **memoria viva del proyecto** y debe servir como referencia para:

* Desarrollo
* Evaluación académica
* Evolución futura del sistema

Todas las decisiones aquí descritas **derivan directamente del PRD** y están alineadas con sus principios.

---

## 2. Principios arquitectónicos

La arquitectura del sistema se rige por los siguientes principios innegociables:

1. **Dominio al centro**: la lógica de negocio no depende de frameworks ni de infraestructura.
2. **Clean Architecture** como base estructural.
3. **DDD (Domain-Driven Design)** para modelar el negocio real.
4. **Simplicidad consciente**: no se sobredimensiona la solución.
5. **Separación estricta** entre escaparate público y backoffice privado.
6. **Historial y trazabilidad** como ciudadanos de primera clase.
7. **Uso prioritario en móvil**, sin sacrificar escritorio.
8. **Seguridad y privacidad por diseño**.

---

## 3. Estilo arquitectónico elegido

### Arquitectura frontend / backend

El sistema adopta una **separación explícita entre frontend y backend** a nivel técnico y de despliegue.

Esta separación es **descriptiva, no contractual**, y forma parte de la arquitectura lógica del sistema:

* El **frontend** se implementa como una **aplicación web** (SPA / Web App).
* El **backend** se implementa como una **API HTTP independiente**.
* La comunicación entre frontend y backend se realiza mediante **API REST (o equivalente)**.
* El **dominio y las reglas de negocio viven exclusivamente en el backend**.
* El frontend **no contiene lógica de negocio**, solo orquesta la experiencia de usuario.

Esta decisión:

* Refuerza la seguridad del dominio.
* Facilita la evolución independiente de UI y backend.
* Permite optimizar la experiencia móvil sin comprometer el modelo de negocio.

### Decisión

El sistema se implementa como un:

> **Monolito modular basado en Clean Architecture + Arquitectura Hexagonal**

### Justificación

* El tamaño del negocio (<10 empleados) no justifica microservicios.
* El dominio es rico en reglas, estados e historial.
* Se prioriza mantenibilidad y claridad sobre complejidad técnica.
* Permite evolucionar el sistema sin reescrituras drásticas.

### Alternativas descartadas

* **CRUD tradicional**: acopla dominio e infraestructura.
* **Microservicios**: complejidad operativa innecesaria.

---

## 4. Separación lógica del sistema

El sistema se divide en **dos grandes subsistemas claramente aislados**:

### 4.1 Escaparate público

* Acceso sin autenticación
* Solo lectura
* Función exclusiva: mostrar propiedades disponibles
* Sin acceso a datos internos ni lógica de negocio sensible

### 4.2 Backoffice privado

* Acceso autenticado
* Uso exclusivo por empleados
* Gestión completa del dominio
* Agenda como vista principal tras login

Esta separación es **funcional, lógica y de seguridad**.

---

## 5. Capas de la arquitectura (Clean Architecture)

### Vista global frontend / backend

* **Frontend (Web App)**

  * Escaparate público
  * Backoffice privado
  * Renderizado de vistas
  * Gestión de navegación y estado
  * Consumo de API HTTP

* **Backend (API)**

  * Dominio
  * Casos de uso
  * Autenticación y autorización
  * Persistencia y acceso a datos

El frontend **no contiene reglas de negocio**. Todas las decisiones críticas se ejecutan en el backend.

El sistema sigue el esquema clásico de Clean Architecture:

* **Domain Layer**

  * Entidades
  * Value Objects
  * Reglas de negocio

* **Application Layer**

  * Casos de uso
  * Orquestación del dominio
  * DTOs de entrada y salida

* **Infrastructure Layer**

  * Base de datos
  * Autenticación
  * Servicios externos

* **Interface Layer**

  * UI Web (Escaparate / Backoffice)
  * Controladores

La regla de dependencias se respeta estrictamente: **las dependencias siempre apuntan hacia el dominio**.

---

## 6. Análisis del dominio (DDD)

### 6.1 Dominio central

El núcleo del negocio no es la propiedad, sino:

* La **agenda**
* Las **visitas**
* El **seguimiento comercial**

El sistema modela cómo la inmobiliaria **toma decisiones en el tiempo**.

---

### 6.2 Bounded Contexts

El dominio se divide en los siguientes contextos delimitados:

* **Identity & Access** — usuarios y autenticación
* **Clientes** — personas y contexto comercial
* **Propiedades** — inventario inmobiliario
* **Agenda** — calendario y eventos (core)
* **Visitas** — eventos de interacción
* **Operaciones** — seguimiento hasta cierre
* **Escaparate** — publicación pública (read-only)

Estos contextos **no son microservicios**, sino límites conceptuales dentro del monolito.

---

## 7. Entidades principales del dominio

### Entidades

* User (Administrador / Agente)
* Client
* Property
* Visit
* CalendarEvent
* Operation

### Value Objects

* Address
* DateTimeRange
* Observation
* Status

### Reglas transversales

* No se eliminan datos críticos (uso de estados).
* Toda entidad relevante tiene:

  * Agente responsable
  * Historial
  * Observaciones libres

---

## 8. Persistencia y datos

### Base de datos

* **PostgreSQL** como base de datos principal.

### Criterios

* Modelo relacional explícito
* Integridad referencial
* Índices optimizados para agenda y visitas
* Backups automáticos

---

## 9. Seguridad

La seguridad es un pilar fundamental del sistema y se refuerza con la separación frontend / backend:

* Autenticación gestionada exclusivamente en el backend (FastAPI)
* Tokens o sesiones consumidas por el frontend
* No existe lógica de autorización crítica en el frontend
* No existe registro público
* Contraseñas cifradas
* Comunicación HTTPS
* Separación estricta de permisos
* Protección de datos personales sensibles

La seguridad es un pilar fundamental del sistema:

* Autenticación obligatoria en backoffice
* No existe registro público
* Contraseñas cifradas
* Comunicación HTTPS
* Separación estricta de permisos
* Protección de datos personales sensibles

---

## 10. Decisiones arquitectónicas (ADR — resumen)

### ADR-001 — Estilo arquitectónico

* **Decisión**: Monolito modular hexagonal
* **Motivo**: Simplicidad, mantenibilidad, dominio rico

### ADR-002 — Persistencia

* **Decisión**: PostgreSQL
* **Motivo**: Fiabilidad, relaciones, historial

### ADR-003 — Autenticación

* **Decisión**: Autenticación interna
* **Motivo**: Sistema cerrado, sin usuarios públicos

---

## 11. Riesgos y mitigaciones

| Riesgo                 | Mitigación                      |
| ---------------------- | ------------------------------- |
| Rendimiento de agenda  | Índices y queries optimizadas   |
| Pérdida de información | Estados + historial + backups   |
| Confusión de usuarios  | Separación clara de interfaces  |
| Exceso de complejidad  | Arquitectura monolítica modular |

---

## 12. Estado del documento

Este documento queda **aprobado y congelado** como base arquitectónica del proyecto.

Cualquier cambio deberá:

* Referenciar el PRD
* Generar un nuevo ADR
* Justificar la desviación

---

**Fin del documento**
