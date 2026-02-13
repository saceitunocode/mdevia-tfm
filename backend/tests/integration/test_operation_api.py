import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import uuid
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.user import User
from app.infrastructure.database.models.client import Client
from app.infrastructure.database.models.property import Property
from app.infrastructure.database.models.operation import Operation
from app.domain.enums import UserRole, ClientType, PropertyStatus, OperationType, OperationStatus
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings

client = TestClient(app)

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture(scope="module")
def test_agent(db: Session):
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email=f"agent-api-{user_id}@test.com",
        password_hash=get_password_hash("password"),
        full_name="Test Agent API",
        role=UserRole.AGENT,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="module")
def agent_token(test_agent):
    return create_access_token(subject=test_agent.email)

@pytest.fixture(scope="module")
def test_data(db: Session, test_agent):
    # Client
    client_id = uuid.uuid4()
    test_client = Client(
        id=client_id,
        full_name="API Test Client",
        type=ClientType.BUYER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_client)
    
    # Owner
    owner_id = uuid.uuid4()
    test_owner = Client(
        id=owner_id,
        full_name="API Test Owner",
        type=ClientType.OWNER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_owner)
    db.commit()

    # Property
    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="API Test Property",
        city="Test City",
        address_line1="Test Street",
        sqm=100,
        rooms=2,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=test_owner.id,
        captor_agent_id=test_agent.id
    )
    db.add(prop)
    db.commit()
    db.refresh(prop)
    
    return {"client_id": test_client.id, "property_id": prop.id, "agent_id": test_agent.id}

def test_create_and_update_operation_flow(db: Session, test_data, agent_token):
    headers = {"Authorization": f"Bearer {agent_token}"}
    
    # 1. Create Operation
    op_in = {
        "type": "SALE",
        "status": "INTEREST",
        "client_id": str(test_data["client_id"]),
        "property_id": str(test_data["property_id"]),
        "agent_id": str(test_data["agent_id"]),
        "note": "Initial interest via API"
    }
    
    response = client.post(f"{settings.API_V1_STR}/operations/", json=op_in, headers=headers)
    assert response.status_code == 201
    op_data = response.json()
    assert op_data["status"] == "INTEREST"
    op_id = op_data["id"]

    # 2. Update Status to NEGOTIATION
    update_in = {
        "status": "NEGOTIATION",
        "note": "Negotiation started"
    }
    response = client.patch(f"{settings.API_V1_STR}/operations/{op_id}", json=update_in, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "NEGOTIATION"

    # 3. Close Operation (Critical Logic Check)
    close_in = {
        "status": "CLOSED",
        "note": "Sale closed!"
    }
    response = client.patch(f"{settings.API_V1_STR}/operations/{op_id}", json=close_in, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "CLOSED"

    # 4. Verify Property Status updated automatically
    db.expire_all()
    prop = db.query(Property).filter(Property.id == test_data["property_id"]).first()
    assert prop.status == PropertyStatus.SOLD

    # Clean up (optional for module scope but good practice)
    # Actually, better keep it for other tests if they share fixtures, but let's delete
    op = db.query(Operation).filter(Operation.id == op_id).first()
    db.delete(op)
    prop = db.query(Property).filter(Property.id == test_data["property_id"]).first()
    db.delete(prop)
    db.commit()
