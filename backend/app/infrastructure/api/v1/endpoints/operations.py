from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from app.infrastructure.api.v1.deps import CurrentAgent, get_db
from app.domain.schemas.operation import OperationPublic, OperationCreate, OperationUpdate, OperationNotePublic, OperationNoteCreate
from app.infrastructure.repositories.operation_repository import OperationRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.application.use_cases.operation_use_case import OperationUseCase

router = APIRouter()

def get_operation_use_case():
    return OperationUseCase(
        operation_repo=OperationRepository(),
        property_repo=PropertyRepository()
    )

@router.get("/", response_model=List[OperationPublic])
def read_operations(
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    use_case: OperationUseCase = Depends(get_operation_use_case)
) -> Any:
    """
    Retrieve operations. Shared history - visible to all agents.
    """
    return use_case.list_operations(db, skip=skip, limit=limit)

@router.post("/", response_model=OperationPublic, status_code=status.HTTP_201_CREATED)
def create_operation(
    *,
    operation_in: OperationCreate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: OperationUseCase = Depends(get_operation_use_case)
) -> Any:
    """
    Create new operation.
    """
    if operation_in.agent_id is None:
        operation_in.agent_id = current_agent.id
    return use_case.create_operation(db, operation_in)

@router.get("/{id}", response_model=OperationPublic)
def read_operation(
    id: uuid.UUID,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: OperationUseCase = Depends(get_operation_use_case)
) -> Any:
    """
    Get a specific operation.
    """
    operation = use_case.get_operation(db, operation_id=id)
    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")
    return operation

@router.patch("/{id}", response_model=OperationPublic)
def update_operation_status(
    *,
    id: uuid.UUID,
    operation_in: OperationUpdate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: OperationUseCase = Depends(get_operation_use_case)
) -> Any:
    """
    Update operation status and optionally add a note.
    Records history automatically.
    """
    operation = use_case.update_operation_status(
        db, 
        operation_id=id, 
        operation_in=operation_in,
        user_id=current_agent.id
    )
    if not operation:
        raise HTTPException(status_code=404, detail="Operation not found")
    return operation

@router.post("/{id}/notes", response_model=OperationNotePublic)
def create_operation_note(
    *,
    id: uuid.UUID,
    note_in: OperationNoteCreate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: OperationUseCase = Depends(get_operation_use_case)
) -> Any:
    """
    Add a general note to an operation.
    """
    return use_case.add_note(db, operation_id=id, text=note_in.text, user_id=current_agent.id)
