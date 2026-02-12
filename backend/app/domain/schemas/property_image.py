from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PropertyImageBase(BaseModel):
    caption: Optional[str] = None
    alt_text: Optional[str] = None
    position: int = 0
    is_cover: bool = False

class PropertyImageCreate(PropertyImageBase):
    property_id: uuid.UUID

class PropertyImageUpdate(PropertyImageBase):
    pass

class ReorderImages(BaseModel):
    image_ids: list[uuid.UUID]

class PropertyImage(PropertyImageBase):
    id: uuid.UUID
    property_id: uuid.UUID
    storage_key: str
    public_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
