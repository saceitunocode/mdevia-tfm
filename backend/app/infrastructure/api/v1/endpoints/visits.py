from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session
import uuid
from app.infrastructure.api.v1.deps import CurrentAgent, get_db
from app.domain.schemas.visit import VisitPublic, VisitCreate, VisitUpdate, VisitNotePublic, VisitNoteCreate
from app.infrastructure.repositories.visit_repository import VisitRepository
from app.infrastructure.repositories.calendar_event_repository import CalendarEventRepository
from app.infrastructure.repositories.client_repository import ClientRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.application.use_cases.visit_use_case import VisitUseCase
from app.domain.enums import UserRole

router = APIRouter()

def get_visit_use_case(db: Session = Depends(get_db)):
    return VisitUseCase(
        visit_repo=VisitRepository(),
        calendar_repo=CalendarEventRepository(db),
        client_repo=ClientRepository(),
        property_repo=PropertyRepository()
    )

@router.get("/", response_model=List[VisitPublic])
def read_visits(
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    agent_id: Optional[uuid.UUID] = Query(None),
    property_id: Optional[uuid.UUID] = Query(None),
    client_id: Optional[uuid.UUID] = Query(None),
    use_case: VisitUseCase = Depends(get_visit_use_case)
) -> Any:
    """
    Retrieve visits. 
    Agents see their own or all if they want? 
    PRD says Agents see their agenda.
    Let's filter by agent_id if current user is AGENT.
    """
    if current_agent.role == UserRole.AGENT:
        agent_id = current_agent.id
        
    return use_case.list_visits(
        db, 
        skip=skip, 
        limit=limit, 
        agent_id=agent_id, 
        property_id=property_id, 
        client_id=client_id
    )

@router.post("/", response_model=VisitPublic, status_code=status.HTTP_201_CREATED)
def create_visit(
    *,
    visit_in: VisitCreate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: VisitUseCase = Depends(get_visit_use_case)
) -> Any:
    """
    Create new visit. Automatically syncs with calendar.
    """
    try:
        print(f"DEBUG: Creating visit for agent_id={current_agent.id}, role={current_agent.role}")
        # If agent_id is not provided, use the current user
        if not visit_in.agent_id:
            visit_in.agent_id = current_agent.id
            
        return use_case.create_visit(db, visit_in)
    except Exception as e:
        print(f"DEBUG ERROR in create_visit: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}", response_model=VisitPublic)
def read_visit(
    id: uuid.UUID,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: VisitUseCase = Depends(get_visit_use_case)
) -> Any:
    """
    Get a specific visit.
    """
    visit = use_case.get_visit(db, visit_id=id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    # Permission check: Agent can only see their own visits? 
    # Usually in real estate agents can see all properties/visits for context.
    # But agenda is personal. Let's allow seeing for now.
    return visit

@router.patch("/{id}", response_model=VisitPublic)
def update_visit(
    *,
    id: uuid.UUID,
    visit_in: VisitUpdate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: VisitUseCase = Depends(get_visit_use_case)
) -> Any:
    """
    Update visit details or status. Syncs with calendar.
    """
    visit = use_case.get_visit(db, visit_id=id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    if current_agent.role == UserRole.AGENT and visit.agent_id != current_agent.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to update this visit")

    return use_case.update_visit(db, visit_id=id, visit_in=visit_in)

@router.post("/{id}/notes", response_model=VisitNotePublic)
def create_visit_note(
    *,
    id: uuid.UUID,
    note_in: VisitNoteCreate,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: VisitUseCase = Depends(get_visit_use_case)
) -> Any:
    """
    Add a note to a visit.
    """
    return use_case.add_note(db, visit_id=id, author_id=current_agent.id, text=note_in.text)



@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit(
    id: uuid.UUID,
    current_agent: CurrentAgent,
    db: Session = Depends(get_db),
    use_case: VisitUseCase = Depends(get_visit_use_case)
):
    """
    Delete a visit. Automatically removes calendar event.
    """
    visit = use_case.get_visit(db, visit_id=id)
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    if current_agent.role == UserRole.AGENT and visit.agent_id != current_agent.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to delete this visit")

    use_case.delete_visit(db, visit_id=id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
