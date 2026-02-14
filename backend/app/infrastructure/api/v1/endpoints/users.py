from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from app.infrastructure.api.v1.deps import CurrentUser, CurrentAdmin, get_db
from app.domain.schemas.user import User, UserCreate, UserUpdate
from app.infrastructure.repositories.user_repository import UserRepository
from app.core import security
from app.domain.enums import UserRole

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current logged in user.
    """
    return current_user

@router.get("/", response_model=list[User])
def read_users(
    current_admin: CurrentAdmin,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve users (Admin only).
    """
    repo = UserRepository()
    users = repo.list_all(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(
    *,
    user_in: UserCreate,
    current_admin: CurrentAdmin,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new agent (Admin only).
    """
    repo = UserRepository()
    user = repo.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The user with this email already exists in the system.",
        )
    
    # Hash password and force role to AGENT
    user_obj = repo.create(
        db, 
        obj_in={
            "email": user_in.email,
            "full_name": user_in.full_name,
            "password_hash": security.get_password_hash(user_in.password),
            "role": UserRole.AGENT,
            "is_active": user_in.is_active
        }
    )
    return user_obj

@router.get("/{user_id}", response_model=User)
def read_user_by_id(
    user_id: uuid.UUID,
    current_admin: CurrentAdmin,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get a specific user by ID (Admin only).
    """
    repo = UserRepository()
    user = repo.get_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user

@router.patch("/{user_id}", response_model=User)
def update_user(
    *,
    user_id: uuid.UUID,
    user_in: UserUpdate,
    current_admin: CurrentAdmin,
    db: Session = Depends(get_db)
) -> Any:
    """
    Update a user (Admin only).
    """
    repo = UserRepository()
    user = repo.get_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    user = repo.update(db, db_obj=user, obj_in=user_in)
    return user
