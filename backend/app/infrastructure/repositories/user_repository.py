from typing import Optional
from sqlalchemy.orm import Session
from app.infrastructure.database.models.user import User

class UserRepository:
    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()
