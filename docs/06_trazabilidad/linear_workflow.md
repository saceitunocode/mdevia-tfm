# 🎯 Workflow de Linear para mdevia-tfm

## 📋 Información del Proyecto

- **Workspace:** `saceitunocode`
- **Equipo:** `saceitunocode` (ID: `a03cd002-d65c-457e-800c-7646b40a4448`)
- **Key del Equipo:** `TFM`
- **Proyecto:** `MDEVIA-TFM` (ID: `5eeb7ade-0cb2-43c9-8382-ebf025bc0789`)
- **URL del Proyecto:** [https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae)
- **Estado actual:** `Backlog`
- **Fecha de entrega:** 23 de febrero de 2026

---

## 🎯 Contexto y Filosofía de Uso

### Por qué NO usamos metodología tradicional

Este proyecto tiene características especiales:

1. **Entrega acelerada**: Finales de febrero 2026 (contra reloj)
2. **Desarrollo individual**: No hay equipo, solo un desarrollador
3. **Documentación previa completa**: Ya existe PRD, backlog, arquitectura y diseño
4. **Objetivo académico**: TFM con requisitos específicos de documentación

Por tanto, Linear se usa como:
- ✅ **Sistema de tracking de progreso**
- ✅ **Trazabilidad entre documentación y código**
- ✅ **Registro de decisiones técnicas**
- ❌ **NO como herramienta de planificación ágil**
- ❌ **NO con sprints ni estimaciones**

---

## 🗂️ Estructura de Organización

### Milestones = Épicas del Backlog

Cada épica documentada en `docs/02_backlog/` se mapea a un **Milestone** en Linear:

| Milestone | Épica | Documento | Prioridad |
|-----------|-------|-----------|-----------|
| **M0: Fundaciones** | EP-0 | `EP_00_fundaciones.md` | 🔴 Crítica |
| **M1: Usuarios y Roles** | EP-1 | `EP_01_usuarios_roles.md` | 🔴 Crítica |
| **M2: Gestión de Clientes** | EP-2 | `EP_02_clientes.md` | 🟠 Alta |
| **M3: Gestión de Propiedades** | EP-3 | `EP_03_propiedades.md` | 🟠 Alta |
| **M4: Gestión de Visitas** | EP-4 | `EP_04_visitas.md` | 🟡 Media |
| **M5: Agenda y Calendario** | EP-5 | `EP_05_agenda.md` | 🟡 Media |
| **M6: Operaciones** | EP-6 | `EP_06_operaciones.md` | 🟡 Media |
| **M7: Movilidad y Calidad** | EP-7 | `EP_07_movilidad_calidad.md` | 🟢 Baja |
| **M8: Escaparate Público** | EP-8 | `EP_08_escaparate.md` | 🟠 Alta |

### Issues = User Stories + Tareas Técnicas

Cada **User Story** del backlog se convierte en uno o más **Issues** en Linear.

**Formato de Issue:**

```
Título: [TFM-XX] US-YY: Descripción breve
Ejemplo: [TFM-2] US-01: Ver listado de clientes con filtros

Descripción:
📄 Documento fuente: docs/02_backlog/EP_02_clientes.md
🎯 User Story: Como agente, quiero ver un listado de clientes...

✅ Criterios de Aceptación:
- [ ] Criterio 1
- [ ] Criterio 2

🔗 Dependencias:
- Bloqueado por: #ISSUE_ID (si aplica)
- Relacionado con: #ISSUE_ID

🏗️ Referencias Técnicas:
- Arquitectura: docs/04_architecture/02_dominio.md §5.2
- Diseño: docs/03_design/04_wireframes_textuales.md §2.1
- Modelo de datos: docs/04_architecture/03_modelo_datos.md (tabla clients)
```

---

## 🏷️ Sistema de Etiquetas (Labels)

### Por Tipo de Trabajo

- `type:feature` - Nueva funcionalidad
- `type:bug` - Corrección de errores
- `type:refactor` - Refactorización de código
- `type:docs` - Actualización de documentación
- `type:infra` - Infraestructura y DevOps
- `type:test` - Pruebas y testing

### Por Capa Técnica

- `layer:frontend` - Next.js / React
- `layer:backend` - FastAPI / Python
- `layer:database` - PostgreSQL / Prisma
- `layer:auth` - Autenticación y autorización
- `layer:api` - Endpoints y contratos API

### Por Módulo Funcional

- `module:clients` - Gestión de clientes
- `module:properties` - Gestión de propiedades
- `module:visits` - Gestión de visitas
- `module:calendar` - Agenda y calendario
- `module:operations` - Operaciones comerciales
- `module:showcase` - Escaparate público
- `module:auth` - Autenticación y usuarios

### Por Prioridad (Nativa de Linear)

- `priority:urgent` (P1) - Bloqueante, debe hacerse YA
- `priority:high` (P2) - Importante para el MVP
- `priority:medium` (P3) - Deseable pero no crítico
- `priority:low` (P4) - Nice to have

---

## 🔄 Workflow de Estados

Linear usa estados nativos por equipo. Para este proyecto:

1. **Backlog** - Issue creado, pendiente de priorización
2. **Todo** - Priorizado, listo para trabajar
3. **In Progress** - En desarrollo activo
4. **In Review** - Código completado, pendiente de revisión
5. **Done** - Completado y verificado

**Reglas:**
- Un issue solo pasa a `Done` cuando cumple TODOS los criterios de aceptación
- Si hay código, debe tener tests
- Si afecta a UI, debe tener captura de pantalla en comentarios

---

## 🔗 Integración MCP con Antigravity

### Configuración Actual

El proyecto tiene configurado el **MCP de Linear** en Antigravity, lo que permite:

- ✅ Crear issues desde la línea de comandos
- ✅ Actualizar estados de issues
- ✅ Añadir comentarios con contexto técnico
- ✅ Listar issues filtrados por milestone/label
- ✅ Crear milestones automáticamente

### Comandos Útiles (vía Antigravity)

```bash
# Listar todos los issues del proyecto
mcp_linear_list_issues project:"mdevia-tfm"

# Crear un nuevo issue
mcp_linear_create_issue \
  team:"Saceitunocode" \
  project:"mdevia-tfm" \
  title:"[TFM-2] US-01: Ver listado de clientes" \
  description:"..." \
  labels:["type:feature", "module:clients"]

# Crear un milestone
mcp_linear_create_milestone \
  project:"mdevia-tfm" \
  name:"M2: Gestión de Clientes" \
  description:"Épica EP-2 del backlog"

# Actualizar estado de un issue
mcp_linear_update_issue \
  id:"ISSUE_ID" \
  state:"In Progress"
```

---

## 🔗 Integración con GitHub

### Configuración del Webhook

Para que Linear y GitHub se comuniquen automáticamente, es necesario configurar un webhook en el repositorio:

1. **Acceder a la configuración del repositorio** en GitHub
2. Ir a **Settings** → **Webhooks** → **Add webhook**
3. Configurar los siguientes parámetros:
   - **Payload URL**: `https://client-api.linear.app/connect/github/webhook/[WORKSPACE_ID]` (proporcionado por Linear)
   - **Content type**: `application/json`
   - **Secret**: Token proporcionado por Linear
   - **Events**: Seleccionar "Send me everything" o específicamente:
     - Push events
     - Pull request events
     - Issue comments

### Magic Words (Palabras Mágicas)

Una vez configurado el webhook, Linear detecta automáticamente estas palabras en commits y PRs:

#### En Commits:
```bash
git commit -m "[TFM-1] Implementa autenticación

Refs: TFM-1"
# → Vincula el commit al issue TFM-1
```

#### En Pull Requests:
```markdown
## Descripción
Implementa el sistema de autenticación con JWT

Fixes TFM-1
# → Vincula el PR y cierra automáticamente el issue al mergear
```

**Palabras reconocidas:**
- `Fixes TFM-XX` / `Fixed TFM-XX`
- `Closes TFM-XX` / `Closed TFM-XX`
- `Resolves TFM-XX` / `Resolved TFM-XX`
- `Refs: TFM-XX` (solo vincula, no cierra)

### Automatizaciones Configuradas

En **Linear → Settings → Teams → [TFM] → Workflow → GitHub**:

- ✅ **Link commits to issues with magic words**: Activado
- ✅ **Auto-link branches**: Activado (formato: `feature/identifier`)
- ✅ **When a pull request is linked**: Mover a `In Review`
- ✅ **When a pull request is merged**: Mover a `Done`

---

## 📊 Trazabilidad Bidireccional

### De Documentación → Linear

Cada documento del backlog (`EP_XX_*.md`) tiene una sección de User Stories. Para cada US:

1. Se crea un **Issue** en Linear
2. El issue referencia el documento fuente
3. Se asigna al **Milestone** correspondiente
4. Se añaden **Labels** según tipo y módulo

### De Linear → Código

Cada commit debe referenciar el issue de Linear:

```bash
git commit -m "[TFM-2] US-01: Implementa listado de clientes con filtros

- Añade endpoint GET /api/clients con paginación
- Implementa filtros por nombre, email y tipo
- Añade tests unitarios para el servicio

Refs: LIN-123"
```

### Nomenclatura de Ramas Git

**IMPORTANTE:** Las ramas de Git siguen la misma nomenclatura que los issues de Linear para mantener coherencia total.

**Convención de nombres:**

```bash
# Formato general
feature/TFM-XX
bugfix/TFM-XX
refactor/TFM-XX

# Ejemplos concretos
feature/TFM-2
feature/TFM-3
bugfix/TFM-15
refactor/TFM-8
```

**Workflow de trabajo:**

```bash
# 1. Crear rama desde main
git checkout main
git pull origin main
git checkout -b feature/TFM-2

# 2. Desarrollar y hacer commits
git add .
git commit -m "[TFM-2] Implementa componente de listado

- Añade tabla con paginación
- Implementa filtros por nombre y email
- Añade tests unitarios

Refs: LIN-123"

# 3. Push y crear PR
git push origin feature/TFM-2

# 4. En el PR de GitHub, referenciar el issue de Linear
# Título del PR: [TFM-2] Implementa listado de clientes con filtros
# Descripción: Closes LIN-123
```

**Beneficios de esta nomenclatura:**

- ✅ **Sin redundancia**: La descripción está en Linear, no se duplica en ramas
- ✅ **Trazabilidad inmediata**: El número TFM-XX conecta rama → issue → documentación
- ✅ **Coherencia**: Mismo prefijo `TFM-XX` en Linear, Git y commits
- ✅ **Simplicidad**: Ramas cortas y fáciles de escribir
- ✅ **Automatización**: Posibilidad de integrar Linear con GitHub para actualizar estados automáticamente


### De Código → Documentación

Si durante el desarrollo se toman decisiones arquitectónicas importantes:

1. Se documenta en el **Issue de Linear** (comentario)
2. Se actualiza el documento técnico correspondiente en `docs/04_architecture/`
3. Se referencia el issue en el commit de actualización de docs

---

## 🎯 Proceso de Creación de Issues

### Paso 1: Analizar Épica

1. Abrir documento de épica en `docs/02_backlog/EP_XX_*.md`
2. Identificar todas las User Stories
3. Revisar criterios de aceptación

### Paso 2: Crear Milestone (si no existe)

```bash
# Vía MCP de Linear
mcp_linear_create_milestone \
  project:"mdevia-tfm" \
  name:"M2: Gestión de Clientes" \
  description:"Implementación de EP-2: Gestión de Clientes"
```

### Paso 3: Crear Issues por User Story

Para cada US en la épica:

```bash
mcp_linear_create_issue \
  team:"Saceitunocode" \
  project:"mdevia-tfm" \
  milestone:"M2: Gestión de Clientes" \
  title:"[TFM-2] US-01: Ver listado de clientes con filtros" \
  description:"..." \
  labels:["type:feature", "module:clients", "layer:frontend", "layer:backend"] \
  priority:2
```

### Paso 4: Establecer Dependencias

Si una US depende de otra:

```bash
mcp_linear_update_issue \
  id:"ISSUE_ID" \
  blockedBy:["BLOCKER_ISSUE_ID"]
```

---

## 📈 Métricas y Seguimiento

### Indicadores Clave

- **Completion Rate**: % de issues en `Done` por milestone
- **Blocker Count**: Número de issues bloqueados
- **Critical Path**: Issues en ruta crítica para entrega

### Revisión Diaria

Cada sesión de desarrollo:

1. Revisar issues en `In Progress`
2. Actualizar estados según avance real
3. Identificar nuevos blockers
4. Ajustar prioridades si es necesario

---

## 🚀 Próximos Pasos

### Fase 1: Configuración Inicial (Ahora)

- [x] Verificar conexión MCP con Linear
- [x] Documentar workflow en `docs/06_trazabilidad/`
- [ ] Crear los 9 milestones base
- [ ] Crear issues para EP-0 (Fundaciones)
- [ ] Crear issues para EP-1 (Usuarios y Roles)

### Fase 2: Población de Backlog

- [ ] Analizar cada épica del backlog
- [ ] Crear issues para todas las User Stories
- [ ] Establecer dependencias entre issues
- [ ] Asignar prioridades según ruta crítica

### Fase 3: Desarrollo Iterativo

- [ ] Trabajar issues por orden de prioridad
- [ ] Actualizar estados en tiempo real
- [ ] Documentar decisiones técnicas en comentarios
- [ ] Mantener trazabilidad en commits

---

## 📚 Referencias

- **Documentación de Linear**: [https://linear.app/docs](https://linear.app/docs)
- **MCP Linear Server**: Configurado en `.agent/mcp_config.json`
- **Backlog del Proyecto**: `docs/02_backlog/00_BACKLOG.md`
- **Mapa de Trazabilidad**: `docs/06_trazabilidad/mapa_requisitos.md`

---

**Última actualización:** 2026-02-05  
**Versión:** 1.0
