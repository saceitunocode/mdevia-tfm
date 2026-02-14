from fastapi import APIRouter
from app.infrastructure.api.v1.endpoints import login, users, properties, clients, calendar_events, operations, visits, dashboard

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
api_router.include_router(clients.router, prefix="/clients", tags=["clients"])
api_router.include_router(calendar_events.router, prefix="/calendar-events", tags=["calendar"])
api_router.include_router(operations.router, prefix="/operations", tags=["operations"])
api_router.include_router(visits.router, prefix="/visits", tags=["visits"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

