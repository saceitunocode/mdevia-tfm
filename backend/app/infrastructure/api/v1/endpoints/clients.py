from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.api.v1.deps import get_db, CurrentUser
from app.domain.schemas.client import Client as ClientSchema
from app.infrastructure.repositories.client_repository import ClientRepository

router = APIRouter()

@router.get("/", response_model=List[ClientSchema])
def read_clients(
    current_user: CurrentUser,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve clients.
    """
    repo = ClientRepository()
    return repo.list_all(db, skip=skip, limit=limit)
