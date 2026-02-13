import pytest
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.infrastructure.database.models import User, Client, Property, Visit, CalendarEvent
from app.domain.enums import UserRole, ClientType, PropertyStatus, VisitStatus, EventType
from app.core import security
from app.application.use_cases.visit_use_case import VisitUseCase
from app.infrastructure.repositories.visit_repository import VisitRepository
from app.infrastructure.repositories.calendar_event_repository import CalendarEventRepository
from app.infrastructure.repositories.client_repository import ClientRepository
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.infrastructure.database.session import SessionLocal
from app.domain.schemas.visit import VisitCreate

@pytest.fixture
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_create_visit_use_case(db_session: Session):
    """
    Test direct visit creation through the UseCase, verifying that:
    1. The visit is created in the database.
    2. An initial note is added if provided.
    3. A synchronized calendar event is created for the agent.
    """
    # 1. Setup Actors
    agent_id = uuid.uuid4()
    agent = User(
        id=agent_id,
        email=f"usecase-test-{agent_id}@test.com",
        password_hash="fake",
        full_name="UseCase Agent",
        role=UserRole.AGENT,
        is_active=True
    )
    db_session.add(agent)
    
    test_client = Client(id=uuid.uuid4(), full_name="UC Client", type=ClientType.BUYER, responsible_agent_id=agent_id)
    db_session.add(test_client)
    
    prop = Property(
        id=uuid.uuid4(),
        title="UC Property",
        address_line1="UC St 1",
        city="UC City",
        sqm=70,
        rooms=2,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=test_client.id,
        captor_agent_id=agent_id
    )
    db_session.add(prop)
    db_session.commit()

    # 2. Instantiate Use Case
    visit_use_case = VisitUseCase(
        visit_repo=VisitRepository(),
        calendar_repo=CalendarEventRepository(db_session),
        client_repo=ClientRepository(),
        property_repo=PropertyRepository()
    )

    # 3. Create Visit
    scheduled_at = datetime.now(timezone.utc) + timedelta(days=1)
    note_text = "Test note for UC creation"
    
    visit_in = VisitCreate(
        client_id=test_client.id,
        property_id=prop.id,
        agent_id=agent.id,
        scheduled_at=scheduled_at,
        status=VisitStatus.PENDING,
        note=note_text
    )
    
    visit = visit_use_case.create_visit(db_session, visit_in)
    
    # 4. Verifications
    assert visit.id is not None
    assert visit.agent_id == agent_id
    assert visit.client_id == test_client.id
    
    # Check Note
    assert len(visit.notes) == 1
    assert visit.notes[0].text == note_text
    
    # Check Calendar Sync
    event = db_session.query(CalendarEvent).filter(CalendarEvent.visit_id == visit.id).first()
    assert event is not None
    assert event.agent_id == agent_id
    assert event.type == EventType.VISIT
    assert "UC Client" in event.title
    assert "UC Property" in event.title

    # 5. Cleanup
    db_session.delete(event)
    db_session.delete(visit) # Notes will be cascading deleted
    db_session.delete(prop)
    db_session.delete(test_client)
    db_session.delete(agent)
    db_session.commit()
