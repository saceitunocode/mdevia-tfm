from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.infrastructure.database.base import Base

class DomainEvent(Base):
    __tablename__ = "domain_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Audit details
    event_type = Column(String, nullable=False, index=True) # e.g. "USER_CREATED", "PROPERTY_PUBLISHED"
    entity_type = Column(String, nullable=False, index=True) # e.g. "User", "Property"
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    payload_json = Column(JSONB, nullable=False)
    
    occurred_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    actor_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Relationship (Optional, as actor might be system or deleted user)
    actor = relationship("User", back_populates="domain_events_triggered")
