from fastapi import APIRouter
from app.infrastructure.api.v1.endpoints import login, users, properties, clients

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
