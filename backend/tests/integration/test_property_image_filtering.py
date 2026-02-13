import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, PropertyImage
from app.domain.enums import UserRole, ClientType
from app.core import security
from app.infrastructure.api.v1.deps import get_storage_service
from app.domain.services.storage_service import StorageService
from unittest.mock import MagicMock, AsyncMock

@pytest.fixture(scope="module")
def client():
    mock_storage = MagicMock(spec=StorageService)
    mock_storage.upload = AsyncMock(return_value="test/key.webp")
    mock_storage.get_url = MagicMock(return_value="http://localhost/test/key.webp")
    app.dependency_overrides[get_storage_service] = lambda: mock_storage
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_deleted_images_are_excluded_from_property(client: TestClient, db: Session):
    # Setup
    agent = User(id=uuid.uuid4(), email=f"agent-{uuid.uuid4()}@example.com", 
                 password_hash=security.get_password_hash("pass"), role=UserRole.ADMIN, full_name="Tester")
    db.add(agent)
    test_client = Client(id=uuid.uuid4(), full_name="Owner", type=ClientType.OWNER, responsible_agent_id=agent.id)
    db.add(test_client)
    prop = Property(id=uuid.uuid4(), title="Test Prop", address_line1="St 1", city="City", sqm=10, rooms=1, 
                    owner_client_id=test_client.id, captor_agent_id=agent.id)
    db.add(prop)
    db.commit()

    token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {token}"}

    # Upload two images
    client.post(f"/api/v1/properties/{prop.id}/images", files={"file": ("1.jpg", b"1", "image/jpeg")}, headers=headers)
    client.post(f"/api/v1/properties/{prop.id}/images", files={"file": ("2.jpg", b"2", "image/jpeg")}, headers=headers)
    
    db.refresh(prop)
    assert len(prop.images) == 2

    img_id_to_delete = prop.images[0].id

    # Delete one image
    resp = client.delete(f"/api/v1/properties/images/{img_id_to_delete}", headers=headers)
    assert resp.status_code == 200

    # Fetch property again via API
    resp = client.get(f"/api/v1/properties/{prop.id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    
    # CRITICAL CHECK: Should only have 1 image
    assert len(data["images"]) == 1
    assert data["images"][0]["id"] != str(img_id_to_delete)

    # Cleanup - delete images directly to avoid cascade filter warning
    db.query(PropertyImage).filter(PropertyImage.property_id == prop.id).delete(synchronize_session="fetch")
    db.commit()
    db.expire_all()
    db.delete(prop)
    db.delete(test_client)
    db.delete(agent)
    db.commit()
