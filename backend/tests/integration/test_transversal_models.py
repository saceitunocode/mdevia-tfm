import pytest
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, DomainEvent, ClientNote, PropertyNote, Visit, VisitNote
from app.domain.enums import ClientType, PropertyStatus, UserRole, VisitStatus
from app.core.security import get_password_hash

# Fixture local para sesión DB
@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_transversal_models_persistence(db_session: Session):
    # 1. SETUP: Actors
    admin_id = uuid.uuid4()
    admin = User(
        id=admin_id,
        email=f"admin-audit-final-{admin_id}@test.com",
        password_hash=get_password_hash("securepass"),
        full_name="Admin Audit Final",
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(admin)
    
    client_id = uuid.uuid4()
    client = Client(
        id=client_id,
        full_name="Important Client Final",
        type=ClientType.BUYER,
        responsible_agent_id=admin.id
    )
    db_session.add(client)
    
    # Needs a property for visit
    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="Visit property",
        address_line1="Visit lane",
        city="Visitpolis",
        sqm=100,
        rooms=2,
        owner_client_id=client.id, # Client owns it for simplicity
        captor_agent_id=admin.id
    )
    db_session.add(prop)
    
    db_session.commit()

    # 2. CREATE DOMAIN EVENT (Audit Trail)
    event_payload = {
        "ip": "127.0.0.1",
        "action": "LOGIN",
        "browser": "Firefox"
    }
    
    event = DomainEvent(
        event_type="USER_LOGIN",
        entity_type="User",
        entity_id=admin.id,
        actor_user_id=admin.id,
        payload_json=event_payload
    )
    db_session.add(event)
    
    # 3. CREATE CLIENT NOTE
    client_note = ClientNote(
        client_id=client.id,
        author_user_id=admin.id,
        text="This client prefers calls in the morning."
    )
    db_session.add(client_note)
    
    # 4. CREATE PROPERTY NOTE
    prop_note = PropertyNote(
        property_id=prop.id,
        author_user_id=admin.id,
        text="Needs painting."
    )
    db_session.add(prop_note)
    
    # 5. CREATE VISIT AND VISIT NOTE
    visit_id = uuid.uuid4()
    visit = Visit(
        id=visit_id,
        client_id=client.id,
        property_id=prop.id,
        agent_id=admin.id,
        scheduled_at=datetime.now(),
        status=VisitStatus.DONE
    )
    db_session.add(visit)
    db_session.commit() # Commit visit first to have ID
    
    visit_note = VisitNote(
        visit_id=visit.id,
        author_user_id=admin.id,
        text="Client loved the kitchen."
    )
    db_session.add(visit_note)
    
    db_session.commit()
    
    # 6. VERIFICATIONS
    db_session.expire_all()
    
    # Domain Event
    loaded_event = db_session.get(DomainEvent, event.id)
    assert loaded_event.event_type == "USER_LOGIN"
    
    # Client Note
    loaded_client = db_session.get(Client, client_id)
    assert len(loaded_client.notes) == 1
    assert loaded_client.notes[0].text == "This client prefers calls in the morning."
    
    # Property Note
    loaded_prop = db_session.get(Property, prop_id)
    assert len(loaded_prop.notes) == 1
    assert loaded_prop.notes[0].text == "Needs painting."
    
    # Visit Note
    loaded_visit = db_session.get(Visit, visit_id)
    assert len(loaded_visit.notes) == 1
    assert loaded_visit.notes[0].text == "Client loved the kitchen."

    # 7. CASCADE DELETE CHECKS
    
    # Delete Visit -> Should delete VisitNote
    db_session.delete(loaded_visit)
    db_session.commit()
    assert db_session.get(VisitNote, visit_note.id) is None
    
    # Delete Client -> Should delete ClientNote (and owned Property -> PropertyNote)
    # Wait, Property depends on Client (Owner). 
    # Does Property cascade delete when Owner Client is deleted? 
    # Let's check Property model: owner_client = relationship("Client", back_populates="owned_properties")
    # And Client model: owned_properties = relationship("Property", back_populates="owner_client", cascade="all, delete-orphan")
    # YES.
    
    db_session.delete(loaded_client)
    db_session.commit()
    
    assert db_session.get(ClientNote, client_note.id) is None
    assert db_session.get(Property, prop_id) is None
    assert db_session.get(PropertyNote, prop_note.id) is None
    
    # Clean actors
    db_session.delete(admin)
    db_session.delete(loaded_event)
    db_session.commit()
