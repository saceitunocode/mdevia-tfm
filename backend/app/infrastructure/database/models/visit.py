from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import VisitStatus

class Visit(Base):
    __tablename__ = "visits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core Actors
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False, index=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Details
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(SqlEnum(VisitStatus), default=VisitStatus.PENDING, nullable=False, index=True)
    # post_visit_notes removed in favor of VisitNote table
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    client = relationship("Client", back_populates="visits")
    property = relationship("Property", back_populates="visits")
    agent = relationship("User", back_populates="visits_conducted")
    
    # Backref to CalendarEvent (One-to-One)
    calendar_event = relationship("CalendarEvent", back_populates="visit", uselist=False, cascade="all, delete-orphan")
    notes = relationship("VisitNote", back_populates="visit", cascade="all, delete-orphan", order_by="desc(VisitNote.created_at)")
