from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.infrastructure.database.base import Base

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False, index=True)
    
    # Image details & Metadata
    storage_key = Column(String, nullable=False) # Internal key for object storage (S3/MinIO)
    public_url = Column(String, nullable=True) # Public URL (CDN/Signed)
    caption = Column(String, nullable=True) # Pie de foto
    alt_text = Column(String, nullable=True) # Accessibility / SEO

    position = Column(Integer, default=0, nullable=False) # Ordering in gallery
    is_cover = Column(Boolean, default=False, nullable=False) # Main image flag
    is_active = Column(Boolean, default=True, nullable=False) # Soft delete

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    property = relationship("Property", back_populates="images")
