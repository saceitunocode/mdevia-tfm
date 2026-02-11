from typing import Optional, List
import uuid
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.domain.enums import PropertyStatus

class PropertyBase(BaseModel):
    title: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    postal_code: Optional[str] = None
    sqm: int
    rooms: int
    floor: Optional[int] = None
    has_elevator: bool = False
    status: PropertyStatus = PropertyStatus.AVAILABLE
    price_amount: Optional[Decimal] = None
    price_currency: str = "EUR"
    public_description: Optional[str] = None
    internal_notes: Optional[str] = None
    is_published: bool = True

class PropertyCreate(PropertyBase):
    owner_client_id: uuid.UUID

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    sqm: Optional[int] = None
    rooms: Optional[int] = None
    floor: Optional[int] = None
    has_elevator: Optional[bool] = None
    status: Optional[PropertyStatus] = None
    price_amount: Optional[Decimal] = None
    price_currency: Optional[str] = None
    public_description: Optional[str] = None
    internal_notes: Optional[str] = None
    is_published: Optional[bool] = None
    owner_client_id: Optional[uuid.UUID] = None

from app.domain.schemas.property_image import PropertyImage

class Property(PropertyBase):
    id: uuid.UUID
    captor_agent_id: uuid.UUID
    owner_client_id: uuid.UUID
    images: List[PropertyImage] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
