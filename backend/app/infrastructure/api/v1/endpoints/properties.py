from typing import Any, List, Optional
from decimal import Decimal
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form, Query
from sqlalchemy.orm import Session
from app.infrastructure.api.v1.deps import get_db, CurrentUser, CurrentAdmin, CurrentAgent, get_storage_service
from app.domain.schemas.property_image import PropertyImage as PropertyImageSchema, ReorderImages
from app.domain.schemas.property import Property, PropertyCreate, PropertyUpdate, PropertyPublic, PropertyNote, PropertyNoteCreate, PropertyPublicList
from app.application.use_cases.property_images import PropertyImageUseCase
from app.infrastructure.repositories.property_image_repository import PropertyImageRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.infrastructure.database.models.property import Property as PropertyModel
from app.domain.services.storage_service import StorageService
from app.domain.enums import PropertyStatus, PropertyType, OperationType

router = APIRouter()

def get_property_repository(db: Session = Depends(get_db)) -> PropertyRepository:
    return PropertyRepository()

def get_property_image_use_case(
    storage_service: StorageService = Depends(get_storage_service),
    repository: PropertyImageRepository = Depends(PropertyImageRepository)
) -> PropertyImageUseCase:
    return PropertyImageUseCase(storage_service, repository)


# ─────────────────────────────────────────────────────────────
# PUBLIC SHOWCASE ENDPOINT (No auth required)
# ─────────────────────────────────────────────────────────────

@router.get("/public", response_model=PropertyPublicList)
def list_public_properties(
    city: Optional[str] = Query(None, description="Filter by city (case-insensitive)"),
    price_min: Optional[Decimal] = Query(None, ge=0, description="Minimum price"),
    price_max: Optional[Decimal] = Query(None, ge=0, description="Maximum price"),
    sqm_min: Optional[int] = Query(None, ge=0, description="Minimum square meters"),
    sqm_max: Optional[int] = Query(None, ge=0, description="Maximum square meters"),
    rooms: Optional[int] = Query(None, ge=1, description="Minimum number of rooms (1+)"),
    baths: Optional[int] = Query(None, ge=1, description="Minimum number of baths (1+)"),
    property_type: Optional[List[PropertyType]] = Query(None, description="Type of property"),
    operation_type: Optional[OperationType] = Query(None, description="Type of operation (SALE/RENT)"),
    has_elevator: Optional[bool] = Query(None, description="Filter by elevator presence"),
    is_featured: Optional[bool] = Query(None, description="Filter by featured status"),
    sort: Optional[str] = Query(None, description="Sorting field: price_asc, price_desc, newest"),
    limit: int = Query(50, ge=1, le=100, description="Max results per page"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: Session = Depends(get_db),
    repo: PropertyRepository = Depends(get_property_repository),
) -> Any:
    """
    Public showcase: list available properties with optional filters.
    No authentication required.
    """
    return repo.list_published(
        db=db,
        city=city,
        price_min=price_min,
        price_max=price_max,
        sqm_min=sqm_min,
        sqm_max=sqm_max,
        rooms=rooms,
        baths=baths,
        property_type=property_type,
        operation_type=operation_type,
        has_elevator=has_elevator,
        is_featured=is_featured,
        offset=offset,
        limit=limit,
        sort=sort,
    )

@router.get("/public/{id}", response_model=PropertyPublic)
def get_public_property(
    *,
    db: Session = Depends(get_db),
    id: uuid.UUID,
    repo: PropertyRepository = Depends(get_property_repository),
) -> Any:
    """
    Get public property details by ID.
    No authentication required.
    Only returns if is_published=True and status=AVAILABLE.
    """
    property = repo.get_by_id(db=db, property_id=id)
    if not property or not property.is_published or property.status != PropertyStatus.AVAILABLE:
        raise HTTPException(status_code=404, detail="Property not found or not available")
    return property


# ─────────────────────────────────────────────────────────────
# AUTHENTICATED BACKOFFICE ENDPOINTS
# ─────────────────────────────────────────────────────────────

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
    # Create the property object with the captor agent assigned to current user
    property_obj = PropertyModel(
        **property_in.model_dump(),
        captor_agent_id=current_user.id
    )
    
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

@router.put("/{id}", response_model=Property)
def update_property(
    *,
    db: Session = Depends(get_db),
    id: uuid.UUID,
    property_in: PropertyUpdate,
    repo: PropertyRepository = Depends(get_property_repository),
    current_user: CurrentUser
) -> Any:
    """
    Update a property.
    """
    property = repo.get_by_id(db=db, property_id=id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
        
    property = repo.update(db=db, property_obj=property, property_in=property_in, user_id=current_user.id)
    return property

@router.post("/{id}/notes", response_model=PropertyNote)
def create_property_note(
    *,
    db: Session = Depends(get_db),
    id: uuid.UUID,
    note_in: PropertyNoteCreate,
    current_user: CurrentUser,
    repo: PropertyRepository = Depends(get_property_repository)
) -> Any:
    """
    Add a note to a property.
    """
    property = repo.get_by_id(db=db, property_id=id)
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    note = repo.create_note(db=db, property_id=id, note_in=note_in, author_id=current_user.id)
    return note

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
    current_agent: CurrentAgent,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Delete a property image.
    """
    success = await use_case.delete_image(db, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted successfully"}

@router.patch("/{property_id}/images/reorder")
async def reorder_property_images(
    *,
    db: Session = Depends(get_db),
    property_id: uuid.UUID,
    reorder_in: ReorderImages,
    current_user: CurrentUser,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Reorder property images.
    """
    await use_case.reorder_images(db, property_id, reorder_in.image_ids)
    return {"message": "Images reordered successfully"}

@router.patch("/{property_id}/images/{image_id}/set-main")
async def set_property_main_image(
    *,
    db: Session = Depends(get_db),
    property_id: uuid.UUID,
    image_id: uuid.UUID,
    current_user: CurrentUser,
    use_case: PropertyImageUseCase = Depends(get_property_image_use_case)
) -> Any:
    """
    Set an image as the main cover for a property.
    """
    success = await use_case.set_cover_image(db, property_id, image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found or doesn't belong to property")
    return {"message": "Main image updated successfully"}
