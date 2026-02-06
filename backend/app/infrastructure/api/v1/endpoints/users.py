from fastapi import APIRouter
from app.infrastructure.api.v1.deps import CurrentUser

router = APIRouter()

@router.get("/me")
def read_user_me(current_user: CurrentUser):
    """
    Get current logged in user.
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }
