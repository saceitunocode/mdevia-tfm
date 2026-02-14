from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.domain.schemas.token import TokenPayload
from app.domain.enums import UserRole
from app.infrastructure.database.models.user import User
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.user_repository import UserRepository

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, Exception):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    repo = UserRepository()
    user = repo.get_by_email(db, email=token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def get_current_active_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

def get_current_active_agent(
    current_user: User = Depends(get_current_user),
) -> User:
    # Admin inherits agent permissions
    if current_user.role not in [UserRole.AGENT, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

from app.domain.services.storage_service import StorageService
from app.infrastructure.storage.local_storage import LocalStorageService

def get_storage_service() -> StorageService:
    if settings.STORAGE_TYPE == "cloudinary":
        from app.infrastructure.storage.cloudinary_storage import CloudinaryStorageService
        return CloudinaryStorageService()
    return LocalStorageService()

CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentAdmin = Annotated[User, Depends(get_current_active_admin)]
CurrentAgent = Annotated[User, Depends(get_current_active_agent)]
Storage = Annotated[StorageService, Depends(get_storage_service)]
