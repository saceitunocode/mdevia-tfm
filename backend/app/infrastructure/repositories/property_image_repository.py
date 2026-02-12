from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.models.property_image import PropertyImage

class PropertyImageRepository:
    def create(self, db: Session, image: PropertyImage) -> PropertyImage:
        db.add(image)
        db.commit()
        db.refresh(image)
        return image

    def get_by_id(self, db: Session, image_id: uuid.UUID) -> Optional[PropertyImage]:
        return db.query(PropertyImage).filter(PropertyImage.id == image_id).first()

    def get_by_property_id(self, db: Session, property_id: uuid.UUID) -> List[PropertyImage]:
        return db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_active == True
        ).order_by(PropertyImage.position).all()

    def unset_all_covers(self, db: Session, property_id: uuid.UUID):
        db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_cover == True
        ).update({"is_cover": False})
        db.commit()

    def count_by_property(self, db: Session, property_id: uuid.UUID) -> int:
        return db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_active == True
        ).count()

    def delete(self, db: Session, image: PropertyImage):
        image.is_active = False
        db.commit()

    def set_as_cover(self, db: Session, property_id: uuid.UUID, image_id: uuid.UUID):
        # 1. Unset all current covers for this property
        db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_cover == True
        ).update({"is_cover": False})
        
        # 2. Set the selected one as cover
        db.query(PropertyImage).filter(
            PropertyImage.id == image_id
        ).update({"is_cover": True})
        
        db.commit()

    def update_position(self, db: Session, image_id: uuid.UUID, position: int):
        db.query(PropertyImage).filter(PropertyImage.id == image_id).update({"position": position})
        db.commit()
