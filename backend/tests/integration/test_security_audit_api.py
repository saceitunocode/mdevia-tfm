import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, PropertyImage
from app.domain.enums import UserRole, ClientType, PropertyStatus
from app.core import security

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_public_endpoints_unauthenticated(client: TestClient, db: Session):
    # Setup: Create a published property
    agent = User(
        id=uuid.uuid4(),
        email=f"security-agent-{uuid.uuid4()}@example.com",
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Security Agent"
    )
    db.add(agent)
    
    test_client = Client(
        id=uuid.uuid4(),
        full_name="Security Client",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db.add(test_client)
    
    test_prop = Property(
        id=uuid.uuid4(),
        title="Public Property Security Test",
        address_line1="Secret Address 1",
        city="Secret City",
        sqm=100,
        rooms=4,
        owner_client_id=test_client.id,
        captor_agent_id=agent.id,
        is_published=True,
        status=PropertyStatus.AVAILABLE,
        internal_notes="THIS SHOULD BE HIDDEN"
    )
    db.add(test_prop)
    
    test_image = PropertyImage(
        id=uuid.uuid4(),
        property_id=test_prop.id,
        storage_key="internal/path/to/image.jpg",
        public_url="http://example.com/image.jpg",
        is_active=True
    )
    db.add(test_image)
    db.commit()

    # 1. Test public list
    response = client.get("/api/v1/properties/public")
    assert response.status_code == 200
    data = response.json()
    assert any(p["id"] == str(test_prop.id) for p in data)
    
    # 2. Test data filtering (No sensitive data in list)
    prop_in_list = next(p for p in data if p["id"] == str(test_prop.id))
    assert "address_line1" not in prop_in_list
    assert "internal_notes" not in prop_in_list
    assert "owner_client_id" not in prop_in_list
    
    # 3. Test public detail
    response = client.get(f"/api/v1/properties/public/{test_prop.id}")
    assert response.status_code == 200
    detail = response.json()
    assert detail["title"] == "Public Property Security Test"
    assert "address_line1" not in detail
    assert "internal_notes" not in detail
    assert "owner_client_id" not in detail
    
    # 4. Filter image sensitive data
    assert len(detail["images"]) > 0
    img = detail["images"][0]
    assert "public_url" in img
    assert "storage_key" not in img  # This is what we just fixed!

    # 5. Verify standard endpoint is BLOCKED without auth
    response = client.get(f"/api/v1/properties/{test_prop.id}")
    assert response.status_code == 401  # Not authenticated

    # Cleanup
    db.delete(test_image)
    db.delete(test_prop)
    db.delete(test_client)
    db.delete(agent)
    db.commit()

def test_clients_endpoint_blocked_unauthenticated(client: TestClient):
    response = client.get("/api/v1/clients/")
    assert response.status_code == 401
