from typing import Any, List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.api.v1.deps import get_db, CurrentUser
from app.domain.schemas.client import (
    Client as ClientSchema,
    ClientCreate,
    ClientUpdate,
    ClientDetail as ClientDetailSchema,
    ClientNote as ClientNoteSchema,
    ClientNoteCreate
)
from app.infrastructure.database.models.client import Client
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

@router.post("/", response_model=ClientSchema)
def create_client(
    *,
    db: Session = Depends(get_db),
    client_in: ClientCreate,
    current_user: CurrentUser
) -> Any:
    """
    Create new client.
    """
    repo = ClientRepository()
    client = Client(
        full_name=client_in.full_name,
        email=client_in.email,
        phone=client_in.phone,
        type=client_in.type,
        responsible_agent_id=client_in.responsible_agent_id,
        is_active=client_in.is_active
    )
    return repo.create(db=db, client_obj=client)

@router.get("/{client_id}", response_model=ClientDetailSchema)
def read_client(
    *,
    db: Session = Depends(get_db),
    client_id: uuid.UUID,
    current_user: CurrentUser
) -> Any:
    """
    Get client by ID.
    """
    repo = ClientRepository()
    client = repo.get_by_id(db=db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client

@router.put("/{client_id}", response_model=ClientSchema)
def update_client(
    *,
    db: Session = Depends(get_db),
    client_id: uuid.UUID,
    client_in: ClientUpdate,
    current_user: CurrentUser
) -> Any:
    """
    Update a client.
    """
    repo = ClientRepository()
    client = repo.get_by_id(db=db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    client = repo.update(db=db, client_obj=client, client_in=client_in)
    return client

@router.delete("/{client_id}", response_model=ClientSchema)
def delete_client(
    *,
    db: Session = Depends(get_db),
    client_id: uuid.UUID,
    current_user: CurrentUser
) -> Any:
    """
    Delete a client.
    """
    repo = ClientRepository()
    client = repo.get_by_id(db=db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    # Check permissions? Admin only or Responsible Agent?
    # For now, allow responsible agent or admin.
    # In future iterations, add permission checks.
    
    repo.delete(db=db, client_id=client_id)
    return client

@router.post("/{client_id}/notes", response_model=ClientNoteSchema)
def create_client_note(
    *,
    db: Session = Depends(get_db),
    client_id: uuid.UUID,
    note_in: ClientNoteCreate,
    current_user: CurrentUser
) -> Any:
    """
    Add a note to a client.
    """
    repo = ClientRepository()
    client = repo.get_by_id(db=db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return repo.create_note(
        db=db,
        note_in=note_in,
        client_id=client_id,
        author_id=current_user.id
    )
