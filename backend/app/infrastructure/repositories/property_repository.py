from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.models.property import Property

class PropertyRepository:
    def create(self, db: Session, property_obj: Property) -> Property:
        db.add(property_obj)
        db.commit()
        db.refresh(property_obj)
        return property_obj

    def get_by_id(self, db: Session, property_id: uuid.UUID) -> Optional[Property]:
        return db.query(Property).filter(Property.id == property_id, Property.is_active == True).first()

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        published_only: bool = False
    ) -> List[Property]:
        query = db.query(Property).filter(Property.is_active == True)
        if published_only:
            query = query.filter(Property.is_published == True)
        return query.order_by(Property.created_at.desc()).offset(skip).limit(limit).all()
