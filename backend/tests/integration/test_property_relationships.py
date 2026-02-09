import pytest
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, PropertyImage
from app.domain.enums import ClientType, PropertyStatus, UserRole
from app.core.security import get_password_hash

# Since we don't have a configured conftest with db fixture, we create one locally
@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_property_images_relationship_and_ordering(db_session: Session):
    # 1. Create User (Agent)
    agent_id = uuid.uuid4()
    agent = User(
        id=agent_id,
        email=f"agent-{agent_id}@test.com",
        password_hash=get_password_hash("test1234"),
        full_name="Test Agent Integration",
        role=UserRole.AGENT,
        is_active=True
    )
    db_session.add(agent)
    
    # 2. Create Client (needs agent)
    client_id = uuid.uuid4()
    client = Client(
        id=client_id,
        full_name="Test Client Owner",
        email=f"client-{client_id}@test.com",
        phone="555-1234",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id,
        is_active=True
    )
    db_session.add(client)
    db_session.commit() # Commit to ensure IDs exist for FKs

    # 3. Create Property
    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="Test Property for Images",
        address_line1="123 Test St",
        city="Testville",
        sqm=120,
        rooms=4,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=client.id,
        captor_agent_id=agent.id
    )
    db_session.add(prop)
    db_session.commit()

    # 4. Add Images out of order with all new fields
    # Expected order: position 1, 2, 3
    img2 = PropertyImage(
        property_id=prop.id, 
        storage_key="props/1/img2.jpg",
        public_url="http://cdn.com/img2.jpg",
        position=2, 
        is_cover=False,
        caption="Living Room",
        alt_text="A spacious living room"
    )
    img1 = PropertyImage(
        property_id=prop.id, 
        storage_key="props/1/img1.jpg",
        public_url="http://cdn.com/img1.jpg",
        position=1, 
        is_cover=True,
        caption="Facade",
        alt_text="Front view of the house"
    )
    img3 = PropertyImage(
        property_id=prop.id, 
        storage_key="props/1/img3.jpg",
        public_url="http://cdn.com/img3.jpg",
        position=3, 
        is_cover=False,
        caption="Kitchen",
        alt_text="Modern kitchen"
    )
    
    db_session.add_all([img2, img3, img1]) # Add in random order
    db_session.commit()
    
    # 5. Verify
    # We query the property again to test relationship loading
    db_session.expire_all()
    loaded_prop = db_session.query(Property).filter(Property.id == prop_id).first()
    
    assert loaded_prop is not None
    assert len(loaded_prop.images) == 3
    
    # Check ordering by position
    assert loaded_prop.images[0].position == 1
    assert loaded_prop.images[0].public_url == "http://cdn.com/img1.jpg"
    assert loaded_prop.images[0].is_cover is True
    assert loaded_prop.images[0].caption == "Facade"
    
    assert loaded_prop.images[1].position == 2
    assert loaded_prop.images[1].public_url == "http://cdn.com/img2.jpg"
    
    assert loaded_prop.images[2].position == 3
    assert loaded_prop.images[2].public_url == "http://cdn.com/img3.jpg"

    # 6. Cleanup (Cascade delete check)
    db_session.delete(loaded_prop)
    db_session.commit()
    
    # Verify images are gone
    images_count = db_session.query(PropertyImage).filter(PropertyImage.property_id == prop_id).count()
    assert images_count == 0
    
    # Cleanup User and Client
    db_session.delete(client)
    db_session.delete(agent)
    db_session.commit()
