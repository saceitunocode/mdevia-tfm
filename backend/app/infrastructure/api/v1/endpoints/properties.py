from typing import Any, List
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from sqlalchemy.orm import Session
from app.infrastructure.api.v1.deps import get_db, CurrentUser
from app.domain.schemas.property_image import PropertyImage as PropertyImageSchema
from app.application.use_cases.property_images import PropertyImageUseCase
from app.infrastructure.storage.deps import get_storage_service
from app.infrastructure.repositories.property_image_repository import PropertyImageRepository
from app.domain.services.storage_service import StorageService

router = APIRouter()

def get_property_image_use_case(
    storage_service: StorageService = Depends(get_storage_service),
    repository: PropertyImageRepository = Depends(PropertyImageRepository)
) -> PropertyImageUseCase:
    return PropertyImageUseCase(storage_service, repository)

@router.post("/{property_id}/images", response_model=PropertyImageSchema)
async def upload_property_image(
    *,
    db: Session = Depends(get_db),
    property_id: uuid.UUID,
    file: UploadFile = File(...),
    caption: str = Form(None),
    alt_text: str = Form(None),
    is_cover: bool = Form(False),
    current_user: CurrentUser,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Upload an image for a property.
    """
    # Verify file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        image = await use_case.upload_image(
            db=db,
            property_id=property_id,
            file=file.file,
            filename=file.filename,
            caption=caption,
            alt_text=alt_text,
            is_cover=is_cover
        )
        return image
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/images/{image_id}")
async def delete_property_image(
    *,
    db: Session = Depends(get_db),
    image_id: uuid.UUID,
    current_user: CurrentUser,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Delete a property image.
    """
    success = await use_case.delete_image(db, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}
