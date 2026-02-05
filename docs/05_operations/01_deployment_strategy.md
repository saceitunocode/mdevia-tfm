# 🚀 Estrategia de Despliegue — CRM Inmobiliario Familiar

**Estado:** Aprobado  
**Arquitectura base:** Monolito modular (Clean Architecture + Hexagonal)  
**Stack:** Next.js (Frontend) · FastAPI (Backend) · PostgreSQL · Object Storage S3-compatible

---

## 1. Objetivo

Definir **cómo se despliega el sistema en producción** de forma:
- Simple
- Segura
- Reproducible
- Fácil de mantener por un equipo pequeño

Este documento **no entra en detalle técnico**: solo fija el marco operativo.

---

## 2. Enfoque general

El sistema se despliega como:

- Frontend y Backend **separados**
- Todo en **contenedores Docker**
- Sin microservicios
- Sin Kubernetes

Se prioriza **simplicidad consciente** sobre escalado prematuro.

---

## 3. Entornos

Se definen **tres entornos**:

- **Local** → desarrollo (Docker Compose)
- **Staging** → validación previa a producción
- **Producción** → uso real del negocio

Staging debe comportarse igual que Producción, con datos no reales.

---

## 4. Estrategia adoptada

> **Despliegue Simple (recomendado)**

- Un único servidor (VPS o cloud sencillo)
- Docker + Docker Compose
- Servicios desplegados:
  - Frontend
  - Backend
  - PostgreSQL

Este enfoque es suficiente para el volumen esperado del negocio.

---

## 5. Qué se despliega en cada release

- **Frontend**
  - Imagen Docker versionada
  - Build independiente

- **Backend**
  - Imagen Docker versionada
  - Migraciones de base de datos controladas

- **Base de datos**
  - PostgreSQL persistente
  - Backups automáticos

Las imágenes (fotos de propiedades) se almacenan fuera del sistema (S3-compatible).

---

## 6. Flujo básico de despliegue

1. Cambios validados en código
2. Build de imágenes Docker
3. Despliegue en Staging
4. Validación manual
5. Despliegue en Producción
6. Verificación post-despliegue

---

## 7. Rollback

- Siempre se conserva la versión anterior
- Volver atrás = redeploy de la imagen previa
- Las migraciones deben ser **compatibles hacia atrás**

Rollback debe poder ejecutarse en minutos.

---

## 8. Riesgos asumidos

- Punto único de fallo (un servidor)
- Escalado manual

Estos riesgos son **aceptados conscientemente** y coherentes con el tamaño del negocio.

---

**Fin del documento**