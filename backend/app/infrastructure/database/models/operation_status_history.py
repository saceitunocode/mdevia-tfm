from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, Enum as SqlEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base
from app.domain.enums import OperationStatus

class OperationStatusHistory(Base):
    __tablename__ = "operation_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    operation_id = Column(UUID(as_uuid=True), ForeignKey("operations.id"), nullable=False, index=True)
    
    # Traceability
    from_status = Column(SqlEnum(OperationStatus), nullable=False)
    to_status = Column(SqlEnum(OperationStatus), nullable=False)
    
    changed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    changed_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    note = Column(Text, nullable=True) # Optional note for the status change

    # Relationships
    operation = relationship("Operation", back_populates="status_history")
    changed_by_user = relationship("User", back_populates="status_changes_made")
