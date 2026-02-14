import pytest
import uuid
from io import BytesIO
from unittest.mock import MagicMock
from app.application.use_cases.property_images import PropertyImageUseCase
from app.infrastructure.database.models.property_image import PropertyImage
from app.domain.services.storage_service import StorageService

@pytest.mark.asyncio
async def test_upload_image_logic():
    # Mock Storage
    mock_storage = MagicMock(spec=StorageService)
    mock_storage.upload.return_value = "properties/123/img.webp"
    mock_storage.get_url.return_value = "http://localhost:8000/static/properties/123/img.webp"
    
    # Mock Repository
    mock_repo = MagicMock()
    mock_repo.count_by_property.return_value = 0 # First image
    mock_repo.create.side_effect = lambda db, img: img # Return the input image
    
    use_case = PropertyImageUseCase(mock_storage, mock_repo)
    
    db_session = MagicMock()
    property_id = uuid.uuid4()
    file_content = BytesIO(b"dummy image content")
    
    image = await use_case.upload_image(
        db=db_session,
        property_id=property_id,
        file=file_content,
        filename="test.jpg"
    )
    
    assert image.property_id == property_id
    assert image.is_cover is True # Since count was 0
    assert image.storage_key == "properties/123/img.webp"
    assert "static" in image.public_url
    mock_repo.unset_all_covers.assert_called_once()
    mock_repo.create.assert_called_once()
