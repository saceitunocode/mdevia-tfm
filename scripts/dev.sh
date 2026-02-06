#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color
# Asegurar que estamos en la raíz del proyecto
cd "$(dirname "$0")/.." || exit 1

echo -e "${BLUE}🚀 Iniciando entorno de desarrollo para MDEVIA-TFM...${NC}"

# Función para matar procesos al salir
cleanup() {
    echo -e "\n${RED}🛑 Deteniendo servicios...${NC}"
    kill $(jobs -p) 2>/dev/null
    wait
    echo -e "${GREEN}✅ Todos los servicios detenidos.${NC}"
}

# Atrapar señal SIGINT (Ctrl+C)
# Atrapar señal SIGINT (Ctrl+C)
trap cleanup SIGINT EXIT

# Función de limpieza preventiva
# Función de limpieza preventiva
pre_cleanup() {
    echo -e "${BLUE}🧹 Verificando estado del entorno...${NC}"
    
    # 1. Matar procesos en puertos clave
    if fuser 8000/tcp >/dev/null 2>&1 || fuser 3000/tcp >/dev/null 2>&1; then
        echo "   Matando procesos ocupando puertos 3000/8000..."
        fuser -k -TERM 8000/tcp >/dev/null 2>&1
        fuser -k -TERM 3000/tcp >/dev/null 2>&1
        sleep 2 # Dar tiempo más generoso para cierre ordenado
    fi

    # 2. Verificar si siguen vivos y forzar si es necesario
    if fuser 8000/tcp >/dev/null 2>&1 || fuser 3000/tcp >/dev/null 2>&1; then
         echo "   Forzando cierre..."
         fuser -k -KILL 8000/tcp >/dev/null 2>&1
         fuser -k -KILL 3000/tcp >/dev/null 2>&1
         sleep 1
    fi

    # 3. Limpiar lock file de Next.js (Causa del error 'Unable to acquire lock')
    if [ -f "frontend/.next/dev/lock" ]; then
        echo "   🔓 Eliminando lock file huérfano de Next.js..."
        rm -f "frontend/.next/dev/lock"
    fi
    
    echo -e "${GREEN}♻️  Entorno limpio y listo.${NC}"
}

# Ejecutar limpieza antes de empezar
pre_cleanup

# 1. Arrancar Backend
echo -e "${GREEN}🐍 Arrancando Backend (FastAPI)...${NC}"
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
    # Ejecutamos uvicorn en background
    # Usamos --host 0.0.0.0 para asegurar visibilidad si fuera necesario, aunque localhost basta
    # --reload para hot reload
    (cd backend && uvicorn app.main:app --reload --port 8000) &
    BACKEND_PID=$!
else
    echo -e "${RED}❌ Error: No se encuentra el entorno virtual en backend/venv${NC}"
    echo "Ejecuta: cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# 2. Arrancar Frontend
echo -e "${GREEN}⚛️  Arrancando Frontend (Next.js)...${NC}"
if [ -d "frontend" ]; then
    # Ejecutamos pnpm dev en background
    (cd frontend && pnpm dev) &
    FRONTEND_PID=$!
else
    echo -e "${RED}❌ Error: No se encuentra el directorio frontend${NC}"
    exit 1
fi

echo -e "${BLUE}✨ Entorno levantado y listo!${NC}"
echo -e "${BLUE}👉 Frontend: ${NC}http://localhost:3000${NC}"
echo -e "${BLUE}👉 Backend:  ${NC}http://localhost:8000/docs${NC}"
echo -e "${BLUE}⌨️  Presiona Ctrl+C para detener ambos servicios.${NC}"

# Esperar a que cualquier proceso termine (o Ctrl+C)
wait -n