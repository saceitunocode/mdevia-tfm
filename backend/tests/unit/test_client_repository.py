import pytest
import uuid
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client
from app.domain.enums import ClientType, UserRole
from app.domain.schemas.client import ClientNoteCreate
from app.infrastructure.repositories.client_repository import ClientRepository
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
        email=f"agent-client-unit-{uuid.uuid4()}@test.com",
        password_hash=get_password_hash("test1234"),
        full_name="Client Unit Agent",
        role=UserRole.AGENT
    )
    db.add(agent)
    db.commit()
    yield agent
    db.delete(agent)
    db.commit()


def test_client_repository_create(db: Session, agent: User):
    repo = ClientRepository()
    client_obj = Client(
        full_name="Unit Test Client",
        email=f"unit-{uuid.uuid4()}@test.com",
        phone="600000001",
        type=ClientType.BUYER,
        responsible_agent_id=agent.id
    )

    created = repo.create(db, client_obj)

    assert created.id is not None
    assert created.full_name == "Unit Test Client"
    assert created.type == ClientType.BUYER

    db.delete(created)
    db.commit()


def test_client_repository_list(db: Session):
    repo = ClientRepository()
    clients = repo.list_all(db, limit=5)
    assert isinstance(clients, list)


def test_client_repository_update(db: Session, agent: User):
    repo = ClientRepository()
    client_obj = Client(
        full_name="Before Update",
        email=f"update-{uuid.uuid4()}@test.com",
        phone="600000002",
        type=ClientType.BUYER,
        responsible_agent_id=agent.id
    )
    created = repo.create(db, client_obj)

    updated = repo.update(
        db,
        client_obj=created,
        client_in={"full_name": "After Update", "type": ClientType.OWNER}
    )

    assert updated.full_name == "After Update"
    assert updated.type == ClientType.OWNER

    db.refresh(updated)
    assert updated.full_name == "After Update"

    db.delete(updated)
    db.commit()


def test_client_repository_create_note(db: Session, agent: User):
    repo = ClientRepository()
    client_obj = Client(
        full_name="Note Test Client",
        email=f"note-{uuid.uuid4()}@test.com",
        phone="600000003",
        type=ClientType.TENANT,
        responsible_agent_id=agent.id
    )
    created = repo.create(db, client_obj)

    note_in = ClientNoteCreate(text="Esta es una nota de prueba unitaria")
    note = repo.create_note(db, note_in=note_in, client_id=created.id, author_id=agent.id)

    assert note.id is not None
    assert note.text == "Esta es una nota de prueba unitaria"
    assert note.client_id == created.id
    assert note.author_user_id == agent.id

    db.delete(note)
    db.delete(created)
    db.commit()


def test_client_repository_delete(db: Session, agent: User):
    repo = ClientRepository()
    client_obj = Client(
        full_name="Delete Test Client",
        email=f"delete-{uuid.uuid4()}@test.com",
        phone="600000004",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id
    )
    created = repo.create(db, client_obj)
    client_id = created.id

    deleted = repo.delete(db, client_id=client_id)

    assert deleted is not None
    assert deleted.id == client_id

    found = repo.get_by_id(db, client_id=client_id)
    assert found is None
