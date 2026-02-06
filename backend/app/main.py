from fastapi import FastAPI
from app.core.config import settings
from app.infrastructure.api.api_v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Integración de rutas
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to mdevia-tfm CRM API",
        "docs": f"{settings.API_V1_STR}/docs",
        "version": settings.VERSION
    }
