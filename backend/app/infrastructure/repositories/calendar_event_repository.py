from typing import List, Optional
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, and_

from app.infrastructure.database.models.calendar_event import CalendarEvent
from app.domain.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate

class CalendarEventRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, event_in: CalendarEventCreate, agent_id: UUID) -> CalendarEvent:
        # agent_id is already in event_in, but we enforce the one passed as argument just in case
        data = event_in.model_dump()
        data['agent_id'] = agent_id
        
        db_obj = CalendarEvent(**data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def get(self, id: UUID) -> Optional[CalendarEvent]:
        return self.db.get(CalendarEvent, id)

    def get_multi(
        self, 
        *, 
        skip: int = 0, 
        limit: int = 100, 
        agent_id: Optional[UUID] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[CalendarEvent]:
        query = select(CalendarEvent)
        
        conditions = []
        if agent_id:
            conditions.append(CalendarEvent.agent_id == agent_id)
        
        if start_date:
            conditions.append(CalendarEvent.starts_at >= start_date)
            
        if end_date:
            conditions.append(CalendarEvent.ends_at <= end_date)
            
        if conditions:
            query = query.where(and_(*conditions))
            
        query = query.offset(skip).limit(limit).order_by(CalendarEvent.starts_at.asc())
        
        result = self.db.execute(query)
        return result.scalars().all()

    def update(self, db_obj: CalendarEvent, obj_in: CalendarEventUpdate) -> CalendarEvent:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: UUID) -> Optional[CalendarEvent]:
        obj = self.db.get(CalendarEvent, id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
        return obj
