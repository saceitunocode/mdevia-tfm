import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property
from app.domain.enums import UserRole, ClientType
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

def test_create_property_api(client: TestClient, db: Session):
    # 1. Create a test agent
    agent_email = f"agent-{uuid.uuid4()}@example.com"
    agent = User(
        id=uuid.uuid4(),
        email=agent_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="API Test Agent"
    )
    db.add(agent)
    
    # 2. Create a test client (owner)
    test_client = Client(
        id=uuid.uuid4(),
        full_name="API Test Client",
        email=f"client-{uuid.uuid4()}@example.com",
        phone="555-5555",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db.add(test_client)
    db.commit()

    # 3. Generate token for agent
    access_token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # 4. POST to /api/v1/properties/
    property_data = {
        "title": "API Test Property",
        "address_line1": "API Street 123",
        "city": "Barcelona",
        "sqm": 85,
        "rooms": 3,
        "owner_client_id": str(test_client.id),
        "price_amount": 250000,
        "public_description": "Property created via API test"
    }

    response = client.post("/api/v1/properties/", json=property_data, headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "API Test Property"
    assert data["captor_agent_id"] == str(agent.id)

    # Cleanup
    db.query(Property).filter(Property.id == data["id"]).delete()
    db.delete(test_client)
    db.delete(agent)
    db.commit()
