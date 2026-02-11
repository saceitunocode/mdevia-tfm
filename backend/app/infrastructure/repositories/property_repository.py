from typing import List, Optional, Union, Dict, Any
import uuid
from sqlalchemy.orm import Session, joinedload
from app.infrastructure.database.models.property import Property
from app.domain.schemas.property import PropertyUpdate

class PropertyRepository:
    def create(self, db: Session, property_obj: Property) -> Property:
        db.add(property_obj)
        db.commit()
        db.refresh(property_obj)
        return property_obj

    def get_by_id(self, db: Session, property_id: uuid.UUID) -> Optional[Property]:
        return db.query(Property).options(joinedload(Property.images)).filter(Property.id == property_id, Property.is_active == True).first()

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        published_only: bool = False
    ) -> List[Property]:
        query = db.query(Property).options(joinedload(Property.images)).filter(Property.is_active == True)
        if published_only:
            query = query.filter(Property.is_published == True)
        return query.order_by(Property.created_at.desc()).offset(skip).limit(limit).all()

    def update(
        self,
        db: Session,
        *,
        property_obj: Property,
        property_in: Union[PropertyUpdate, Dict[str, Any]]
    ) -> Property:
        obj_data = property_obj.__dict__
        if isinstance(property_in, dict):
            update_data = property_in
        else:
            update_data = property_in.model_dump(exclude_unset=True)
            
        for field in update_data:
            if field in obj_data:
                setattr(property_obj, field, update_data[field])
                
        db.add(property_obj)
        db.commit()
        db.refresh(property_obj)
        return property_obj
