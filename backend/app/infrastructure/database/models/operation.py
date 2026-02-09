from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, Enum as SqlEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import OperationType, OperationStatus

class Operation(Base):
    __tablename__ = "operations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core Fields
    type = Column(SqlEnum(OperationType), nullable=False)
    status = Column(SqlEnum(OperationStatus), default=OperationStatus.INTEREST, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relations
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False, index=True)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    client = relationship("Client", back_populates="operations")
    property = relationship("Property", back_populates="operations")
    agent = relationship("User", back_populates="managed_operations")
    
    status_history = relationship("OperationStatusHistory", back_populates="operation", cascade="all, delete-orphan", order_by="OperationStatusHistory.changed_at")
    notes = relationship("OperationNote", back_populates="operation", cascade="all, delete-orphan", order_by="OperationNote.created_at")
