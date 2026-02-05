<div align="center">

# 🎓 mdevia-tfm

### Sistema CRM para Gestión Inmobiliaria
**Trabajo de Fin de Máster**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-27-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Tabla de Contenidos

- [🎓 mdevia-tfm](#-mdevia-tfm)
    - [Sistema CRM para Gestión Inmobiliaria](#sistema-crm-para-gestión-inmobiliaria)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [🎯 Descripción General](#-descripción-general)
  - [💡 Concepto del Proyecto](#-concepto-del-proyecto)
    - [Objetivo](#objetivo)
    - [Interfaces del Sistema](#interfaces-del-sistema)
  - [🚀 Funcionalidades Planificadas](#-funcionalidades-planificadas)
    - [👥 Portal del Cliente (Público)](#-portal-del-cliente-público)
    - [🔐 Panel de Agentes (Privado)](#-panel-de-agentes-privado)
  - [🛠️ Stack Tecnológico](#️-stack-tecnológico)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Base de Datos](#base-de-datos)
    - [DevOps](#devops)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
  - [🚀 Instalación y Ejecución](#-instalación-y-ejecución)
    - [Requisitos Previos](#requisitos-previos)
    - [Opción 1: Ejecución con Docker (Recomendado)](#opción-1-ejecución-con-docker-recomendado)
    - [Opción 2: Desarrollo Local](#opción-2-desarrollo-local)
      - [Frontend](#frontend-1)
      - [Backend](#backend-1)
  - [🌐 Despliegue](#-despliegue)
    - [Producción con Docker](#producción-con-docker)
    - [Variables de Entorno](#variables-de-entorno)
  - [📚 Documentación Adicional](#-documentación-adicional)
    - [Documentación del Proyecto](#documentación-del-proyecto)
      - [📖 Documentos Principales](#-documentos-principales)
      - [🎨 Diseño UX/UI](#-diseño-uxui)
      - [🏗️ Arquitectura](#️-arquitectura)
      - [🚀 Operaciones](#-operaciones)
    - [Recursos Adicionales](#recursos-adicionales)
    - [Requisitos de Entrega](#requisitos-de-entrega)
  - [🚀 Futuras Mejoras](#-futuras-mejoras)
    - [Portal del Cliente](#portal-del-cliente)
    - [Panel de Agentes](#panel-de-agentes)
    - [Integraciones](#integraciones)

---

## 🎯 Descripción General

> **Nota:** Este proyecto es un Trabajo de Fin de Máster que demuestra la integración de tecnologías modernas de desarrollo web full-stack aplicadas a un caso de uso real.

**mdevia-tfm** es un sistema CRM (Customer Relationship Management) completo diseñado específicamente para la gestión integral de una agencia inmobiliaria. El proyecto combina un frontend reactivo desarrollado con Next.js y un backend robusto con FastAPI, todo orquestado mediante Docker para facilitar el despliegue y la escalabilidad.

La aplicación ofrece una solución dual: un **portal público** para que los clientes potenciales exploren propiedades disponibles, y un **panel de administración privado** para que los agentes inmobiliarios gestionen eficientemente su inventario, clientes y publicaciones en múltiples portales.

---

## 💡 Concepto del Proyecto

### Objetivo

Desarrollar una plataforma web integral que digitalice y optimice la gestión de una agencia inmobiliaria, facilitando tanto la exposición de propiedades a clientes potenciales como la administración interna de las operaciones comerciales.

### Interfaces del Sistema

**🌐 Portal del Cliente (Público)**
- Escaparate digital de propiedades en venta y alquiler
- Navegación intuitiva sin necesidad de autenticación
- Experiencia optimizada para la búsqueda y visualización de inmuebles

**🔐 Panel de Agentes (Privado)**
- Sistema de autenticación seguro para agentes inmobiliarios
- Gestión completa de entidades: propiedades, clientes, transacciones
- Herramientas de administración y seguimiento de operaciones

---

## 🚀 Funcionalidades Planificadas

### 👥 Portal del Cliente (Público)

- **🔍 Búsqueda Avanzada de Propiedades**
  - Filtros por precio (mínimo/máximo)
  - Filtros por superficie (m²)
  - Filtros por número de habitaciones
  - Filtros por ciudad/ubicación

- **📸 Galería de Imágenes**
  - Visualización de múltiples fotos por propiedad
  - Galería responsive y optimizada
  - Imagen principal destacada

### 🔐 Panel de Agentes (Privado)

- **🏠 Gestión de Propiedades**
  - CRUD completo de inmuebles
  - Formulario detallado con campos:
    - Precio (venta/alquiler)
    - Superficie (m²)
    - Número de habitaciones
    - Número de baños
    - Tipo de propiedad (piso, casa, local, etc.)
    - Descripción detallada
    - Características adicionales
    - Estado de la propiedad
  - Sistema de carga múltiple de imágenes
  - Gestión de documentación asociada

- **👤 Gestión de Clientes**
  - Base de datos de clientes potenciales
  - Historial de interacciones y visitas
  - Seguimiento de operaciones
  - Observaciones y notas contextuales

- **📅 Agenda y Calendario**
  - Vista de calendario con eventos
  - Programación de visitas
  - Gestión de citas y recordatorios
  - Agenda como pantalla principal

- **💼 Gestión de Operaciones**
  - Seguimiento de ventas y alquileres
  - Estados de operación (Interés, Negociación, Reservado, Cerrado)
  - Historial de cambios de estado
  - Observaciones por operación

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.1 con App Router
- **UI Library:** React 19
- **Lenguaje:** TypeScript 5.7
- **Estilos:** CSS Modules / Tailwind CSS

### Backend
- **Framework:** FastAPI 0.115
- **Lenguaje:** Python 3.12
- **Validación:** Pydantic
- **Autenticación:** JWT (JSON Web Tokens)

### Base de Datos
- **Motor:** PostgreSQL 17
- **ORM:** SQLAlchemy
- **Migraciones:** Alembic

### DevOps
- **Contenedorización:** Docker & Docker Compose
- **Control de Versiones:** Git
- **Arquitectura:** Microservicios (Frontend, Backend, Database)

---

## 📁 Estructura del Proyecto

```
mdevia-tfm/
├── frontend/                 # Aplicación Next.js
│   ├── app/                 # App Router de Next.js
│   │   ├── (public)/       # Rutas públicas (portal cliente)
│   │   └── (private)/      # Rutas privadas (panel agentes)
│   ├── components/          # Componentes React reutilizables
│   ├── lib/                # Utilidades y helpers
│   ├── public/              # Archivos estáticos
│   ├─── package.json         # Dependencias del frontend
│   └── Dockerfile          # Imagen Docker del frontend
│
├── backend/                  # API FastAPI
│   ├── app/                 # Código fuente de la API
│   │   ├── api/            # Endpoints de la API
│   │   │   ├── properties/ # Gestión de propiedades
│   │   │   ├── clients/    # Gestión de clientes
│   │   │   ├── auth/       # Autenticación
│   │   │   └── portals/    # Integraciones con portales
│   │   ├── models/         # Modelos de base de datos
│   │   ├── schemas/        # Esquemas Pydantic
│   │   └── services/       # Lógica de negocio
│   ├── requirements.txt     # Dependencias de Python
│   └── Dockerfile          # Imagen Docker del backend
│
├── docker-compose.yml       # Orquestación de contenedores
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Docker** >= 27.0
- **Docker Compose** >= 2.0
- **Node.js** >= 20.x (para desarrollo local)
- **Python** >= 3.12 (para desarrollo local)

### Opción 1: Ejecución con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/mdevia-tfm.git
cd mdevia-tfm

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**URLs de acceso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Opción 2: Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🌐 Despliegue

### Producción con Docker

```bash
# Construir imágenes de producción
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=mdevia_tfm

# Backend
SECRET_KEY=tu_clave_secreta_muy_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📚 Documentación Adicional

### Documentación del Proyecto

El proyecto cuenta con documentación técnica completa organizada en la carpeta `docs/`:

#### 📖 Documentos Principales

- **[Índice General](docs/README.md)** - Guía de navegación de toda la documentación
- **[Product Requirements Document (PRD)](docs/01_prd/prd.md)** - Requisitos oficiales del producto
- **[Backlog Funcional](docs/02_backlog/00_BACKLOG.md)** - Índice de épicas y user stories
- **[Mapa de Trazabilidad](docs/06_trazabilidad/mapa_requisitos.md)** - Trazabilidad completa PRD → Código

#### 🎨 Diseño UX/UI

- [Principios de Diseño](docs/03_design/01_principios_de_diseno.md)
- [User Flows](docs/03_design/02_user_flows.md)
- [Mapa de Pantallas](docs/03_design/03_mapa_de_pantallas.md)
- [Wireframes Textuales](docs/03_design/04_wireframes_textuales.md)

#### 🏗️ Arquitectura

- [Arquitectura General](docs/04_architecture/01_arquitectura.md)
- [Modelo de Dominio (DDD)](docs/04_architecture/02_dominio.md)
- [Modelo de Datos](docs/04_architecture/03_modelo_datos.md)
- [Stack Tecnológico](docs/04_architecture/04_stack_tecnologico.md)

#### 🚀 Operaciones

- [Estrategia de Despliegue](docs/05_operations/01_deployment_strategy.md)

### Recursos Adicionales

- 🎯 **Gestión del Proyecto:** [Linear - MDEVIA-TFM](https://linear.app/saceitunocode/project/mdevia-tfm-684913071bae)
- 📊 **Presentación:** [Ver Slides](#) *(Añadir URL)*
- 🌍 **Demo en Vivo:** [Acceder a la aplicación](#) *(Añadir URL)*
- 📖 **Documentación API:** http://localhost:8000/docs (cuando esté ejecutándose)

### Requisitos de Entrega

Este proyecto cumple con los siguientes requisitos:

✅ Documentación completa y detallada  
✅ Repositorio público en GitHub  
✅ Stack tecnológico moderno y robusto  
✅ Instrucciones de instalación y ejecución  
✅ Estructura del proyecto clara  
✅ Funcionalidades implementadas  
✅ Sistema de despliegue con Docker  
✅ Caso de uso real aplicado  

---

## 🚀 Futuras Mejoras

Las siguientes funcionalidades están planificadas para versiones futuras del sistema:

### Portal del Cliente
- **🗺️ Visualización Geográfica**
  - Mapa interactivo con ubicación de propiedades
  - Búsqueda por área geográfica
  - Visualización de propiedades cercanas

- **📞 Sistema de Contacto**
  - Formulario de contacto directo con agentes
  - Solicitud de información sobre propiedades específicas
  - Gestión de citas desde el portal público

- **🔍 Filtros Avanzados**
  - Filtros por tipo de operación (venta/alquiler)
  - Búsqueda por zonas específicas

### Panel de Agentes
- **📊 Dashboard Administrativo**
  - Estadísticas de propiedades activas
  - Métricas de rendimiento
  - Seguimiento de publicaciones
  - Reportes y análisis

### Integraciones
- **🌐 Publicación Automática en Portales**
  - Integración con **Idealista**
  - Integración con **Fotocasa**
  - Integración con **Pisos.com**
  - Sincronización automática de propiedades
  - Gestión centralizada de publicaciones

---

<div align="center">

**Desarrollado con ❤️ para el TFM**

*Sistema CRM Inmobiliario - Gestión Integral de Propiedades*

[⬆ Volver arriba](#-mdevia-tfm)

</div>