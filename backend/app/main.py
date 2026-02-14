from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.core.config import settings
from app.infrastructure.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configuración de CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (imágenes)
# Asegurarse que el directorio existe
storage_path = settings.STORAGE_LOCAL_PATH
if not os.path.exists(storage_path):
    os.makedirs(storage_path)

app.mount("/static", StaticFiles(directory=storage_path), name="static")

# Integración de rutas
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to mdevia-tfm CRM API",
        "docs": f"{settings.API_V1_STR}/docs",
        "version": settings.VERSION
    }
