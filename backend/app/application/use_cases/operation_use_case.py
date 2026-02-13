import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.models.operation import Operation
from app.infrastructure.database.models.operation_note import OperationNote
from app.infrastructure.repositories.operation_repository import OperationRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.domain.schemas.operation import OperationCreate, OperationUpdate
from app.domain.enums import OperationStatus, PropertyStatus, OperationType

class OperationUseCase:
    def __init__(
        self, 
        operation_repo: OperationRepository,
        property_repo: PropertyRepository
    ):
        self.operation_repo = operation_repo
        self.property_repo = property_repo

    def create_operation(self, db: Session, operation_in: OperationCreate) -> Operation:
        operation = Operation(
            type=operation_in.type,
            status=operation_in.status,
            client_id=operation_in.client_id,
            property_id=operation_in.property_id,
            agent_id=operation_in.agent_id
        )
        db.add(operation)
        db.flush() # To get ID

        if operation_in.note:
            note = OperationNote(
                operation_id=operation.id,
                author_user_id=operation_in.agent_id,
                text=operation_in.note
            )
            db.add(note)
        
        db.commit()
        db.refresh(operation)
        return operation

    def update_operation_status(
        self, 
        db: Session, 
        operation_id: uuid.UUID, 
        operation_in: OperationUpdate,
        user_id: uuid.UUID
    ) -> Operation:
        operation = self.operation_repo.get_by_id(db, operation_id)
        if not operation:
            return None
        
        # Update operation
        updated_op = self.operation_repo.update(
            db, 
            operation_obj=operation, 
            operation_in=operation_in,
            user_id=user_id
        )

        # Logic: If CLOSED, update property status
        if updated_op.status == OperationStatus.CLOSED:
            property_obj = self.property_repo.get_by_id(db, updated_op.property_id)
            if property_obj:
                new_prop_status = PropertyStatus.SOLD if updated_op.type == OperationType.SALE else PropertyStatus.RENTED
                self.property_repo.update(
                    db, 
                    property_obj=property_obj, 
                    property_in={"status": new_prop_status},
                    user_id=user_id
                )

        return updated_op

    def list_operations(self, db: Session, skip: int = 0, limit: int = 100):
        return self.operation_repo.list_all(db, skip=skip, limit=limit)

    def get_operation(self, db: Session, operation_id: uuid.UUID):
        return self.operation_repo.get_by_id(db, operation_id)

    def add_note(self, db: Session, operation_id: uuid.UUID, text: str, user_id: uuid.UUID) -> OperationNote:
        return self.operation_repo.create_note(db, operation_id=operation_id, author_id=user_id, text=text)
