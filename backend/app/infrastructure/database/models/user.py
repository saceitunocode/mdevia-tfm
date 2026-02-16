from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import UserRole

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=True, index=True)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    role = Column(SqlEnum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    # Relationships
    responsible_for_clients = relationship("Client", back_populates="responsible_agent")
    captured_properties = relationship("Property", back_populates="captor_agent")
    
    # Operation related
    managed_operations = relationship("Operation", back_populates="agent")
    status_changes_made = relationship("OperationStatusHistory", back_populates="changed_by_user")
    operation_notes = relationship("OperationNote", back_populates="author")
    
    # Agenda and Visits
    visits_conducted = relationship("Visit", back_populates="agent")
    calendar_events = relationship("CalendarEvent", back_populates="agent", cascade="all, delete-orphan")
    
    # Audit and Transversal
    client_notes = relationship("ClientNote", back_populates="author")
    property_notes = relationship("PropertyNote", back_populates="author")
    visit_notes = relationship("VisitNote", back_populates="author")
    domain_events_triggered = relationship("DomainEvent", back_populates="actor")
