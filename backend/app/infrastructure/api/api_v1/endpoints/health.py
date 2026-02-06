from typing import Any
from fastapi import APIRouter

router = APIRouter()

@router.get("/health", response_model=dict[str, str])
def health_check() -> Any:
    """
    Check if the API is up and running.
    """
    return {"status": "healthy", "architecture": "hexagonal"}
