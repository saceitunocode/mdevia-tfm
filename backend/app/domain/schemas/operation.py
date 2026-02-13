from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.domain.enums import OperationType, OperationStatus

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

# Nested summaries for UI
class ClientSummary(BaseModel):
    id: UUID
    full_name: str
    model_config = ConfigDict(from_attributes=True)

class PropertySummary(BaseModel):
    id: UUID
    title: str
    city: str
    model_config = ConfigDict(from_attributes=True)

class UserSummary(BaseModel):
    id: UUID
    full_name: str
    model_config = ConfigDict(from_attributes=True)

class OperationPublic(OperationBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    # Nested data
    client: Optional[ClientSummary] = None
    property: Optional[PropertySummary] = None
    agent: Optional[UserSummary] = None
    status_history: List[OperationStatusHistoryPublic] = []
    notes: List[OperationNotePublic] = []
    
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
