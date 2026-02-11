import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, ClientNote
from app.domain.enums import UserRole, ClientType
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

def test_client_full_lifecycle(client: TestClient, db_session: Session):
    """
    Test completo del ciclo de vida de un cliente:
    1. Creación (POST)
    2. Añadir Nota (POST /notes)
    3. Ver Detalle con Nota (GET /{id})
    4. Actualización (PUT)
    5. Borrado (DELETE)
    """
    
    # ----------------------------------------------------------------
    # 1. SETUP: Crear Agente
    # ----------------------------------------------------------------
    agent_email = f"agent-client-flow-{uuid.uuid4()}@example.com"
    agent = User(
        id=uuid.uuid4(),
        email=agent_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Client Flow Agent",
        is_active=True
    )
    db_session.add(agent)
    db_session.commit()
    
    # Login como Agente
    access_token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # ----------------------------------------------------------------
    # 2. CREACIÓN (POST)
    # ----------------------------------------------------------------
    create_payload = {
        "full_name": "Nuevo Cliente Test",
        "email": f"newclient-{uuid.uuid4()}@test.com",
        "phone": "600111222",
        "type": "BUYER",
        "responsible_agent_id": str(agent.id),
        "is_active": True
    }

    response = client.post("/api/v1/clients/", json=create_payload, headers=headers)
    assert response.status_code == 200, f"Error creating client: {response.text}"
    data = response.json()
    
    client_id = data["id"]
    assert data["full_name"] == "Nuevo Cliente Test"
    assert data["type"] == "BUYER"
    assert data["responsible_agent_id"] == str(agent.id)

    # ----------------------------------------------------------------
    # 3. AÑADIR NOTA (POST /notes)
    # ----------------------------------------------------------------
    note_payload = {
        "text": "Primera nota de seguimiento"
    }
    
    response = client.post(f"/api/v1/clients/{client_id}/notes", json=note_payload, headers=headers)
    assert response.status_code == 200, f"Error creating note: {response.text}"
    note_data = response.json()
    
    assert note_data["text"] == "Primera nota de seguimiento"
    assert note_data["author_user_id"] == str(agent.id)

    # ----------------------------------------------------------------
    # 4. VER DETALLE CON NOTAS (GET /{id})
    # ----------------------------------------------------------------
    response = client.get(f"/api/v1/clients/{client_id}", headers=headers)
    assert response.status_code == 200
    detail_data = response.json()
    
    # Verificar notas incluidas
    assert "notes" in detail_data
    assert len(detail_data["notes"]) >= 1
    assert detail_data["notes"][0]["text"] == "Primera nota de seguimiento"

    # ----------------------------------------------------------------
    # 5. ACTUALIZACIÓN (PUT)
    # ----------------------------------------------------------------
    update_payload = {
        "full_name": "Cliente Actualizado",
        "type": "OWNER" # Cambio de tipo
    }

    response = client.put(f"/api/v1/clients/{client_id}", json=update_payload, headers=headers)
    assert response.status_code == 200
    updated_data = response.json()

    assert updated_data["full_name"] == "Cliente Actualizado"
    assert updated_data["type"] == "OWNER"

    # ----------------------------------------------------------------
    # 6. BORRADO (DELETE) e intento de acceso
    # ----------------------------------------------------------------
    # OJO: Delete borra físicamente en implementation actual
    response = client.delete(f"/api/v1/clients/{client_id}", headers=headers)
    assert response.status_code == 200
    
    # Verificar que ya no existe
    response = client.get(f"/api/v1/clients/{client_id}", headers=headers)
    assert response.status_code == 404

    # ----------------------------------------------------------------
    # 7. CLEANUP (Solo Agente, Cliente ya borrado)
    # ----------------------------------------------------------------
    # Delete test artifacts (notes should be cascaded if configured properly, but delete removes client first)
    # Since we deleted client, notes should be gone if cascade is set, or orphaned.
    # Check DB schema for cascade.
    
    db_session.query(User).filter(User.id == agent.id).delete()
    db_session.commit()
