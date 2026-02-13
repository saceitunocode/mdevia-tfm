import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta, timezone
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, Visit, CalendarEvent
from app.domain.enums import UserRole, ClientType, PropertyStatus, VisitStatus, EventType
from app.core import security
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
        email=f"agent-visit-{user_id}@test.com",
        password_hash=security.get_password_hash("password"),
        full_name="Agent Visits",
        role=UserRole.AGENT,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="module")
def agent_token(test_agent):
    return security.create_access_token(subject=test_agent.email)

@pytest.fixture(scope="module")
def test_data(db: Session, test_agent):
    # Client
    test_client = Client(
        id=uuid.uuid4(),
        full_name="Visit Client",
        type=ClientType.BUYER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_client)
    
    # Owner
    test_owner = Client(
        id=uuid.uuid4(),
        full_name="Visit Owner",
        type=ClientType.OWNER,
        responsible_agent_id=test_agent.id
    )
    db.add(test_owner)
    db.commit()

    # Property
    prop = Property(
        id=uuid.uuid4(),
        title="Visit Property",
        address_line1="Visit St 123",
        city="Visit City",
        sqm=90,
        rooms=3,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=test_owner.id,
        captor_agent_id=test_agent.id
    )
    db.add(prop)
    db.commit()
    db.refresh(prop)
    
    return {"client_id": test_client.id, "property_id": prop.id, "agent_id": test_agent.id}

def test_create_visit_and_calendar_sync(db: Session, test_data, agent_token):
    headers = {"Authorization": f"Bearer {agent_token}"}
    
    scheduled_at = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    
    visit_in = {
        "client_id": str(test_data["client_id"]),
        "property_id": str(test_data["property_id"]),
        "agent_id": str(test_data["agent_id"]),
        "scheduled_at": scheduled_at,
        "status": "PENDING"
    }
    
    # 1. Create Visit
    response = client.post(f"{settings.API_V1_STR}/visits/", json=visit_in, headers=headers)
    assert response.status_code == 201
    visit_data = response.json()
    visit_id = visit_data["id"]

    # 2. Verify Calendar Event was created automatically
    db.expire_all()
    event = db.query(CalendarEvent).filter(CalendarEvent.visit_id == visit_id).first()
    assert event is not None
    assert event.type == EventType.VISIT
    assert event.agent_id == test_data["agent_id"]
    assert "Visita:" in event.title
    
    # 3. Update Visit Date
    new_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    update_in = {"scheduled_at": new_date}
    response = client.patch(f"{settings.API_V1_STR}/visits/{visit_id}", json=update_in, headers=headers)
    assert response.status_code == 200
    
    # Verify event moved
    db.refresh(event)
    # Check if dates match (ignoring precision if needed, but isoformat should work)
    # Actually let's just check it updated
    assert event.starts_at.date() == (datetime.now(timezone.utc) + timedelta(days=2)).date()

    # 4. Add a note
    note_in = {"text": "El cliente llegó tarde pero le gustó"}
    response = client.post(f"{settings.API_V1_STR}/visits/{visit_id}/notes", json=note_in, headers=headers)
    assert response.status_code == 200
    assert response.json()["text"] == "El cliente llegó tarde pero le gustó"

    # Cleanup
    db.delete(event) # This should ideally be handled by cascade but let's be explicit if needed
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    db.delete(visit)
    db.commit()
