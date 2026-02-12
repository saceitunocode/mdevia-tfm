import pytest
import uuid
from unittest.mock import MagicMock, AsyncMock
from sqlalchemy.orm import Session
from app.application.use_cases.property_images import PropertyImageUseCase
from app.infrastructure.repositories.property_image_repository import PropertyImageRepository
from app.domain.services.storage_service import StorageService
from app.infrastructure.database.models.property_image import PropertyImage

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@pytest.fixture
def mock_storage():
    service = MagicMock(spec=StorageService)
    service.upload = AsyncMock(return_value="test/key.webp")
    service.get_url = MagicMock(return_value="http://localhost/test/key.webp")
    return service

@pytest.fixture
def mock_repo():
    return MagicMock(spec=PropertyImageRepository)

@pytest.fixture
def use_case(mock_storage, mock_repo):
    return PropertyImageUseCase(mock_storage, mock_repo)

@pytest.mark.asyncio
async def test_upload_first_image_becomes_cover(use_case, mock_db, mock_repo, mock_storage):
    # Setup
    property_id = uuid.uuid4()
    mock_repo.count_by_property.return_value = 0
    file_mock = MagicMock()
    filename = "test.jpg"
    
    # Execute
    await use_case.upload_image(mock_db, property_id, file_mock, filename)
    
    # Assert
    # Verify count was called
    mock_repo.count_by_property.assert_called_once_with(mock_db, property_id)
    # Verify unset_all_covers was called because count=0 -> is_cover=True
    mock_repo.unset_all_covers.assert_called_once_with(mock_db, property_id)
    # Verify create was called with is_cover=True
    args, _ = mock_repo.create.call_args
    created_image = args[1]
    assert created_image.is_cover is True
    assert created_image.position == 0

@pytest.mark.asyncio
async def test_reorder_images(use_case, mock_db, mock_repo):
    # Setup
    property_id = uuid.uuid4()
    image_ids = [uuid.uuid4(), uuid.uuid4(), uuid.uuid4()]
    
    # Execute
    await use_case.reorder_images(mock_db, property_id, image_ids)
    
    # Assert
    assert mock_repo.update_position.call_count == 3
    mock_repo.update_position.assert_any_call(mock_db, image_ids[0], 0)
    mock_repo.update_position.assert_any_call(mock_db, image_ids[1], 1)
    mock_repo.update_position.assert_any_call(mock_db, image_ids[2], 2)

@pytest.mark.asyncio
async def test_set_cover_image(use_case, mock_db, mock_repo):
    # Setup
    property_id = uuid.uuid4()
    image_id = uuid.uuid4()
    mock_image = PropertyImage(id=image_id, property_id=property_id)
    mock_repo.get_by_id.return_value = mock_image
    
    # Execute
    result = await use_case.set_cover_image(mock_db, property_id, image_id)
    
    # Assert
    assert result is True
    mock_repo.set_as_cover.assert_called_once_with(mock_db, property_id, image_id)

@pytest.mark.asyncio
async def test_set_cover_image_wrong_property(use_case, mock_db, mock_repo):
    # Setup
    property_id = uuid.uuid4()
    wrong_property_id = uuid.uuid4()
    image_id = uuid.uuid4()
    mock_image = PropertyImage(id=image_id, property_id=wrong_property_id)
    mock_repo.get_by_id.return_value = mock_image
    
    # Execute
    result = await use_case.set_cover_image(mock_db, property_id, image_id)
    
    # Assert
    assert result is False
    mock_repo.set_as_cover.assert_not_called()
