from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.domain.enums import OperationType, OperationStatus
from app.domain.schemas.summaries import ClientSummary, PropertySummary, UserSummary
from app.domain.schemas.user import User

if TYPE_CHECKING:
    from app.domain.schemas.visit import VisitPublic

# History Schema
class OperationStatusHistoryBase(BaseModel):
    operation_id: UUID
    from_status: OperationStatus
    to_status: OperationStatus
    changed_at: datetime
    changed_by_user_id: UUID
    note: Optional[str] = None

class OperationStatusHistoryPublic(OperationStatusHistoryBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

# Note Schema for Operations
class OperationNoteBase(BaseModel):
    operation_id: UUID
    text: str

class OperationNoteCreate(BaseModel):
    text: str

class OperationNotePublic(OperationNoteBase):
    id: UUID
    author_user_id: UUID
    author: Optional[UserSummary] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Operation Schemas
class OperationBase(BaseModel):
    type: OperationType
    status: OperationStatus = OperationStatus.INTEREST
    client_id: UUID
    property_id: UUID
    agent_id: UUID

class OperationCreate(OperationBase):
    agent_id: Optional[UUID] = None # Optional in request, set by backend
    note: Optional[str] = None

class OperationUpdate(BaseModel):
    status: Optional[OperationStatus] = None
    note: Optional[str] = None

class OperationPublic(OperationBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Nested data
    client: Optional[ClientSummary] = None
    property: Optional[PropertySummary] = None
    agent: Optional[User] = None
    status_history: List[OperationStatusHistoryPublic] = []
    notes: List[OperationNotePublic] = []
    visits: List["VisitPublic"] = []
    
    model_config = ConfigDict(from_attributes=True)

# For late evaluation
from app.domain.schemas.visit import VisitPublic
OperationPublic.model_rebuild()
