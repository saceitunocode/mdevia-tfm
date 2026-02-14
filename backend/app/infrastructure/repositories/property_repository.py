from typing import List, Optional, Union, Dict, Any
from decimal import Decimal
import uuid
from sqlalchemy.orm import Session, joinedload
from app.infrastructure.database.models.property import Property
from app.infrastructure.database.models.property_note import PropertyNote
from app.infrastructure.database.models.property_status_history import PropertyStatusHistory
from app.infrastructure.database.models import Visit, Operation, Client
from app.domain.schemas.property import PropertyUpdate, PropertyNoteCreate
from app.domain.enums import PropertyStatus, PropertyType, OperationType

class PropertyRepository:
    def create(self, db: Session, property_obj: Property) -> Property:
        db.add(property_obj)
        db.commit()
        db.refresh(property_obj)
        return property_obj

    def create_note(
        self, 
        db: Session, 
        property_id: uuid.UUID, 
        note_in: PropertyNoteCreate, 
        author_id: uuid.UUID
    ) -> PropertyNote:
        db_note = PropertyNote(
            text=note_in.text,
            property_id=property_id,
            author_user_id=author_id
        )
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note

    def get_by_id(self, db: Session, property_id: uuid.UUID) -> Optional[Property]:
        return db.query(Property).options(
            joinedload(Property.images),
            joinedload(Property.notes),
            joinedload(Property.owner_client),
            joinedload(Property.visits),
            joinedload(Property.operations),
            joinedload(Property.status_history)
        ).filter(Property.id == property_id, Property.is_active == True).first()

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

    def list_published(
        self,
        db: Session,
        *,
        city: Optional[str] = None,
        price_min: Optional[Decimal] = None,
        price_max: Optional[Decimal] = None,
        sqm_min: Optional[int] = None,
        sqm_max: Optional[int] = None,
        rooms: Optional[int] = None,
        baths: Optional[int] = None,
        property_type: Optional[List[PropertyType]] = None,
        operation_type: Optional[OperationType] = None,
        has_elevator: Optional[bool] = None,
        is_featured: Optional[bool] = None,
        offset: int = 0,
        limit: int = 50,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        query = (
            db.query(Property)
            .options(joinedload(Property.images))
            .filter(
                Property.is_active == True,
                Property.is_published == True,
                Property.status == PropertyStatus.AVAILABLE,
            )
        )

        if city is not None:
            query = query.filter(Property.city.ilike(city))
        if price_min is not None:
            query = query.filter(Property.price_amount >= price_min)
        if price_max is not None:
            query = query.filter(Property.price_amount <= price_max)
        if sqm_min is not None:
            query = query.filter(Property.sqm >= sqm_min)
        if sqm_max is not None:
            query = query.filter(Property.sqm <= sqm_max)
        if rooms is not None:
            query = query.filter(Property.rooms >= rooms) # 1+ logic
        if baths is not None:
            query = query.filter(Property.baths >= baths) # 1+ logic
        if property_type:
            query = query.filter(Property.property_type.in_(property_type))
        if operation_type is not None:
            query = query.filter(Property.operation_type == operation_type)
        if has_elevator is not None:
            query = query.filter(Property.has_elevator == has_elevator)
        if is_featured is not None:
            query = query.filter(Property.is_featured == is_featured)

        total = query.count()

        # Sorting logic
        if sort == "price_asc":
            query = query.order_by(Property.price_amount.asc())
        elif sort == "price_desc":
            query = query.order_by(Property.price_amount.desc())
        else:
            query = query.order_by(Property.created_at.desc())

        items = query.offset(offset).limit(limit).all()
        return {"items": items, "total": total}

    def update(
        self,
        db: Session,
        *,
        property_obj: Property,
        property_in: Union[PropertyUpdate, Dict[str, Any]],
        user_id: uuid.UUID
    ) -> Property:
        obj_data = property_obj.__dict__
        if isinstance(property_in, dict):
            update_data = property_in
        else:
            update_data = property_in.model_dump(exclude_unset=True)
            
        old_status = property_obj.status
        new_status = update_data.get("status")
        old_price = property_obj.price_amount
        new_price = update_data.get("price_amount")
        note = update_data.get("internal_notes") # Use internal_notes or a dedicated 'note' if available

        for field in update_data:
            if field in obj_data:
                setattr(property_obj, field, update_data[field])
                
        # Record history if status or price changed
        if (new_status and new_status != old_status) or (new_price is not None and new_price != old_price):
            history = PropertyStatusHistory(
                property_id=property_obj.id,
                from_status=old_status,
                to_status=new_status or old_status,
                from_price=old_price,
                to_price=new_price if new_price is not None else old_price,
                changed_by_user_id=user_id,
                note=f"Cambio detectado en actualización. {note if note else ''}"
            )
            db.add(history)

        db.add(property_obj)
        db.commit()
        db.refresh(property_obj)
        return property_obj
