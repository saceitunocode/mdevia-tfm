import uuid
from datetime import timedelta, datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.database.models.visit import Visit
from app.infrastructure.database.models.visit_note import VisitNote
from app.infrastructure.database.models.calendar_event import CalendarEvent
from app.infrastructure.repositories.visit_repository import VisitRepository
from app.infrastructure.repositories.calendar_event_repository import CalendarEventRepository
from app.infrastructure.repositories.client_repository import ClientRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.domain.schemas.visit import VisitCreate, VisitUpdate
from app.domain.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate
from app.domain.enums import EventType, EventStatus, VisitStatus

class VisitUseCase:
    def __init__(
        self, 
        visit_repo: VisitRepository,
        calendar_repo: CalendarEventRepository,
        client_repo: ClientRepository,
        property_repo: PropertyRepository
    ):
        self.visit_repo = visit_repo
        self.calendar_repo = calendar_repo
        self.client_repo = client_repo
        self.property_repo = property_repo

    def create_visit(self, db: Session, visit_in: VisitCreate) -> Visit:
        # 1. Create the Visit
        visit_obj = Visit(
            client_id=visit_in.client_id,
            property_id=visit_in.property_id,
            agent_id=visit_in.agent_id,
            scheduled_at=visit_in.scheduled_at,
            status=visit_in.status
        )
        visit = self.visit_repo.create(db, visit_obj)

        # 1.5 Add initial note if provided
        if visit_in.note:
            self.add_note(db, visit_id=visit.id, author_id=visit.agent_id, text=visit_in.note)

        # 2. Prepare Calendar Event Title
        client = self.client_repo.get_by_id(db, visit.client_id)
        prop = self.property_repo.get_by_id(db, visit.property_id)
        
        client_name = client.full_name if client else "Cliente Desconocido"
        prop_title = prop.title if prop else "Propiedad Desconocida"
        
        event_title = f"Visita: {client_name} - {prop_title}"

        # 3. Create sync Calendar Event
        event_in = CalendarEventCreate(
            title=event_title,
            type=EventType.VISIT,
            starts_at=visit.scheduled_at,
            ends_at=visit.scheduled_at + timedelta(hours=1),
            client_id=visit.client_id,
            property_id=visit.property_id,
            visit_id=visit.id,
            agent_id=visit.agent_id
        )
        self.calendar_repo.create(event_in, agent_id=visit.agent_id)
        
        return visit

    def update_visit(self, db: Session, visit_id: uuid.UUID, visit_in: VisitUpdate) -> Optional[Visit]:
        visit = self.visit_repo.get_by_id(db, visit_id)
        if not visit:
            return None
        
        old_scheduled_at = visit.scheduled_at
        
        # Update visit
        updated_visit = self.visit_repo.update(db, visit_obj=visit, visit_in=visit_in)

        # Add note if provided in update
        if visit_in.note:
            self.add_note(db, visit_id=visit_id, author_id=updated_visit.agent_id, text=visit_in.note)

        # Sync with Calendar Event if exists
        if updated_visit.calendar_event:
            event_update = CalendarEventUpdate()
            
            # If date changed, move event
            if visit_in.scheduled_at and visit_in.scheduled_at != old_scheduled_at:
                event_update.starts_at = visit_in.scheduled_at
                event_update.ends_at = visit_in.scheduled_at + timedelta(hours=1)
            
            # If status changed to CANCELLED, cancel event
            if visit_in.status == VisitStatus.CANCELLED:
                event_update.status = EventStatus.CANCELLED
            elif visit_in.status == VisitStatus.DONE:
                # Optional: could mark event as done or just leave active
                pass
            
            self.calendar_repo.update(updated_visit.calendar_event, event_update)

        return updated_visit

    def add_note(self, db: Session, visit_id: uuid.UUID, author_id: uuid.UUID, text: str) -> VisitNote:
        return self.visit_repo.create_note(db, visit_id=visit_id, author_id=author_id, text=text)

    def list_visits(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100, 
        agent_id: Optional[uuid.UUID] = None,
        property_id: Optional[uuid.UUID] = None,
        client_id: Optional[uuid.UUID] = None
    ):
        return self.visit_repo.list_all(
            db, skip=skip, limit=limit, agent_id=agent_id, property_id=property_id, client_id=client_id
        )

    def get_visit(self, db: Session, visit_id: uuid.UUID) -> Optional[Visit]:
        return self.visit_repo.get_by_id(db, visit_id)
        
    def delete_visit(self, db: Session, visit_id: uuid.UUID) -> bool:
        # Note: In calendar_event.py, visit relationship has cascade="all, delete-orphan"
        # but it's on the Visit side pointing to CalendarEvent? 
        # No, it's on Visit side: calendar_event = relationship("CalendarEvent", back_populates="visit", uselist=False, cascade="all, delete-orphan")
        # So deleting visit will delete the calendar event.
        return self.visit_repo.delete(db, visit_id)
