import pytest
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, Visit, CalendarEvent
from app.domain.enums import ClientType, PropertyStatus, UserRole, VisitStatus, EventType, EventStatus
from app.core.security import get_password_hash

# Fixture local para sesión DB
@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_visit_calendar_sync(db_session: Session):
    # 1. SETUP: Actors
    agent_id = uuid.uuid4()
    agent = User(
        id=agent_id,
        email=f"agent-agenda-{agent_id}@test.com",
        password_hash=get_password_hash("securepass"),
        full_name="Agent Agenda",
        role=UserRole.AGENT,
        is_active=True
    )
    db_session.add(agent)
    
    client_id = uuid.uuid4()
    client = Client(
        id=client_id,
        full_name="Visitor Client",
        type=ClientType.BUYER,
        responsible_agent_id=agent.id,
        phone="555-VISIT"
    )
    db_session.add(client)
    
    # Dummy owner for property
    owner_id = uuid.uuid4()
    owner = Client(id=owner_id, full_name="Owner", type=ClientType.OWNER, responsible_agent_id=agent.id, phone="555-OWNER")
    db_session.add(owner)
    db_session.commit()

    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="Penthouse with View",
        address_line1="Sky High St.",
        city="Cloud City",
        sqm=150,
        rooms=2,
        owner_client_id=owner.id,
        captor_agent_id=agent.id
    )
    db_session.add(prop)
    db_session.commit()

    # 2. CREATE VISIT
    visit_time = datetime.now(timezone.utc) + timedelta(days=1)
    visit_id = uuid.uuid4()
    visit = Visit(
        id=visit_id,
        client_id=client.id,
        property_id=prop.id,
        agent_id=agent.id,
        scheduled_at=visit_time,
        status=VisitStatus.PENDING
    )
    db_session.add(visit)
    db_session.commit()

    # 3. CREATE CALENDAR EVENT (Mirroring the Visit)
    event_id = uuid.uuid4()
    event = CalendarEvent(
        id=event_id,
        agent_id=agent.id, # Agenda central del agente
        starts_at=visit_time,
        ends_at=visit_time + timedelta(hours=1),
        type=EventType.VISIT,
        status=EventStatus.ACTIVE,
        title=f"Visit: {prop.title}",
        visit_id=visit.id # LINK HERE
    )
    db_session.add(event)
    db_session.commit()

    # 4. VERIFY RELATIONS
    db_session.expire_all()
    
    # Load Visit and check Event link
    loaded_visit = db_session.get(Visit, visit_id)
    assert loaded_visit is not None
    assert loaded_visit.calendar_event is not None
    assert loaded_visit.calendar_event.id == event_id
    assert loaded_visit.calendar_event.title == "Visit: Penthouse with View"
    
    # Load Event and check Visit link
    loaded_event = db_session.get(CalendarEvent, event_id)
    assert loaded_event.visit.id == visit_id
    assert loaded_event.agent.full_name == "Agent Agenda"

    # 5. CLEANUP
    db_session.delete(event) # Should cascade delete? Check model. Visit->Event cascade is defined in Visit model?
    # Actually Model Visit has: calendar_event = relationship("CalendarEvent", ..., cascade="all, delete-orphan")
    # So deleting Visit should delete Event. Let's test THAT instead.
    
    db_session.delete(loaded_visit)
    db_session.commit()
    
    assert db_session.get(CalendarEvent, event_id) is None, "Calendar Event should have been deleted via cascade from Visit"
    
    # Clean actors
    db_session.delete(prop)
    db_session.delete(client)
    db_session.delete(owner)
    db_session.delete(agent)
    db_session.commit()

def test_calendar_event_constraints(db_session: Session):
    # Setup minimal agent
    agent_id = uuid.uuid4()
    agent = User(id=agent_id, email=f"agent-fail-{agent_id}@test.com", password_hash="x", role=UserRole.AGENT)
    db_session.add(agent)
    db_session.commit()

    # Start > End (Should Fail)
    start = datetime.now(timezone.utc)
    end = start - timedelta(hours=1) # BACKWARDS TIME
    
    bad_event = CalendarEvent(
        agent_id=agent.id,
        starts_at=start,
        ends_at=end,
        type=EventType.NOTE,
        title="Impossible Meeting"
    )
    db_session.add(bad_event)
    
    with pytest.raises(IntegrityError):
        db_session.commit()
    
    db_session.rollback()
    
    # Clean
    db_session.delete(agent)
    db_session.commit()
