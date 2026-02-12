from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, ConfigDict

from app.domain.enums import EventType, EventStatus

# Base Schema
class CalendarEventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    type: EventType
    starts_at: datetime
    ends_at: datetime
    
    # Optional Relations
    client_id: Optional[UUID] = None
    property_id: Optional[UUID] = None
    operation_id: Optional[UUID] = None
    # visit_id is usually managed by the system when a Visit is created, 
    # but could be linked manually if needed.
    visit_id: Optional[UUID] = None

    @field_validator('ends_at')
    def ends_after_starts(cls, v, values):
        if 'starts_at' in values.data and v <= values.data['starts_at']:
            raise ValueError('ends_at must be after starts_at')
        return v

# Create Schema
class CalendarEventCreate(CalendarEventBase):
    agent_id: Optional[UUID] = None # Admin can specify, Agent overrides to self

# Update Schema
class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[EventType] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    status: Optional[EventStatus] = None
    
    client_id: Optional[UUID] = None
    property_id: Optional[UUID] = None
    operation_id: Optional[UUID] = None

# Response Schema
class CalendarEventResponse(CalendarEventBase):
    id: UUID
    agent_id: UUID
    status: EventStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
