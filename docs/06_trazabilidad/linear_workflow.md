# 06b — Workflow de Linear

> **Propósito:** Cómo se usó Linear para gestionar el proyecto.  
> **Última actualización:** Febrero 2026.  
> **Estado del proyecto:** ✅ Completado.

---

## Información del proyecto

- **Workspace:** `saceitunocode`
- **Proyecto:** [MDEVIA-TFM en Linear](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae/overview)
- **Fecha de entrega:** 23 de febrero de 2026

---

## Uso de Linear en este proyecto

Linear se usó como **sistema de tracking de progreso y trazabilidad**, no como herramienta de planificación ágil (sin sprints ni estimaciones). El proyecto es individual y con entrega acelerada.

- ✅ Tracking de progreso por épica
- ✅ Trazabilidad entre documentación, issues y código
- ✅ Cierre automático de issues mediante PRs de GitHub

---

## Estructura de organización

Cada épica del backlog (`docs/02_backlog/`) se mapeó a un **Milestone** en Linear. Cada User Story se convirtió en uno o más **Issues**.

| Milestone | Épica | Prioridad | Estado |
|-----------|-------|-----------|--------|
| M0: Fundaciones | EP-0 | 🔴 Crítica | ✅ Done |
| M1: Usuarios y Roles | EP-1 | 🔴 Crítica | ✅ Done |
| M2: Gestión de Clientes | EP-2 | 🟡 Media | ✅ Done |
| M3: Gestión de Propiedades | EP-3 | 🟡 Media | ✅ Done |
| M4: Gestión de Visitas | EP-4 | 🟡 Media | ✅ Done |
| M5: Agenda y Calendario | EP-5 | 🟠 Alta | ✅ Done |
| M6: Operaciones | EP-6 | 🟡 Media | ✅ Done |
| M7: Movilidad y Calidad | EP-7 | 🟢 Baja | ✅ Done |
| M8: Escaparate Público | EP-8 | 🟠 Alta | ✅ Done |
| M9: Auditoría y Despliegue | EP-9 | 🟠 Alta | ✅ Done |

---

## Integración con GitHub

Linear se integró con GitHub mediante webhook. Las automatizaciones configuradas:

- **Rama vinculada a issue** → issue pasa a `In Review`
- **PR mergeado con `Closes TFM-XX`** → issue pasa a `Done` automáticamente

**Nomenclatura de ramas:**
```
feature/TFM-XX
bugfix/TFM-XX
```

**Palabras mágicas en PRs:**
```
Closes TFM-XX   → cierra el issue al mergear
Refs: TFM-XX    → vincula sin cerrar
```

**Política del proyecto:** los estados en Linear **nunca se actualizaron manualmente**; el cierre siempre fue por integración GitHub → Linear.

---

## Sistema de etiquetas

| Tipo | Labels |
|------|--------|
| Tipo de trabajo | `type:feature`, `type:bug`, `type:refactor`, `type:docs`, `type:test` |
| Capa técnica | `layer:frontend`, `layer:backend`, `layer:database`, `layer:api` |
| Módulo | `module:clients`, `module:properties`, `module:visits`, `module:calendar`, `module:operations`, `module:showcase` |
