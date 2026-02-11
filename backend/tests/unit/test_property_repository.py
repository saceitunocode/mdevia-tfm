import pytest
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property
from app.domain.enums import ClientType, PropertyStatus, UserRole
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.core.security import get_password_hash

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_property_repository_create(db: Session):
    # Setup dependencies
    agent = User(
        id=uuid.uuid4(),
        email=f"agent-{uuid.uuid4()}@test.com",
        password_hash=get_password_hash("test1234"),
        full_name="Agent Test",
        role=UserRole.AGENT
    )
    db.add(agent)
    
    client = Client(
        id=uuid.uuid4(),
        full_name="Client Test",
        email=f"client-{uuid.uuid4()}@test.com",
        phone="555-0000",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db.add(client)
    db.commit()

    repo = PropertyRepository()
    prop_model = Property(
        title="Luxury Villa",
        address_line1="Main Street 1",
        city="Madrid",
        sqm=200,
        rooms=5,
        owner_client_id=client.id,
        captor_agent_id=agent.id,
        price_amount=500000
    )
    
    created_prop = repo.create(db, prop_model)
    
    assert created_prop.id is not None
    assert created_prop.title == "Luxury Villa"
    assert created_prop.price_amount == 500000
    
    # Clean up
    db.delete(created_prop)
    db.delete(client)
    db.delete(agent)
    db.commit()

def test_property_repository_list(db: Session):
    repo = PropertyRepository()
    # Assuming there are some properties from seeds or previous tests
    # If not, this will just return an empty list or whatever is in the DB
    properties = repo.list_all(db, limit=5)
    assert isinstance(properties, list)

def test_property_repository_update_status(db: Session):
    # Setup
    agent = User(
        id=uuid.uuid4(),
        email=f"agent-update-{uuid.uuid4()}@test.com",
        password_hash=get_password_hash("test1234"),
        full_name="Agent Update Test",
        role=UserRole.AGENT
    )
    db.add(agent)
    
    client = Client(
        id=uuid.uuid4(),
        full_name="Client Update Test",
        email=f"client-update-{uuid.uuid4()}@test.com",
        phone="555-0000",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    db.add(client)
    db.commit()

    repo = PropertyRepository()
    prop_model = Property(
        title="Initial Title",
        address_line1="Test St",
        city="Test City",
        sqm=100,
        rooms=2,
        owner_client_id=client.id,
        captor_agent_id=agent.id,
        price_amount=100000,
        status=PropertyStatus.AVAILABLE,
        is_published=True
    )
    created_prop = repo.create(db, prop_model)

    # Test Update
    update_data = {
        "status": PropertyStatus.SOLD,
        "is_published": False,
        "title": "Sold Title"
    }
    updated_prop = repo.update(db, property_obj=created_prop, property_in=update_data)

    assert updated_prop.status == PropertyStatus.SOLD
    assert updated_prop.is_published is False
    assert updated_prop.title == "Sold Title"
    
    # Verify in DB
    db.refresh(updated_prop)
    assert updated_prop.status == PropertyStatus.SOLD

    # Cleanup
    db.delete(updated_prop)
    db.delete(client)
    db.delete(agent)
    db.commit()
