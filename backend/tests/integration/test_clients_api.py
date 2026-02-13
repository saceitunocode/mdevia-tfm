import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client
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

def test_read_clients_api(client: TestClient, db: Session):
    # 1. Create a test agent
    agent = User(
        id=uuid.uuid4(),
        email=f"agent-{uuid.uuid4()}@example.com",
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Client API Test Agent"
    )
    db.add(agent)
    
    # 2. Create a test client
    test_client = Client(
        id=uuid.uuid4(),
        full_name="AAA Real Client Test", # Prefix to ensure it appears at the top (pagination)
        email=f"client-{uuid.uuid4()}@example.com",
        phone="555-5555",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id,
        is_active=True  # Explicitly set active to ensure it appears in list
    )
    db.add(test_client)
    db.commit()

    # 3. Token
    access_token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # 4. GET /api/v1/clients/
    response = client.get("/api/v1/clients/", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(c["full_name"] == "AAA Real Client Test" for c in data)

    # Cleanup
    db.delete(test_client)
    db.delete(agent)
    db.commit()
