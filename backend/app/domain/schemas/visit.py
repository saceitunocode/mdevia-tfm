from typing import List, Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.domain.enums import VisitStatus

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
    
    # Use TYPE_CHECKING to avoid circular imports if any, or just local imports
    # In this case, we use the class names as defined in their modules
    
    client: Optional["Client"] = None
    property: Optional["Property"] = None
    agent: Optional["User"] = None
    
    notes: List[VisitNotePublic] = []

    model_config = ConfigDict(from_attributes=True)

# For late evaluation of string types
from app.domain.schemas.client import Client
from app.domain.schemas.property import Property
from app.domain.schemas.user import User

VisitPublic.model_rebuild()
