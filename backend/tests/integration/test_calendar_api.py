import pytest
import uuid
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, CalendarEvent
from app.domain.enums import UserRole, EventType, EventStatus
from app.core import security

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_calendar_event_permissions(client: TestClient, db_session: Session):
    # 1. Setup Data: 1 Agent, 1 Admin, 1 "Other" Agent
    password = "password123"
    hashed_pw = security.get_password_hash(password)
    
    # Agent 1 (Me)
    agent1 = User(id=uuid.uuid4(), email=f"agent1-{uuid.uuid4()}@test.com", password_hash=hashed_pw, role=UserRole.AGENT, full_name="Agent One")
    db_session.add(agent1)
    
    # Agent 2 (Other)
    agent2 = User(id=uuid.uuid4(), email=f"agent2-{uuid.uuid4()}@test.com", password_hash=hashed_pw, role=UserRole.AGENT, full_name="Agent Two")
    db_session.add(agent2)
    
    # Admin
    admin = User(id=uuid.uuid4(), email=f"admin-{uuid.uuid4()}@test.com", password_hash=hashed_pw, role=UserRole.ADMIN, full_name="Admin Power")
    db_session.add(admin)
    
    db_session.commit()
    
    # Tokens
    token_agent1 = security.create_access_token(subject=agent1.email)
    headers_agent1 = {"Authorization": f"Bearer {token_agent1}"}
    
    token_admin = security.create_access_token(subject=admin.email)
    headers_admin = {"Authorization": f"Bearer {token_admin}"}
    
    start_time = datetime.now(timezone.utc) + timedelta(days=1)
    end_time = start_time + timedelta(hours=1)
    
    # 2. Test Agent create for SELF -> OK
    event_data_self = {
        "title": "My Event",
        "type": EventType.VISIT.value,
        "starts_at": start_time.isoformat(),
        "ends_at": end_time.isoformat(),
        # No agent_id sent, should default to self
    }
    resp = client.post("/api/v1/calendar-events/", json=event_data_self, headers=headers_agent1)
    assert resp.status_code == 200
    data = resp.json()
    assert data["agent_id"] == str(agent1.id)
    event1_id = data["id"]
    
    # 3. Test Agent try create for OTHER -> Fail (403)
    event_data_other = {
        "title": "Hacking Event",
        "type": EventType.NOTE.value,
        "starts_at": start_time.isoformat(),
        "ends_at": end_time.isoformat(),
        "agent_id": str(agent2.id) # Trying to assign to Agent 2
    }
    resp = client.post("/api/v1/calendar-events/", json=event_data_other, headers=headers_agent1)
    assert resp.status_code == 403
    
    # 4. Test Admin create for Agent 2 -> OK
    event_data_admin = {
        "title": "Admin Assigned Event",
        "type": EventType.CAPTATION.value,
        "starts_at": (start_time + timedelta(hours=2)).isoformat(),
        "ends_at": (end_time + timedelta(hours=2)).isoformat(),
        "agent_id": str(agent2.id)
    }
    resp = client.post("/api/v1/calendar-events/", json=event_data_admin, headers=headers_admin)
    assert resp.status_code == 200
    data = resp.json()
    assert data["agent_id"] == str(agent2.id)
    event2_id = data["id"]
    
    # 5. Test List Permissions
    
    # Agent 1 lists -> Sees only Event 1
    resp = client.get("/api/v1/calendar-events/", headers=headers_agent1)
    assert resp.status_code == 200
    items = resp.json()
    ids = [e["id"] for e in items]
    assert event1_id in ids
    assert event2_id not in ids # Should NOT see Agent 2's event
    
    # Agent 1 tries to filter by Agent 2 -> Still sees only Event 1 (ignoring filter or seeing empty list depending on logic)
    # Our logic: Agent enforces filter to self. So filter is ignored.
    
    # Admin lists ALL
    resp = client.get("/api/v1/calendar-events/", headers=headers_admin)
    items = resp.json()
    ids = [e["id"] for e in items]
    assert event1_id in ids
    assert event2_id in ids
    
    # Admin filters by Agent 2 -> Sees only Event 2
    resp = client.get(f"/api/v1/calendar-events/?agent_id={agent2.id}", headers=headers_admin)
    items = resp.json()
    assert len(items) >= 1
    assert all(e["agent_id"] == str(agent2.id) for e in items)
    
    # Cleanup
    db_session.query(CalendarEvent).filter(CalendarEvent.id.in_([event1_id, event2_id])).delete()
    db_session.delete(agent1)
    db_session.delete(agent2)
    db_session.delete(admin)
    db_session.commit()
