from typing import Optional, List
import uuid
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.domain.enums import ClientType

class ClientBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: str
    type: ClientType
    is_active: bool = True

class ClientCreate(ClientBase):
    responsible_agent_id: uuid.UUID

class ClientUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    type: Optional[ClientType] = None
    is_active: Optional[bool] = None

class Client(ClientBase):
    id: uuid.UUID
    responsible_agent_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ClientNoteBase(BaseModel):
    text: str

class ClientNoteCreate(ClientNoteBase):
    pass

class ClientNote(ClientNoteBase):
    id: uuid.UUID
    client_id: uuid.UUID
    author_user_id: uuid.UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ClientDetail(Client):
    notes: List[ClientNote] = []

