# Stack Tecnológico (Frontend / Backend / DB / Storage)

## Estado

Aceptado

---

## Contexto

El PRD define un sistema con las siguientes características clave:

- Escaparate público (solo lectura) y backoffice privado (autenticado), con separación estricta.
- Prioridad de uso en móvil y rendimiento (< 2s en vistas clave, especialmente agenda).
- Gestión de datos personales sensibles (seguridad y privacidad críticas).
- Publicación de propiedades en el escaparate, incluyendo descripción e imágenes.
- Negocio pequeño (inmobiliaria familiar), sin necesidad de sobreingeniería.

La arquitectura previamente aprobada establece:

- Separación técnica frontend / backend.
- Backend basado en Clean Architecture + DDD.
- Persistencia relacional.
- Dominio protegido en el backend.

El stack tecnológico debe maximizar:

- Mantenibilidad y claridad arquitectónica.
- Productividad de desarrollo.
- Seguridad por diseño.
- Facilidad de despliegue y operación.
- Evolución futura sin reescrituras.

---

## Decisión

Se adopta el siguiente stack tecnológico:

### Frontend

- **Next.js + React**
  - Implementado como Web App.
  - Incluye:
    - Escaparate público.
    - Backoffice privado.
  - Permite renderizado híbrido (SSR / SSG / CSR) según necesidades de SEO y UX.
  - No contiene lógica de dominio ni reglas de negocio.
- **TypeScript** - JavaScript con tipado seguro
- **Tailwind CSS v4** - Framework CSS utility-first
- **Sentry** - Seguimiento de errores y monitoreo

### Backend

- **Python + FastAPI**
  - Implementado como API HTTP independiente.
  - Contiene:
    - Dominio.
    - Casos de uso.
    - Autenticación y autorización.
  - Organizado en capas según Clean Architecture:
    - Domain
    - Application
    - Infrastructure
    - Interfaces
- **Pydantic** - Validación de datos
- **Uvicorn** - Servidor ASGI

### Testing y Calidad

- **Vitest** - Testing unitario y de integración
- **Testing Library** - Testing de componentes React
- **Playwright** - Testing end-to-end
- **ESLint** - Linting con SonarJS y jsx-a11y
- **Husky** - Git hooks para verificaciones de calidad

### Base de datos

- **PostgreSQL**
  - Persistencia principal del dominio:
    - Clientes
    - Propiedades
    - Agenda
    - Visitas
    - Operaciones
  - Uso de índices optimizados para:
    - Agenda (día / semana).
    - Escaparate público.

### Almacenamiento de imágenes

- **Object Storage compatible con S3**
  - Las imágenes no se almacenan en la base de datos.
  - En PostgreSQL se guardan únicamente metadatos y referencias.
  - Entrega al frontend mediante URLs firmadas y/o CDN.

### Contenerización

- El sistema se ejecuta mediante **contenedores Docker separados**:
  - Frontend
  - Backend
  - Base de datos
- La contenerización permite:
  - Aislamiento de responsabilidades.
  - Consistencia entre entornos (local, staging, producción).
  - Simplificación del despliegue.

> La definición detallada de Dockerfiles, docker-compose, redes, volúmenes y backups se documentará en la fase de **Operaciones**.

### Autenticación (Backoffice)

- Autenticación gestionada exclusivamente por el backend.
- El backend emite tokens de sesión (JWT o equivalente).
- El frontend consume dichos tokens.
- El frontend no implementa autorización crítica:
  - Todas las validaciones reales se realizan en el backend.

---

## Alternativas consideradas

### A) Monolito fullstack con un único framework

**Ventajas**
- Menor número de piezas técnicas.

**Desventajas**
- Mayor acoplamiento entre UI y dominio.
- Menor flexibilidad para SEO y experiencia del escaparate.

**Motivo de descarte**
- El proyecto requiere separación clara y protección del dominio.

---

### B) Backend en Node.js (p.ej. NestJS)

**Ventajas**
- Unificación del lenguaje (TypeScript).

**Desventajas**
- No aporta ventaja decisiva al dominio.
- Menor alineación con la experiencia del equipo.

**Motivo de descarte**
- Preferencia técnica y madurez del ecosistema Python.

---

### C) Almacenamiento de imágenes en base de datos

**Ventajas**
- Simplicidad transaccional.

**Desventajas**
- Peor rendimiento.
- Backups pesados.
- Coste operativo innecesario.

**Motivo de descarte**
- Patrón no recomendado para sistemas con escaparate y media assets.

---

## Consecuencias

### Positivas

- Separación clara UI / API alineada con el PRD.
- Next.js facilita SEO del escaparate y UX del backoffice.
- FastAPI permite APIs rápidas, tipadas y con validación fuerte.
- PostgreSQL asegura integridad y trazabilidad del dominio.
- Object Storage desacopla binarios de datos transaccionales.
- Docker simplifica despliegue y operación.

### Costes / Riesgos

- Dos despliegues principales (frontend y backend).
- Gestión de CORS, cookies/tokens y políticas de seguridad.
- Requiere disciplina para no filtrar lógica de dominio a la UI.

---

## Reglas derivadas (normativas)

1. El dominio se implementa únicamente en el backend.
2. El frontend no contiene reglas de negocio.
3. No se almacenan imágenes en PostgreSQL.
4. La publicación en el escaparate depende del modelo de datos:
   - `is_active = true`
   - `is_published = true`
   - `status = AVAILABLE`
5. Toda autorización se valida en el backend.
6. Frontend, backend y base de datos se ejecutan en contenedores separados.

---

**Fin del documento**
