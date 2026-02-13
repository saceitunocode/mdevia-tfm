import pytest
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, Operation
from app.domain.enums import ClientType, UserRole, PropertyStatus, OperationType, OperationStatus
from app.infrastructure.repositories.operation_repository import OperationRepository
from app.core.security import get_password_hash

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture(scope="module")
def agent(db: Session):
    agent = User(
        id=uuid.uuid4(),
        email=f"agent-op-unit-{uuid.uuid4()}@test.com",
        password_hash=get_password_hash("test1234"),
        full_name="Op Unit Agent",
        role=UserRole.AGENT
    )
    db.add(agent)
    db.commit()
    yield agent
    db.delete(agent)
    db.commit()

@pytest.fixture(scope="module")
def test_data(db: Session, agent: User):
    client_id = uuid.uuid4()
    client = Client(
        id=client_id,
        full_name="Unit Test Client",
        type=ClientType.BUYER,
        responsible_agent_id=agent.id
    )
    db.add(client)
    
    owner_id = uuid.uuid4()
    owner = Client(
        id=owner_id,
        full_name="Unit Test Owner",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db.add(owner)
    db.commit()

    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="Unit Test Prop",
        address_line1="Test Address 1",
        city="Test City",
        sqm=80,
        rooms=3,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=owner.id,
        captor_agent_id=agent.id
    )
    db.add(prop)
    db.commit()
    
    return {
        "client": client,
        "owner": owner,
        "property": prop,
        "agent_id": agent.id
    }

def test_operation_repository_create_note(db: Session, agent: User, test_data):
    repo = OperationRepository()
    
    # Create operation first
    op = Operation(
        type=OperationType.SALE,
        status=OperationStatus.INTEREST,
        client_id=test_data["client"].id,
        property_id=test_data["property"].id,
        agent_id=agent.id
    )
    db.add(op)
    db.commit()
    db.refresh(op)
    
    # Test create_note
    note_text = "Nota de prueba unitaria de repositorio"
    note = repo.create_note(db, operation_id=op.id, author_id=agent.id, text=note_text)
    
    assert note.id is not None
    assert note.text == note_text
    assert note.operation_id == op.id
    assert note.author_user_id == agent.id
    
    # Test eager loading in get_by_id
    op_refreshed = repo.get_by_id(db, op.id)
    assert len(op_refreshed.notes) > 0
    assert op_refreshed.notes[0].text == note_text
    assert op_refreshed.notes[0].author.full_name == agent.full_name
    
    # Clean up
    db.delete(note)
    db.delete(op)
    db.delete(test_data["property"])
    db.delete(test_data["client"])
    db.delete(test_data["owner"])
    db.commit()
