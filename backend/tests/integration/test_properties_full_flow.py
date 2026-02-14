import pytest
import uuid
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property
from app.domain.enums import UserRole, ClientType, PropertyStatus
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

def test_property_full_lifecycle(client: TestClient, db_session: Session):
    """
    Test completo del ciclo de vida de una propiedad:
    1. Creación con campos completos (incluyendo status y is_published)
    2. Verificación de lectura
    3. Actualización (cambio de estado y visibilidad)
    4. Verificación de actualización
    """
    
    # ----------------------------------------------------------------
    # 1. SETUP: Crear Agente y Cliente Propietario
    # ----------------------------------------------------------------
    agent_email = f"agent-lifecycle-{uuid.uuid4()}@example.com"
    agent = User(
        id=uuid.uuid4(),
        email=agent_email,
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Lifecycle Test Agent",
        is_active=True
    )
    db_session.add(agent)
    
    owner_email = f"owner-lifecycle-{uuid.uuid4()}@example.com"
    owner = Client(
        id=uuid.uuid4(),
        full_name="Lifecycle Test Owner",
        email=owner_email,
        phone="600123456",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id,
        is_active=True
    )
    db_session.add(owner)
    db_session.commit()
    
    # Login como Agente
    access_token = security.create_access_token(subject=agent.email)
    headers = {"Authorization": f"Bearer {access_token}"}

    # ----------------------------------------------------------------
    # 2. CREACIÓN (POST)
    # ----------------------------------------------------------------
    create_payload = {
        "title": "Ático de Lujo en Centro",
        "address_line1": "Calle Mayor 10",
        "city": "Madrid",
        "postal_code": "28001",
        "sqm": 120,
        "rooms": 3,
        "price_amount": 450000.00,
        "owner_client_id": str(owner.id),
        "status": "AVAILABLE",
        "is_published": True,
        "public_description": "Vistas espectaculares",
        "internal_notes": "El propietario tiene prisa"
    }

    response = client.post("/api/v1/properties/", json=create_payload, headers=headers)
    assert response.status_code == 200, f"Error creating property: {response.text}"
    data = response.json()
    
    property_id = data["id"]
    assert data["title"] == create_payload["title"]
    assert data["status"] == "AVAILABLE"
    assert data["is_published"] is True
    assert data["captor_agent_id"] == str(agent.id)

    # ----------------------------------------------------------------
    # 3. ACTUALIZACIÓN (PUT)
    # ----------------------------------------------------------------
    update_payload = {
        "title": "Ático Vendido (Actualizado)",
        "status": "SOLD",      # Cambiamos estado
        "is_published": False, # Retiramos de web
        "price_amount": 430000.00 # Rebaja final
    }

    response = client.put(f"/api/v1/properties/{property_id}", json=update_payload, headers=headers)
    assert response.status_code == 200, f"Error updating property: {response.text}"
    updated_data = response.json()

    assert updated_data["title"] == "Ático Vendido (Actualizado)"
    assert updated_data["status"] == "SOLD"
    assert updated_data["is_published"] is False
    assert float(updated_data["price_amount"]) == 430000.00

    # ----------------------------------------------------------------
    # 4. VERIFICACIÓN DE LECTURA (GET DETAILLE)
    # ----------------------------------------------------------------
    response = client.get(f"/api/v1/properties/{property_id}", headers=headers)
    assert response.status_code == 200
    final_data = response.json()
    
    assert final_data["status"] == "SOLD"
    assert final_data["is_published"] is False

    # ----------------------------------------------------------------
    # 5. CLEANUP
    # ----------------------------------------------------------------
    prop_obj = db_session.query(Property).filter(Property.id == property_id).first()
    if prop_obj:
        db_session.delete(prop_obj)
    db_session.delete(owner)
    db_session.delete(agent)
    db_session.commit()
