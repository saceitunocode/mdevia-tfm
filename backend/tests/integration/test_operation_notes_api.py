import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import uuid
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, Operation, OperationNote
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
        email=f"agent-notes-api-{user_id}@test.com",
        password_hash=get_password_hash("password"),
        full_name="Test Agent Notes",
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
    test_client = Client(
        id=uuid.uuid4(),
        full_name="API Notes Client",
        type=ClientType.BUYER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_client)
    
    # Owner
    test_owner = Client(
        id=uuid.uuid4(),
        full_name="API Notes Owner",
        type=ClientType.OWNER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_owner)
    db.commit()

    # Property
    prop = Property(
        id=uuid.uuid4(),
        title="API Notes Property",
        address_line1="API Street 123",
        city="Notes City",
        sqm=120,
        rooms=4,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=test_owner.id,
        captor_agent_id=test_agent.id
    )
    db.add(prop)
    db.commit()
    db.refresh(prop)
    
    return {"client_id": test_client.id, "property_id": prop.id, "agent_id": test_agent.id}

def test_operation_notes_api_flow(db: Session, test_data, agent_token, test_agent):
    headers = {"Authorization": f"Bearer {agent_token}"}
    
    # 1. Create Operation
    op_in = {
        "type": "SALE",
        "status": "INTEREST",
        "client_id": str(test_data["client_id"]),
        "property_id": str(test_data["property_id"]),
        "agent_id": str(test_data["agent_id"]),
        "note": "Initial note"
    }
    
    response = client.post(f"{settings.API_V1_STR}/operations/", json=op_in, headers=headers)
    assert response.status_code == 201
    op_data = response.json()
    op_id = op_data["id"]

    # Verify initial note was created
    assert len(op_data["notes"]) == 1
    assert op_data["notes"][0]["text"] == "Initial note"
    assert op_data["notes"][0]["author"]["full_name"] == test_agent.full_name

    # 2. Add a new manual note via API
    note_in = {"text": "Segunda nota añadida manualmente"}
    response = client.post(f"{settings.API_V1_STR}/operations/{op_id}/notes", json=note_in, headers=headers)
    assert response.status_code == 200
    note_data = response.json()
    assert note_data["text"] == "Segunda nota añadida manualmente"
    
    # 3. Get operation and verify notes are included
    response = client.get(f"{settings.API_V1_STR}/operations/{op_id}", headers=headers)
    assert response.status_code == 200
    full_op_data = response.json()
    assert len(full_op_data["notes"]) == 2
    # Notes are ordered by creation date (ASC in DB usually)
    texts = [n["text"] for n in full_op_data["notes"]]
    assert "Initial note" in texts
    assert "Segunda nota añadida manualmente" in texts

    # Clean up
    op = db.query(Operation).filter(Operation.id == op_id).first()
    db.delete(op)
    db.commit()
