from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, Enum as SqlEnum, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import PropertyStatus

class PropertyStatusHistory(Base):
    __tablename__ = "property_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False, index=True)
    
    # Traceability
    from_status = Column(SqlEnum(PropertyStatus), nullable=True)
    to_status = Column(SqlEnum(PropertyStatus), nullable=False)
    
    from_price = Column(Numeric(12, 2), nullable=True)
    to_price = Column(Numeric(12, 2), nullable=True)
    
    changed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    changed_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    note = Column(Text, nullable=True)

    # Relationships
    property = relationship("Property", back_populates="status_history")
    changed_by_user = relationship("User")
