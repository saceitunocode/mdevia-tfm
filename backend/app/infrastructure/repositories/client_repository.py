from typing import List, Optional, Union, Dict, Any
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.models.client import Client
from app.infrastructure.database.models.client_note import ClientNote
from app.domain.schemas.client import ClientUpdate, ClientNoteCreate

class ClientRepository:
    def create(self, db: Session, client_obj: Client) -> Client:
        db.add(client_obj)
        db.commit()
        db.refresh(client_obj)
        return client_obj

    def create_note(self, db: Session, note_in: ClientNoteCreate, client_id: uuid.UUID, author_id: uuid.UUID) -> ClientNote:
        db_note = ClientNote(
            text=note_in.text,
            client_id=client_id,
            author_user_id=author_id
        )
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note

    def get_by_id(self, db: Session, client_id: uuid.UUID) -> Optional[Client]:
        return db.query(Client).filter(Client.id == client_id, Client.is_active == True).first()

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Client]:
        return db.query(Client).filter(Client.is_active == True).order_by(Client.full_name).offset(skip).limit(limit).all()

    def update(
        self,
        db: Session,
        *,
        client_obj: Client,
        client_in: Union[ClientUpdate, Dict[str, Any]]
    ) -> Client:
        obj_data = client_obj.__dict__
        if isinstance(client_in, dict):
            update_data = client_in
        else:
            update_data = client_in.model_dump(exclude_unset=True)
            
        for field in update_data:
            if field in obj_data:
                setattr(client_obj, field, update_data[field])
                
        db.add(client_obj)
        db.commit()
        db.refresh(client_obj)
        return client_obj

    def delete(self, db: Session, *, client_id: uuid.UUID) -> Optional[Client]:
        obj = db.get(Client, client_id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj
