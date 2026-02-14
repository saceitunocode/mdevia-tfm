from typing import List, Optional, Union, Dict, Any
import uuid
from sqlalchemy.orm import Session, joinedload
from app.infrastructure.database.models.operation import Operation
from app.infrastructure.database.models.operation_status_history import OperationStatusHistory
from app.infrastructure.database.models.operation_note import OperationNote
from app.infrastructure.database.models.visit import Visit
from app.domain.schemas.operation import OperationUpdate
from app.domain.enums import OperationStatus

class OperationRepository:
    def create(self, db: Session, operation_obj: Operation) -> Operation:
        db.add(operation_obj)
        db.commit()
        db.refresh(operation_obj)
        return operation_obj

    def get_by_id(self, db: Session, operation_id: uuid.UUID) -> Optional[Operation]:
        return (
            db.query(Operation)
            .options(
                joinedload(Operation.client),
                joinedload(Operation.property),
                joinedload(Operation.agent),
                joinedload(Operation.status_history),
                joinedload(Operation.notes).joinedload(OperationNote.author),
                joinedload(Operation.visits).joinedload(Visit.notes)
            )
            .filter(Operation.id == operation_id, Operation.is_active == True)
            .first()
        )

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Operation]:
        return (
            db.query(Operation)
            .options(
                joinedload(Operation.client),
                joinedload(Operation.property),
                joinedload(Operation.agent)
            )
            .filter(Operation.is_active == True)
            .order_by(Operation.created_at.desc())
            .offset(skip).limit(limit).all()
        )

    def update(
        self,
        db: Session,
        *,
        operation_obj: Operation,
        operation_in: Union[OperationUpdate, Dict[str, Any]],
        user_id: uuid.UUID
    ) -> Operation:
        obj_data = operation_obj.__dict__
        if isinstance(operation_in, dict):
            update_data = operation_in
        else:
            update_data = operation_in.model_dump(exclude_unset=True)
            
        old_status = operation_obj.status
        new_status = update_data.get("status")
        note = update_data.get("note")

        for field in update_data:
            if field in obj_data and field != "note":
                setattr(operation_obj, field, update_data[field])

        # If status changed, record history
        if new_status and new_status != old_status:
            history = OperationStatusHistory(
                operation_id=operation_obj.id,
                from_status=old_status,
                to_status=new_status,
                changed_by_user_id=user_id,
                note=note
            )
            db.add(history)

        db.add(operation_obj)
        db.commit()
        db.refresh(operation_obj)
        return operation_obj

    def soft_delete(self, db: Session, operation_id: uuid.UUID) -> bool:
        operation = db.query(Operation).filter(Operation.id == operation_id).first()
        if operation:
            operation.is_active = False
            db.commit()
            return True
        return False

    def create_note(self, db: Session, operation_id: uuid.UUID, author_id: uuid.UUID, text: str) -> OperationNote:
        note = OperationNote(
            operation_id=operation_id,
            author_user_id=author_id,
            text=text
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note
