# 📚 Documentación del Proyecto
## Sistema CRM Inmobiliario Familiar

## 🚀 Inicio Rápido

**Elige tu camino según tu objetivo:**

<table>
<tr>
<td width="33%" align="center">

### 👨‍🎓 Evaluador

Evaluar el TFM completo

**[→ Ir a Evaluación](#-evaluación-académica)**

</td>
<td width="33%" align="center">

### 👨‍💻 Desarrollador

Contribuir código

**[→ Ir a Desarrollo](#-desarrollo)**

</td>
<td width="33%" align="center">

### 💼 Stakeholder

Entender el negocio

**[→ Ir a Negocio](#-negocio)**

</td>
</tr>
</table>

---

## 📂 Estructura de Documentación

```
docs/
├── README.md                      ← Estás aquí (guía rápida)
├── 00_GUIA_COMPLETA.md           ← Documentación completa (tablas, glosario, etc.)
├── 01_prd/prd.md                 ← Requisitos del producto
├── 02_backlog/                   ← 9 épicas funcionales
├── 03_design/                    ← Diseño UX/UI (4 documentos)
├── 04_architecture/              ← Arquitectura técnica (4 documentos)
├── 05_operations/                ← Despliegue y operaciones
└── 06_trazabilidad/              ← Mapas de trazabilidad y Linear
```

---

## 🎓 Evaluación Académica

**Ruta recomendada (30-45 min de lectura):**

| # | Documento | Qué encontrarás | Tiempo |
|---|-----------|-----------------|--------|
| 1 | [PRD](01_prd/prd.md) | Qué hace el sistema y por qué existe | 10 min |
| 2 | [Arquitectura](04_architecture/01_arquitectura.md) | Decisiones técnicas y justificación | 15 min |
| 3 | [Modelo de Dominio](04_architecture/02_dominio.md) | Entidades y reglas de negocio (DDD) | 10 min |
| 4 | [Backlog](02_backlog/00_BACKLOG.md) | Alcance funcional (9 épicas) | 5 min |
| 5 | [Mapa de Trazabilidad](06_trazabilidad/mapa_requisitos.md) | Coherencia PRD → Código | 5 min |

**Documentación adicional:**
- [Modelo de Datos](04_architecture/03_modelo_datos.md) - Esquema de base de datos
- [Stack Tecnológico](04_architecture/04_stack_tecnologico.md) - Tecnologías y justificación
- [Diseño UX/UI](03_design/01_principios_de_diseno.md) - Filosofía de diseño
- [Estrategia de Despliegue](05_operations/01_deployment_strategy.md) - Docker + CI/CD

---

## 👨‍💻 Desarrollo

**Ruta recomendada (20-30 min de lectura):**

| # | Documento | Para qué sirve | Tiempo |
|---|-----------|----------------|--------|
| 1 | [README.md](../README.md) | Instalación y ejecución local | 5 min |
| 2 | [Arquitectura](04_architecture/01_arquitectura.md) | Principios arquitectónicos | 10 min |
| 3 | [Modelo de Dominio](04_architecture/02_dominio.md) | Entidades y reglas de negocio | 10 min |
| 4 | [Modelo de Datos](04_architecture/03_modelo_datos.md) | Esquema de BD y relaciones | 5 min |

**Antes de empezar a codificar:**
- Revisa la [épica específica](02_backlog/00_BACKLOG.md) de tu módulo
- Consulta los [wireframes](03_design/04_wireframes_textuales.md) de las pantallas
- Revisa el [workflow de Linear](06_trazabilidad/linear_workflow.md) para gestión de tareas

---

## 💼 Negocio

**Ruta recomendada (15-20 min de lectura):**

| # | Documento | Qué encontrarás | Tiempo |
|---|-----------|-----------------|--------|
| 1 | [PRD](01_prd/prd.md) | Qué hace el sistema y valor de negocio | 10 min |
| 2 | [User Flows](03_design/02_user_flows.md) | Cómo se usa el sistema | 5 min |
| 3 | [Backlog](02_backlog/00_BACKLOG.md) | Funcionalidades principales | 5 min |

**Funcionalidades clave:**
- [EP-2: Gestión de Clientes](02_backlog/EP_02_clientes.md)
- [EP-3: Gestión de Propiedades](02_backlog/EP_03_propiedades.md)
- [EP-8: Escaparate Público](02_backlog/EP_08_escaparate.md)

---

## 📊 Navegación Rápida por Necesidad

| Necesito... | Ir a... |
|-------------|---------|
| **Entender el negocio** | [PRD](01_prd/prd.md) |
| **Ver funcionalidades** | [Backlog](02_backlog/00_BACKLOG.md) |
| **Arquitectura técnica** | [Arquitectura](04_architecture/01_arquitectura.md) |
| **Modelo de dominio (DDD)** | [Dominio](04_architecture/02_dominio.md) |
| **Base de datos** | [Modelo de Datos](04_architecture/03_modelo_datos.md) |
| **Stack tecnológico** | [Stack](04_architecture/04_stack_tecnologico.md) |
| **Diseño de pantallas** | [Wireframes](03_design/04_wireframes_textuales.md) |
| **Flujos de usuario** | [User Flows](03_design/02_user_flows.md) |
| **Despliegue** | [Deployment](05_operations/01_deployment_strategy.md) |
| **Gestión de tareas** | [Linear Workflow](06_trazabilidad/linear_workflow.md) |

---

## 🔗 Enlaces Importantes

### Documentación Completa
- 📖 **[Guía Completa](00_GUIA_COMPLETA.md)** - Tablas de referencias cruzadas, glosario, convenciones

### Gestión del Proyecto
- 🎯 **[Linear - Proyecto TFM](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae)** - Gestión de tareas
- 📝 **[Workflow de Linear](06_trazabilidad/linear_workflow.md)** - Cómo usar Linear en este proyecto

### Épicas Funcionales
- [EP-0: Fundaciones](02_backlog/EP_00_fundaciones.md) - Setup inicial
- [EP-1: Usuarios y Roles](02_backlog/EP_01_usuarios_roles.md) - Autenticación
- [EP-2: Clientes](02_backlog/EP_02_clientes.md) - Gestión de clientes
- [EP-3: Propiedades](02_backlog/EP_03_propiedades.md) - Gestión de propiedades
- [EP-4: Visitas](02_backlog/EP_04_visitas.md) - Gestión de visitas
- [EP-5: Agenda](02_backlog/EP_05_agenda.md) - Calendario
- [EP-6: Operaciones](02_backlog/EP_06_operaciones.md) - Seguimiento de operaciones
- [EP-7: Movilidad y Calidad](02_backlog/EP_07_movilidad_calidad.md) - Requisitos no funcionales
- [EP-8: Escaparate](02_backlog/EP_08_escaparate.md) - Portal público

---

## ✅ Checklist de Documentación

- [x] [README.md](../README.md) - Instalación y ejecución
- [x] [PRD](01_prd/prd.md) - Requisitos del producto
- [x] [Backlog](02_backlog/00_BACKLOG.md) - 9 épicas funcionales
- [x] [Diseño](03_design/01_principios_de_diseno.md) - 4 documentos de UX/UI
- [x] [Arquitectura](04_architecture/01_arquitectura.md) - 4 documentos técnicos
- [x] [Operaciones](05_operations/01_deployment_strategy.md) - Despliegue
- [x] [Trazabilidad](06_trazabilidad/mapa_requisitos.md) - Mapas y Linear

---

## 📝 Notas Importantes

### Filosofía de Documentación

Este proyecto sigue el principio de **"Documentación como Código"**:
- ✅ Versionada en Git
- ✅ Trazabilidad completa: PRD → Backlog → Diseño → Arquitectura → Código
- ✅ Coherencia vertical y horizontal
- ✅ Actualización continua

### Para el Agente AI

Si eres un agente AI trabajando en este proyecto:
1. Lee **siempre** la [Guía Completa](00_GUIA_COMPLETA.md) para contexto detallado
2. Consulta las [tablas de referencias cruzadas](00_GUIA_COMPLETA.md#referencias-cruzadas-importantes) para trazabilidad
3. Revisa el [glosario de términos](00_GUIA_COMPLETA.md#glosario-de-términos-clave) para vocabulario del dominio
4. Sigue las [convenciones de nomenclatura](00_GUIA_COMPLETA.md#convenciones-de-nomenclatura)

---

**¿Necesitas más detalles?** → [Ver Guía Completa](00_GUIA_COMPLETA.md)
