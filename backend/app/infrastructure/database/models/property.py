from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Numeric, Text, Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import PropertyStatus

class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core fields
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String, nullable=True)
    city = Column(String, nullable=False)
    postal_code = Column(String, nullable=True)
    sqm = Column(Integer, nullable=False)
    rooms = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=True)
    has_elevator = Column(Boolean, default=False, nullable=False)
    status = Column(SqlEnum(PropertyStatus), default=PropertyStatus.AVAILABLE, nullable=False, index=True)
    
    # Relations
    owner_client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    captor_agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Extended fields
    title = Column(String, nullable=False)
    public_description = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    price_amount = Column(Numeric(12, 2), nullable=True)
    price_currency = Column(String(3), default="EUR", nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    owner_client = relationship("Client", back_populates="owned_properties")
    captor_agent = relationship("User", back_populates="captured_properties")
