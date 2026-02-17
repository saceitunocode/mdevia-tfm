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
    # Mock StorageService
    mock_storage = MagicMock(spec=StorageService)
    mock_storage.upload = AsyncMock(return_value="test/key.webp")
    mock_storage.get_url = MagicMock(return_value="http://localhost/test/key.webp")
    
    app.dependency_overrides[get_storage_service] = lambda: mock_storage
    
    with TestClient(app) as c:
        yield c
    
    app.dependency_overrides.clear()

@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_property_gallery_flow(client: TestClient, db_session: Session):
    # 1. Setup: Agent, Client, Property
    agent_email = f"agent-gallery-{uuid.uuid4()}@example.com"
    agent = User(
        id=uuid.uuid4(),
        email=agent_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Gallery Tester"
    )
    db_session.add(agent)
    
    test_client = Client(
        id=uuid.uuid4(),
        full_name="Gallery Owner",
        email=f"client-{uuid.uuid4()}@example.com",
        phone="555-0000",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db_session.add(test_client)
    
    prop_id = uuid.uuid4()
    test_property = Property(
        id=prop_id,
        title="Gallery Test Prop",
        address_line1="Test St 1",
        city="Madrid",
        sqm=100,
        rooms=2,
        price_amount=300000,
        owner_client_id=test_client.id,
        captor_agent_id=agent.id,
        is_published=True
    )
    db_session.add(test_property)
    db_session.commit()

    # Auth
    token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload two images
    # We'll mock the storage or just let it run if it's local. 
    # Since we are in integration, let's see if it works with the current setup.
    # We use a dummy file content.
    file1 = {"file": ("img1.jpg", b"fake-image-content-1", "image/jpeg")}
    response1 = client.post(f"/api/v1/properties/{prop_id}/images", files=file1, headers=headers)
    assert response1.status_code == 200
    img1_id = response1.json()["id"]
    assert response1.json()["is_cover"] is True # First image should be cover

    file2 = {"file": ("img2.jpg", b"fake-image-content-2", "image/jpeg")}
    response2 = client.post(f"/api/v1/properties/{prop_id}/images", files=file2, headers=headers)
    assert response2.status_code == 200
    img2_id = response2.json()["id"]
    assert response2.json()["is_cover"] is False
    assert response2.json()["position"] == 1

    # 3. Reorder
    reorder_data = {"image_ids": [str(img2_id), str(img1_id)]}
    reorder_resp = client.patch(f"/api/v1/properties/{prop_id}/images/reorder", json=reorder_data, headers=headers)
    assert reorder_resp.status_code == 200

    # Verify order in DB
    db_session.expire_all()
    imgs = db_session.query(PropertyImage).filter(PropertyImage.property_id == prop_id).order_by(PropertyImage.position).all()
    assert str(imgs[0].id) == str(img2_id)
    assert str(imgs[1].id) == str(img1_id)

    # 4. Set Cover (img2 becomes cover)
    set_main_resp = client.patch(f"/api/v1/properties/{prop_id}/images/{img2_id}/set-main", headers=headers)
    assert set_main_resp.status_code == 200
    
    db_session.expire_all()
    img1 = db_session.get(PropertyImage, uuid.UUID(img1_id))
    img2 = db_session.get(PropertyImage, uuid.UUID(img2_id))
    assert img1.is_cover is False
    assert img2.is_cover is True

    # 5. Delete (need Admin for delete as per our rules)
    # Let's promote our agent to admin for a moment or create an admin
    admin_email = f"admin-gallery-{uuid.uuid4()}@example.com"
    admin = User(
        id=uuid.uuid4(),
        email=admin_email,
        password_hash=security.get_password_hash("admin123"),
        role=UserRole.ADMIN,
        full_name="Gallery Admin"
    )
    db_session.add(admin)
    db_session.commit()
    admin_token = security.create_access_token(subject=admin.email)
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    delete_resp = client.delete(f"/api/v1/properties/images/{img1_id}", headers=admin_headers)
    assert delete_resp.status_code == 200
    
    db_session.expire_all()
    img1_after = db_session.get(PropertyImage, uuid.UUID(img1_id) if isinstance(img1_id, str) else img1_id)
    assert img1_after is None

    # Cleanup
    db_session.query(PropertyImage).filter(PropertyImage.property_id == prop_id).delete()
    db_session.delete(test_property)
    db_session.delete(test_client)
    db_session.delete(agent)
    db_session.delete(admin)
    db_session.commit()
