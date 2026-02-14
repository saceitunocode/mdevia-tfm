from __future__ import annotations
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.domain.enums import VisitStatus
from app.domain.schemas.summaries import ClientSummary, PropertySummary, UserSummary

# --- Visit Note Schemas ---

class VisitNoteBase(BaseModel):
    text: str

class VisitNoteCreate(VisitNoteBase):
    pass

class VisitNotePublic(VisitNoteBase):
    id: UUID
    visit_id: UUID
    author_user_id: UUID
    created_at: datetime
    
    # We can add author summary if needed
    author_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Visit Schemas ---

class VisitBase(BaseModel):
    client_id: UUID
    property_id: UUID
    agent_id: UUID
    scheduled_at: datetime
    status: VisitStatus = VisitStatus.PENDING

class VisitCreate(VisitBase):
    agent_id: Optional[UUID] = None
    note: Optional[str] = None

class VisitUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    status: Optional[VisitStatus] = None
    note: Optional[str] = None

class VisitPublic(VisitBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    # Use summaries instead of full models to break circularity
    client: Optional[ClientSummary] = None
    property: Optional[PropertySummary] = None
    agent: Optional[UserSummary] = None
    
    notes: List[VisitNotePublic] = []

    model_config = ConfigDict(from_attributes=True)
