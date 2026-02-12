import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.user import User
from app.domain.enums import UserRole
from app.core import security

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_admin_create_agent(client: TestClient, db: Session):
    # 1. Create a test admin
    admin_email = f"admin-{uuid.uuid4()}@example.com"
    admin = User(
        id=uuid.uuid4(),
        email=admin_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.ADMIN,
        full_name="Admin Test",
        is_active=True
    )
    db.add(admin)
    db.commit()

    # 2. Token for admin
    access_token = security.create_access_token(subject=admin.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # 3. Create agent via POST /api/v1/users/
    new_agent_email = f"agent-{uuid.uuid4()}@example.com"
    user_data = {
        "email": new_agent_email,
        "full_name": "New Agent Test",
        "password": "password123",
        "is_active": True
    }
    response = client.post("/api/v1/users/", json=user_data, headers=headers)
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == new_agent_email
    assert data["full_name"] == "New Agent Test"
    assert data["role"] == UserRole.AGENT.value
    assert "password" not in data

    # Cleanup
    db.query(User).filter(User.email == new_agent_email).delete()
    db.delete(admin)
    db.commit()

def test_agent_cannot_create_user(client: TestClient, db: Session):
    # 1. Create a test agent
    agent_email = f"agent-{uuid.uuid4()}@example.com"
    agent = User(
        id=uuid.uuid4(),
        email=agent_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Agent Test",
        is_active=True
    )
    db.add(agent)
    db.commit()

    # 2. Token for agent
    access_token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # 3. Try to create user
    user_data = {
        "email": f"other-{uuid.uuid4()}@example.com",
        "full_name": "Other User",
        "password": "password123"
    }
    response = client.post("/api/v1/users/", json=user_data, headers=headers)
    
    assert response.status_code == 403
    assert response.json()["detail"] == "The user doesn't have enough privileges"

    # Cleanup
    db.delete(agent)
    db.commit()

def test_create_user_duplicate_email(client: TestClient, db: Session):
    # 1. Create admin and a pre-existing user
    admin = User(
        id=uuid.uuid4(),
        email=f"admin-{uuid.uuid4()}@example.com",
        password_hash=security.get_password_hash("password123"),
        role=UserRole.ADMIN,
        full_name="Admin Test",
        is_active=True
    )
    existing_user_email = f"existent-{uuid.uuid4()}@example.com"
    existing_user = User(
        id=uuid.uuid4(),
        email=existing_user_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Existing Agent"
    )
    db.add(admin)
    db.add(existing_user)
    db.commit()

    access_token = security.create_access_token(subject=admin.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # 2. Try to create user with SAME email
    user_data = {
        "email": existing_user_email,
        "full_name": "Duplicate User",
        "password": "password123"
    }
    response = client.post("/api/v1/users/", json=user_data, headers=headers)
    
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]

    # Cleanup
    db.delete(existing_user)
    db.delete(admin)
    db.commit()

def test_create_user_short_password(client: TestClient, db: Session):
    admin = User(
        id=uuid.uuid4(),
        email=f"admin-{uuid.uuid4()}@example.com",
        password_hash=security.get_password_hash("password123"),
        role=UserRole.ADMIN,
        full_name="Admin Test",
        is_active=True
    )
    db.add(admin)
    db.commit()

    access_token = security.create_access_token(subject=admin.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # Password less than 8 chars
    user_data = {
        "email": f"new-{uuid.uuid4()}@example.com",
        "full_name": "Short Password User",
        "password": "short"
    }
    response = client.post("/api/v1/users/", json=user_data, headers=headers)
    
    assert response.status_code == 422
    # Pydantic validation error
    errors = response.json()["detail"]
    assert any("password" in err["loc"] for err in errors)

    # Cleanup
    db.delete(admin)
    db.commit()
