from typing import Any, List
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form
from sqlalchemy.orm import Session
from app.infrastructure.api.v1.deps import get_db, CurrentUser, CurrentAdmin, get_storage_service
from app.domain.schemas.property_image import PropertyImage as PropertyImageSchema
from app.domain.schemas.property import Property, PropertyCreate, PropertyUpdate
from app.application.use_cases.property_images import PropertyImageUseCase
from app.infrastructure.repositories.property_image_repository import PropertyImageRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.domain.services.storage_service import StorageService

router = APIRouter()

def get_property_repository(db: Session = Depends(get_db)) -> PropertyRepository:
    return PropertyRepository()

def get_property_image_use_case(
    storage_service: StorageService = Depends(get_storage_service),
    repository: PropertyImageRepository = Depends(PropertyImageRepository)
) -> PropertyImageUseCase:
    return PropertyImageUseCase(storage_service, repository)

@router.get("/", response_model=List[Property])
def read_properties(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    repo: PropertyRepository = Depends(get_property_repository),
    current_user: CurrentUser = CurrentUser
) -> Any:
    """
    Retrieve properties.
    """
    properties = repo.list_all(db=db, skip=skip, limit=limit)
    return properties

@router.post("/", response_model=Property)
def create_property(
    *,
    db: Session = Depends(get_db),
    property_in: PropertyCreate,
    repo: PropertyRepository = Depends(get_property_repository),
    current_user: CurrentUser
) -> Any:
    """
    Create new property.
    """
    from app.infrastructure.database.models.property import Property as PropertyModel
    
    # Check if user is agent or admin to assign responsible
    # For now we just create the object
    property_data = property_in.model_dump()
    property_obj = PropertyModel(**property_data)
    
    if hasattr(current_user, 'id'):
         property_obj.captor_agent_id = current_user.id
         
    property = repo.create(db=db, property_obj=property_obj)
    return property

@router.get("/{id}", response_model=Property)
def read_property(
    *,
    db: Session = Depends(get_db),
    id: uuid.UUID,
    repo: PropertyRepository = Depends(get_property_repository),
    current_user: CurrentUser
) -> Any:
    """
    Get property by ID.
    """
    property = repo.get_by_id(db=db, property_id=id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

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
    current_admin: CurrentAdmin,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Delete a property image.
    """
    success = await use_case.delete_image(db, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}
