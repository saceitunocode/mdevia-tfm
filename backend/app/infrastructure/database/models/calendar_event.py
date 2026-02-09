from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, Enum as SqlEnum, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import EventType, EventStatus

class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Time Range
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    
    type = Column(SqlEnum(EventType), nullable=False)
    status = Column(SqlEnum(EventStatus), default=EventStatus.ACTIVE, nullable=False, index=True)
    
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)

    # Optional Links (Polymorphic-ish but strictly typed FKs)
    visit_id = Column(UUID(as_uuid=True), ForeignKey("visits.id"), nullable=True, unique=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=True)
    operation_id = Column(UUID(as_uuid=True), ForeignKey("operations.id"), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint('starts_at < ends_at', name='check_starts_before_ends'),
    )

    # Relationships
    agent = relationship("User", back_populates="calendar_events")
    visit = relationship("Visit", back_populates="calendar_event")
    client = relationship("Client", back_populates="calendar_events")
    property = relationship("Property", back_populates="calendar_events")
    operation = relationship("Operation", back_populates="calendar_events")
