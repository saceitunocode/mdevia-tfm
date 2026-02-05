# 📚 Guía Completa de Documentación
## Sistema CRM Inmobiliario Familiar

> **Versión Extendida** - Este documento contiene toda la información detallada del proyecto, incluyendo tablas de referencias cruzadas, glosario completo y convenciones.  
> Para una versión más compacta, consulta [README.md](README.md)

---

## 🎯 Propósito de este Documento

Este documento sirve como **referencia completa** de toda la documentación del proyecto. Aquí encontrarás:

- El orden de lectura recomendado según tu rol (detallado)
- La estructura completa de la documentación
- Tablas de navegación y referencias cruzadas
- Glosario de términos del dominio
- Convenciones de nomenclatura
- Checklist completo de documentación

---

## 📂 Estructura de la Documentación

```
docs/
├── README.md                      ← Estás aquí
├── 01_prd/                        ← Requisitos del producto
│   └── prd.md
├── 02_backlog/                    ← Épicas y user stories
│   ├── 00_BACKLOG.md             ← Índice de épicas
│   ├── EP_00_fundaciones.md
│   ├── EP_01_usuarios_roles.md
│   ├── EP_02_clientes.md
│   ├── EP_03_propiedades.md
│   ├── EP_04_visitas.md
│   ├── EP_05_agenda.md
│   ├── EP_06_operaciones.md
│   ├── EP_07_movilidad_calidad.md
│   └── EP_08_escaparate.md
├── 03_design/                     ← Diseño UX/UI
│   ├── 01_principios_de_diseno.md
│   ├── 02_user_flows.md
│   ├── 03_mapa_de_pantallas.md
│   └── 04_wireframes_textuales.md
├── 04_architecture/               ← Arquitectura técnica
│   ├── 01_arquitectura.md
│   ├── 02_dominio.md
│   ├── 03_modelo_datos.md
│   └── 04_stack_tecnologico.md
├── 05_operations/                 ← Operaciones y despliegue
│   └── 01_deployment_strategy.md
└── 06_trazabilidad/              ← Mapas de trazabilidad
    └── mapa_requisitos.md
```

---

## 🎓 Orden de Lectura por Rol

### Para Evaluadores Académicos

**Objetivo:** Comprender el proyecto completo y evaluar su calidad técnica y académica.

1. **Visión General**
   - [README.md](../README.md) (raíz del proyecto)
   - [docs/README.md](README.md) (este documento)

2. **Requisitos y Alcance**
   - [prd.md](01_prd/prd.md) - Product Requirements Document

3. **Planificación Funcional**
   - [00_BACKLOG.md](02_backlog/00_BACKLOG.md) - Índice de épicas
   - Revisar épicas relevantes según interés

4. **Decisiones Arquitectónicas**
   - [01_arquitectura.md](04_architecture/01_arquitectura.md) - Arquitectura general
   - [02_dominio.md](04_architecture/02_dominio.md) - Modelo de dominio (DDD)
   - [03_modelo_datos.md](04_architecture/03_modelo_datos.md) - Base de datos
   - [04_stack_tecnologico.md](04_architecture/04_stack_tecnologico.md) - Stack técnico

5. **Diseño de Experiencia**
   - [01_principios_de_diseno.md](03_design/01_principios_de_diseno.md) - Filosofía de diseño
   - [03_mapa_de_pantallas.md](03_design/03_mapa_de_pantallas.md) - Estructura de UI

6. **Trazabilidad**
   - [mapa_requisitos.md](06_trazabilidad/mapa_requisitos.md) - Mapa completo

7. **Operaciones**
   - [01_deployment_strategy.md](05_operations/01_deployment_strategy.md) - Estrategia de despliegue

---

### Para Desarrolladores (Nuevos en el Proyecto)

**Objetivo:** Empezar a desarrollar lo antes posible con contexto suficiente.

1. **Contexto Inicial**
   - [README.md](../README.md) - Instalación y ejecución
   - [prd.md](01_prd/prd.md) - Requisitos del negocio

2. **Arquitectura Técnica** (Lectura obligatoria)
   - [01_arquitectura.md](04_architecture/01_arquitectura.md) - Principios arquitectónicos
   - [02_dominio.md](04_architecture/02_dominio.md) - Entidades y reglas de negocio
   - [03_modelo_datos.md](04_architecture/03_modelo_datos.md) - Esquema de base de datos
   - [04_stack_tecnologico.md](04_architecture/04_stack_tecnologico.md) - Tecnologías y justificación

3. **Funcionalidades a Implementar**
   - [00_BACKLOG.md](02_backlog/00_BACKLOG.md) - Índice de épicas
   - Revisar épica específica según módulo asignado

4. **Diseño de Interfaz**
   - [02_user_flows.md](03_design/02_user_flows.md) - Flujos de usuario
   - [03_mapa_de_pantallas.md](03_design/03_mapa_de_pantallas.md) - Estructura de pantallas
   - [04_wireframes_textuales.md](03_design/04_wireframes_textuales.md) - Wireframes detallados

5. **Despliegue**
   - [01_deployment_strategy.md](05_operations/01_deployment_strategy.md) - Cómo desplegar

---

### Para Stakeholders del Negocio

**Objetivo:** Entender qué hace el sistema y cómo beneficia al negocio.

1. **Visión General**
   - [README.md](../README.md) - Descripción general del proyecto

2. **Requisitos del Producto**
   - [prd.md](01_prd/prd.md) - Qué hace el sistema y por qué

3. **Experiencia de Usuario**
   - [01_principios_de_diseno.md](03_design/01_principios_de_diseno.md) - Filosofía de diseño
   - [02_user_flows.md](03_design/02_user_flows.md) - Cómo se usa el sistema

4. **Funcionalidades**
   - [00_BACKLOG.md](02_backlog/00_BACKLOG.md) - Índice de funcionalidades
   - Revisar épicas de interés ([EP-2 Clientes](02_backlog/EP_02_clientes.md), [EP-3 Propiedades](02_backlog/EP_03_propiedades.md), etc.)

---

## 🗺️ Mapa de Navegación Rápida

### Por Tema

| Tema | Documentos Relevantes |
|------|----------------------|
| **Requisitos de Negocio** | [prd.md](01_prd/prd.md) |
| **Funcionalidades** | [00_BACKLOG.md](02_backlog/00_BACKLOG.md) + épicas |
| **Diseño UX/UI** | [01_principios_de_diseno.md](03_design/01_principios_de_diseno.md), [02_user_flows.md](03_design/02_user_flows.md), [03_mapa_de_pantallas.md](03_design/03_mapa_de_pantallas.md), [04_wireframes_textuales.md](03_design/04_wireframes_textuales.md) |
| **Arquitectura** | [01_arquitectura.md](04_architecture/01_arquitectura.md), [02_dominio.md](04_architecture/02_dominio.md) |
| **Base de Datos** | [03_modelo_datos.md](04_architecture/03_modelo_datos.md) |
| **Stack Tecnológico** | [04_stack_tecnologico.md](04_architecture/04_stack_tecnologico.md) |
| **Despliegue** | [01_deployment_strategy.md](05_operations/01_deployment_strategy.md) |
| **Trazabilidad** | [mapa_requisitos.md](06_trazabilidad/mapa_requisitos.md) |
| **Gestión de Tareas** | [linear_workflow.md](06_trazabilidad/linear_workflow.md) |

### Por Módulo Funcional

| Módulo | PRD | Backlog | Diseño | Arquitectura |
|--------|-----|---------|--------|--------------|
| **Usuarios y Autenticación** | PRD §4 | [EP-0](02_backlog/EP_00_fundaciones.md), [EP-1](02_backlog/EP_01_usuarios_roles.md) | Principios §1.1 | Dominio §5.1 |
| **Clientes** | PRD §8.1 | [EP-2](02_backlog/EP_02_clientes.md) | Wireframes §2 | Dominio §5.2, BD: `clients` |
| **Propiedades** | PRD §8.2 | [EP-3](02_backlog/EP_03_propiedades.md) | Wireframes §3 | Dominio §5.3, BD: `properties` |
| **Visitas** | PRD §8.3 | [EP-4](02_backlog/EP_04_visitas.md) | Wireframes §4 | Dominio §5.5, BD: `visits` |
| **Agenda** | PRD §8.4 | [EP-5](02_backlog/EP_05_agenda.md) | Wireframes §1 | Dominio §5.4, BD: `calendar_events` |
| **Operaciones** | PRD §8.5 | [EP-6](02_backlog/EP_06_operaciones.md) | Wireframes §5 | Dominio §5.6, BD: `operations` |
| **Escaparate Público** | PRD §3.1 | [EP-8](02_backlog/EP_08_escaparate.md) | Wireframes §6 | Arquitectura §4.1 |

---

## 🔗 Referencias Cruzadas Importantes

### Del PRD al Backlog

| Requisito PRD | Épica Backlog |
|---------------|---------------|
| §3.1 Escaparate Público | [EP-8](02_backlog/EP_08_escaparate.md) |
| §4 Usuarios y Roles | [EP-0](02_backlog/EP_00_fundaciones.md), [EP-1](02_backlog/EP_01_usuarios_roles.md) |
| §8.1 Módulo Clientes | [EP-2](02_backlog/EP_02_clientes.md) |
| §8.2 Módulo Propiedades | [EP-3](02_backlog/EP_03_propiedades.md) |
| §8.3 Módulo Visitas | [EP-4](02_backlog/EP_04_visitas.md) |
| §8.4 Módulo Agenda | [EP-5](02_backlog/EP_05_agenda.md) |
| §8.5 Módulo Operaciones | [EP-6](02_backlog/EP_06_operaciones.md) |
| §9 Requisitos No Funcionales | [EP-7](02_backlog/EP_07_movilidad_calidad.md) |

### Del Backlog al Diseño

| Épica | Pantallas Principales |
|-------|----------------------|
| EP-2 (Clientes) | Listado Clientes, Ficha Cliente |
| EP-3 (Propiedades) | Listado Propiedades, Ficha Propiedad |
| EP-4 (Visitas) | Ficha Visita |
| EP-5 (Agenda) | Calendario (Día/Semana/Mes) |
| EP-6 (Operaciones) | Listado Operaciones, Ficha Operación |
| EP-8 (Escaparate) | Portal Público, Detalle Propiedad Pública |

### Del Diseño a la Arquitectura

| Pantalla | Entidad Dominio | Tabla BD |
|----------|-----------------|----------|
| Listado Clientes | Client | `clients` |
| Ficha Cliente | Client + Observation | `clients`, `observations` |
| Listado Propiedades | Property | `properties`, `property_images` |
| Ficha Propiedad | Property + PropertyImage | `properties`, `property_images` |
| Calendario | CalendarEvent | `calendar_events` |
| Ficha Visita | Visit | `visits` |
| Ficha Operación | Operation | `operations`, `operation_status_history` |

---

## 🛠️ Herramientas de Gestión del Proyecto

### Linear - Sistema de Ticketing

El proyecto utiliza **Linear** como sistema de gestión de tareas y seguimiento del desarrollo.

- **Workspace:** `saceitunocode`
- **Proyecto:** `MDEVIA-TFM`
- **URL:** [https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae)
- **Equipo:** `saceituno` (ID: `a03cd002-d65c-457e-800c-7646b40a4448`)

#### Uso de Linear en el Proyecto

Dado el contexto de entrega acelerada (finales de febrero 2026), Linear se utiliza de forma **pragmática y no tradicional**:

- **Sin sprints formales**: Las tareas se organizan por prioridad y dependencias técnicas
- **Épicas como milestones**: Cada épica del backlog (`EP_XX`) se mapea a un milestone en Linear
- **Issues derivados de documentación**: Las tareas se crean a partir de la documentación técnica existente
- **Trazabilidad bidireccional**: Cada issue en Linear referencia el documento fuente en `docs/`

#### Estructura de Issues

Cada issue en Linear sigue este formato:

```
Título: [TFM-XX] Nombre descriptivo de la tarea
Descripción:
- Contexto: Referencia al documento en docs/
- Criterios de aceptación: Extraídos de user stories
- Dependencias técnicas: Otras issues bloqueantes
```

**Nota:** La nomenclatura `TFM-XX` se utiliza de forma coherente en:
- Issues de Linear: `[TFM-2] US-01: Ver listado de clientes`
- Ramas de Git: `feature/TFM-2` (sin descripción, ya está en Linear)
- Commits: `[TFM-2] Implementa listado de clientes`

Esto garantiza trazabilidad completa entre la gestión de tareas y el código, sin duplicar información.


#### Documentación Relacionada

- **Mapa de trazabilidad**: [mapa_requisitos.md](06_trazabilidad/mapa_requisitos.md)
- **Uso detallado de Linear**: [linear_workflow.md](06_trazabilidad/linear_workflow.md)

---

## 📖 Glosario de Términos Clave

| Término | Definición | Documentos de Referencia |
|---------|------------|--------------------------|
| **Agente** | Usuario empleado del sistema (rol operativo) | [PRD](01_prd/prd.md) §4.2, [Dominio](04_architecture/02_dominio.md) §4 |
| **Administrador** | Usuario con permisos totales (rol supervisor) | [PRD](01_prd/prd.md) §4.2, [Dominio](04_architecture/02_dominio.md) §4 |
| **Cliente** | Persona física o jurídica (comprador/arrendatario/propietario) | [PRD](01_prd/prd.md) §8.1, [Dominio](04_architecture/02_dominio.md) §5.2 |
| **Propiedad** | Inmueble en el inventario de la inmobiliaria | [PRD](01_prd/prd.md) §8.2, [Dominio](04_architecture/02_dominio.md) §5.3 |
| **Visita** | Evento de encuentro entre cliente y propiedad | [PRD](01_prd/prd.md) §8.3, [Dominio](04_architecture/02_dominio.md) §5.5 |
| **Operación** | Seguimiento de proceso de venta o alquiler | [PRD](01_prd/prd.md) §8.5, [Dominio](04_architecture/02_dominio.md) §5.6 |
| **Agenda** | Calendario de eventos del agente | [PRD](01_prd/prd.md) §8.4, [Dominio](04_architecture/02_dominio.md) §5.4 |
| **Escaparate** | Portal público de propiedades disponibles | [PRD](01_prd/prd.md) §3.1, [Arquitectura](04_architecture/01_arquitectura.md) §4.1 |
| **Backoffice** | Sistema privado para empleados | [PRD](01_prd/prd.md) §3.2, [Arquitectura](04_architecture/01_arquitectura.md) §4.2 |
| **Observaciones** | Texto libre contextual asociado a entidades | [PRD](01_prd/prd.md) §5.5, [Dominio](04_architecture/02_dominio.md) §6 |
| **Bounded Context** | Límite conceptual dentro del dominio | [Arquitectura](04_architecture/01_arquitectura.md) §6.2, [Dominio](04_architecture/02_dominio.md) §3 |
| **Agregado** | Grupo de entidades con raíz única (DDD) | [Dominio](04_architecture/02_dominio.md) §5 |

---

## 🎯 Convenciones de Nomenclatura

### Archivos de Documentación

- **Índices principales**: `README.md` en cada directorio o prefijo `00_` (ej: `00_BACKLOG.md`)
- **Documentos de contenido**: Prefijo numérico `01_`, `02_`, etc. (orden de lectura lógico)
- **Épicas funcionales**: Prefijo `EP_XX_` donde XX es el número de épica

### Referencias entre Documentos

- Usar enlaces relativos en formato markdown
- Ejemplo: `[Dominio](04_architecture/02_dominio.md)`

---

## ✅ Checklist de Documentación Completa

Usa este checklist para verificar que toda la documentación necesaria existe:

- [x] [README.md](../README.md) (raíz del proyecto)
- [x] [Índice General](README.md) (`docs/README.md`)
- [x] [PRD](01_prd/prd.md) (`docs/01_prd/prd.md`)
- [x] [Backlog completo](02_backlog/00_BACKLOG.md) (9 épicas + índice)
- [x] [Principios de Diseño](03_design/01_principios_de_diseno.md)
- [x] [User Flows](03_design/02_user_flows.md)
- [x] [Mapa de Pantallas](03_design/03_mapa_de_pantallas.md)
- [x] [Wireframes Textuales](03_design/04_wireframes_textuales.md)
- [x] [Arquitectura General](04_architecture/01_arquitectura.md)
- [x] [Modelo de Dominio](04_architecture/02_dominio.md)
- [x] [Modelo de Datos](04_architecture/03_modelo_datos.md)
- [x] [Stack Tecnológico](04_architecture/04_stack_tecnologico.md)
- [x] [Estrategia de Despliegue](05_operations/01_deployment_strategy.md)
- [x] [Mapa de Trazabilidad](06_trazabilidad/mapa_requisitos.md)
- [x] [Workflow de Linear](06_trazabilidad/linear_workflow.md)

---

## 📝 Notas Importantes

### Filosofía Documental del Proyecto

1. **Documentación como código**: Versionada, revisada, mantenida
2. **Trazabilidad completa**: Cada requisito tiene su épica, pantalla y tabla
3. **Separación de responsabilidades**: Cada documento tiene un propósito único
4. **Coherencia vertical**: PRD → Backlog → Diseño → Arquitectura → Código
5. **Coherencia horizontal**: Documentos del mismo nivel son consistentes entre sí

### Mantenimiento de la Documentación

- **Actualizar siempre**: Si el código cambia, la documentación también
- **Validar referencias**: Verificar que los enlaces entre documentos funcionen
- **Revisar coherencia**: Usar el informe de auditoría como guía
- **Versionar cambios**: Documentar decisiones importantes en ADRs

---

## 🔄 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-02-05 | 1.1 | Añadida sección de herramientas de gestión (Linear) y documento de workflow |
| 2026-02-05 | 1.0 | Creación del índice general de documentación |

---

**Fin del Índice General**
