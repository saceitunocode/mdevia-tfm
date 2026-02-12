from typing import Any, List, Optional
from datetime import datetime, time
from uuid import UUID

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.infrastructure.database.session import get_db
from app.infrastructure.database.models import User, CalendarEvent
from app.infrastructure.api.v1.deps import get_current_user
from app.domain.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate, CalendarEventResponse
from app.infrastructure.repositories.calendar_event_repository import CalendarEventRepository
from app.domain.enums import UserRole, EventType

router = APIRouter()

@router.post("/", response_model=CalendarEventResponse)
def create_calendar_event(
    *,
    db: Session = Depends(get_db),
    event_in: CalendarEventCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Create a new calendar event.
    Agents can only create events for themselves.
    Admins can create events for any agent.
    """
    if current_user.role == UserRole.AGENT:
        if event_in.agent_id and event_in.agent_id != current_user.id:
            raise HTTPException(status_code=403, detail="Agents cannot create events for others")
        event_in.agent_id = current_user.id
    
    # If admin doesn't specify agent, assumes self
    if not event_in.agent_id:
        event_in.agent_id = current_user.id
        
    repo = CalendarEventRepository(db)
    event = repo.create(event_in, event_in.agent_id)
    return event

@router.get("/", response_model=List[CalendarEventResponse])
def read_calendar_events(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[datetime] = Query(None, description="Filter events starting after this date"),
    end_date: Optional[datetime] = Query(None, description="Filter events ending before this date"),
    agent_id: Optional[UUID] = Query(None, description="Filter by agent ID (Admin only)"),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Retrieve calendar events.
    Agents can only see their own events.
    Admins can see all events or filter by agent.
    """
    repo = CalendarEventRepository(db)
    
    if current_user.role == UserRole.AGENT:
        # Agent enforces strict filtering to self
        events = repo.get_multi(
            skip=skip, 
            limit=limit, 
            agent_id=current_user.id,
            start_date=start_date,
            end_date=end_date
        )
    else:
        # Admin can filter by agent_id or see all
        events = repo.get_multi(
            skip=skip, 
            limit=limit, 
            agent_id=agent_id,
            start_date=start_date,
            end_date=end_date
        )
        
    return events

@router.get("/{event_id}", response_model=CalendarEventResponse)
def read_calendar_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Get calendar event by ID.
    Agents can only access their own events.
    """
    repo = CalendarEventRepository(db)
    event = repo.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role == UserRole.AGENT and event.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return event

@router.put("/{event_id}", response_model=CalendarEventResponse)
def update_calendar_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    event_in: CalendarEventUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Update a calendar event.
    Agents can only update their own events.
    """
    repo = CalendarEventRepository(db)
    event = repo.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role == UserRole.AGENT and event.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    event = repo.update(event, event_in)
    return event

@router.delete("/{event_id}", response_model=CalendarEventResponse)
def delete_calendar_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Delete a calendar event.
    Agents can only delete their own events.
    """
    repo = CalendarEventRepository(db)
    event = repo.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if current_user.role == UserRole.AGENT and event.agent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    repo.delete(event_id)
    return event
