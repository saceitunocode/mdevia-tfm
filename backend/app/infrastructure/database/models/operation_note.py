from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base

class OperationNote(Base):
    __tablename__ = "operation_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    operation_id = Column(UUID(as_uuid=True), ForeignKey("operations.id"), nullable=False, index=True)
    author_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Content
    text = Column(Text, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    operation = relationship("Operation", back_populates="notes")
    author = relationship("User", back_populates="operation_notes")
