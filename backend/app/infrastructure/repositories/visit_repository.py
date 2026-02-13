from typing import List, Optional, Union, Dict, Any
import uuid
from sqlalchemy.orm import Session, joinedload
from app.infrastructure.database.models.visit import Visit
from app.infrastructure.database.models.visit_note import VisitNote
from app.domain.schemas.visit import VisitUpdate, VisitNoteCreate

class VisitRepository:
    def create(self, db: Session, visit_obj: Visit) -> Visit:
        db.add(visit_obj)
        db.commit()
        db.refresh(visit_obj)
        return visit_obj

    def get_by_id(self, db: Session, visit_id: uuid.UUID) -> Optional[Visit]:
        return (
            db.query(Visit)
            .options(
                joinedload(Visit.client),
                joinedload(Visit.property),
                joinedload(Visit.agent),
                joinedload(Visit.notes).joinedload(VisitNote.author)
            )
            .filter(Visit.id == visit_id)
            .first()
        )

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        agent_id: Optional[uuid.UUID] = None,
        property_id: Optional[uuid.UUID] = None,
        client_id: Optional[uuid.UUID] = None
    ) -> List[Visit]:
        query = db.query(Visit).options(
            joinedload(Visit.client),
            joinedload(Visit.property),
            joinedload(Visit.agent)
        )
        
        if agent_id:
            query = query.filter(Visit.agent_id == agent_id)
        if property_id:
            query = query.filter(Visit.property_id == property_id)
        if client_id:
            query = query.filter(Visit.client_id == client_id)
            
        return query.order_by(Visit.scheduled_at.desc()).offset(skip).limit(limit).all()

    def update(
        self,
        db: Session,
        *,
        visit_obj: Visit,
        visit_in: Union[VisitUpdate, Dict[str, Any]]
    ) -> Visit:
        if isinstance(visit_in, dict):
            update_data = visit_in
        else:
            update_data = visit_in.model_dump(exclude_unset=True)

        for field in update_data:
            if hasattr(visit_obj, field):
                setattr(visit_obj, field, update_data[field])

        db.add(visit_obj)
        db.commit()
        db.refresh(visit_obj)
        return visit_obj

    def delete(self, db: Session, visit_id: uuid.UUID) -> bool:
        visit = db.query(Visit).filter(Visit.id == visit_id).first()
        if visit:
            db.delete(visit)
            db.commit()
            return True
        return False

    def create_note(self, db: Session, visit_id: uuid.UUID, author_id: uuid.UUID, text: str) -> VisitNote:
        note = VisitNote(
            visit_id=visit_id,
            author_user_id=author_id,
            text=text
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note
