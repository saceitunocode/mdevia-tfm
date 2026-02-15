from __future__ import annotations
from typing import Optional, List
import uuid
from decimal import Decimal
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.domain.enums import PropertyStatus, PropertyType, OperationType
from app.domain.schemas.property_image import PropertyImage, PropertyImagePublic

class PropertyNoteBase(BaseModel):
    text: str

class PropertyNoteCreate(PropertyNoteBase):
    pass

class PropertyNote(PropertyNoteBase):
    id: uuid.UUID
    property_id: uuid.UUID
    author_user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PropertyStatusHistory(BaseModel):
    id: uuid.UUID
    property_id: uuid.UUID
    from_status: Optional[PropertyStatus] = None
    to_status: PropertyStatus
    from_price: Optional[Decimal] = None
    to_price: Optional[Decimal] = None
    changed_at: datetime
    changed_by_user_id: uuid.UUID
    note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PropertyBase(BaseModel):
    title: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    postal_code: Optional[str] = None
    sqm: int
    rooms: int
    baths: int = 1
    floor: Optional[int] = None
    has_elevator: bool = False
    status: PropertyStatus = PropertyStatus.AVAILABLE
    property_type: PropertyType = PropertyType.APARTMENT
    operation_type: OperationType = OperationType.SALE
    price_amount: Optional[Decimal] = None
    price_currency: str = "EUR"
    public_description: Optional[str] = None
    internal_notes: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False

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
    baths: Optional[int] = None
    floor: Optional[int] = None
    has_elevator: Optional[bool] = None
    status: Optional[PropertyStatus] = None
    property_type: Optional[PropertyType] = None
    operation_type: Optional[OperationType] = None
    price_amount: Optional[Decimal] = None
    price_currency: Optional[str] = None
    public_description: Optional[str] = None
    internal_notes: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    owner_client_id: Optional[uuid.UUID] = None

class PropertyPublic(BaseModel):
    id: uuid.UUID
    title: str
    city: str
    sqm: int
    rooms: int
    baths: int
    floor: Optional[int] = None
    has_elevator: bool = False
    status: PropertyStatus
    property_type: PropertyType
    operation_type: OperationType
    price_amount: Optional[Decimal] = None
    price_currency: str
    public_description: Optional[str] = None
    is_featured: bool = False
    images: List[PropertyImagePublic] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PropertyPublicList(BaseModel):
    items: List[PropertyPublic]
    total: int

class Property(PropertyBase):
    id: uuid.UUID
    captor_agent_id: uuid.UUID
    owner_client_id: uuid.UUID
    images: List[PropertyImage] = []
    notes: List[PropertyNote] = []
    visits: List["VisitPublic"] = []
    operations: List["OperationPublic"] = []
    owner_client: Optional["Client"] = None
    captor_agent: Optional["User"] = None
    status_history: List[PropertyStatusHistory] = []
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# For late evaluation
from app.domain.schemas.visit import VisitPublic
from app.domain.schemas.operation import OperationPublic
from app.domain.schemas.client import Client
from app.domain.schemas.user import User

try:
    Property.model_rebuild(_types_namespace={
        "VisitPublic": VisitPublic,
        "OperationPublic": OperationPublic,
        "Client": Client,
        "User": User
    })
except Exception:
    pass
