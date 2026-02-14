from pydantic import BaseModel, ConfigDict
from uuid import UUID

class UserSummary(BaseModel):
    id: UUID
    full_name: str
    model_config = ConfigDict(from_attributes=True)

class ClientSummary(BaseModel):
    id: UUID
    full_name: str
    model_config = ConfigDict(from_attributes=True)

class PropertySummary(BaseModel):
    id: UUID
    title: str
    city: str
    model_config = ConfigDict(from_attributes=True)
