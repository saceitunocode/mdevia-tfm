from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.models.client import Client

class ClientRepository:
    def create(self, db: Session, client_obj: Client) -> Client:
        db.add(client_obj)
        db.commit()
        db.refresh(client_obj)
        return client_obj

    def get_by_id(self, db: Session, client_id: uuid.UUID) -> Optional[Client]:
        return db.query(Client).filter(Client.id == client_id, Client.is_active == True).first()

    def list_all(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Client]:
        return db.query(Client).filter(Client.is_active == True).order_by(Client.full_name).offset(skip).limit(limit).all()
