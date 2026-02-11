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


@pytest.fixture(scope="module")
def seed_data(db_session: Session):
    """Create agent, owner, and multiple properties for filter testing."""
    agent = User(
        id=uuid.uuid4(),
        email=f"agent-filters-{uuid.uuid4()}@example.com",
        password_hash=security.get_password_hash("password123"),
        role=UserRole.AGENT,
        full_name="Filter Test Agent",
        is_active=True,
    )
    db_session.add(agent)

    owner = Client(
        id=uuid.uuid4(),
        full_name="Filter Test Owner",
        email=f"owner-filters-{uuid.uuid4()}@example.com",
        phone="600000001",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id,
        is_active=True,
    )
    db_session.add(owner)
    db_session.flush()

    properties = [
        # Madrid, cheap, small
        Property(
            id=uuid.uuid4(),
            title="Estudio Centro Madrid",
            address_line1="Calle Gran Vía 1",
            city="Madrid",
            sqm=40,
            rooms=1,
            price_amount=Decimal("120000.00"),
            status=PropertyStatus.AVAILABLE,
            is_published=True,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
        # Madrid, expensive, large
        Property(
            id=uuid.uuid4(),
            title="Ático Salamanca",
            address_line1="Calle Serrano 50",
            city="Madrid",
            sqm=200,
            rooms=5,
            price_amount=Decimal("950000.00"),
            status=PropertyStatus.AVAILABLE,
            is_published=True,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
        # Barcelona, mid-range
        Property(
            id=uuid.uuid4(),
            title="Piso Eixample",
            address_line1="Passeig de Gràcia 20",
            city="Barcelona",
            sqm=90,
            rooms=3,
            price_amount=Decimal("350000.00"),
            status=PropertyStatus.AVAILABLE,
            is_published=True,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
        # Valencia, cheap
        Property(
            id=uuid.uuid4(),
            title="Apartamento Ciutat Vella",
            address_line1="Carrer de la Pau 5",
            city="Valencia",
            sqm=70,
            rooms=2,
            price_amount=Decimal("180000.00"),
            status=PropertyStatus.AVAILABLE,
            is_published=True,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
        # SOLD — should NOT appear in showcase
        Property(
            id=uuid.uuid4(),
            title="Vendido en Sevilla",
            address_line1="Calle Betis 1",
            city="Sevilla",
            sqm=80,
            rooms=2,
            price_amount=Decimal("200000.00"),
            status=PropertyStatus.SOLD,
            is_published=True,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
        # UNPUBLISHED — should NOT appear in showcase
        Property(
            id=uuid.uuid4(),
            title="No Publicado Madrid",
            address_line1="Calle Oculta 99",
            city="Madrid",
            sqm=60,
            rooms=2,
            price_amount=Decimal("250000.00"),
            status=PropertyStatus.AVAILABLE,
            is_published=False,
            is_active=True,
            owner_client_id=owner.id,
            captor_agent_id=agent.id,
        ),
    ]

    for p in properties:
        db_session.add(p)
    db_session.commit()

    yield {
        "agent": agent,
        "owner": owner,
        "properties": properties,
    }

    # Cleanup
    for p in properties:
        db_session.query(Property).filter(Property.id == p.id).delete()
    db_session.delete(owner)
    db_session.delete(agent)
    db_session.commit()


def test_showcase_no_filters(client: TestClient, seed_data):
    """Without filters, all published+available properties are returned."""
    response = client.get("/api/v1/properties/public")
    assert response.status_code == 200
    data = response.json()

    # At least the 4 published+available from seed
    titles = [p["title"] for p in data]
    assert "Estudio Centro Madrid" in titles
    assert "Ático Salamanca" in titles
    assert "Piso Eixample" in titles
    assert "Apartamento Ciutat Vella" in titles

    # Sold and unpublished must NOT appear
    assert "Vendido en Sevilla" not in titles
    assert "No Publicado Madrid" not in titles


def test_showcase_filter_city(client: TestClient, seed_data):
    """Filter by city returns only matching properties."""
    response = client.get("/api/v1/properties/public?city=Madrid")
    assert response.status_code == 200
    data = response.json()

    for p in data:
        assert p["city"].lower() == "madrid"

    titles = [p["title"] for p in data]
    assert "Estudio Centro Madrid" in titles
    assert "Ático Salamanca" in titles
    assert "Piso Eixample" not in titles


def test_showcase_filter_price_range(client: TestClient, seed_data):
    """Filter by price range returns correct results."""
    response = client.get("/api/v1/properties/public?price_min=100000&price_max=200000")
    assert response.status_code == 200
    data = response.json()

    for p in data:
        price = float(p["price_amount"])
        assert 100000 <= price <= 200000


def test_showcase_filter_city_and_price(client: TestClient, seed_data):
    """Combined city + price filters work correctly."""
    response = client.get("/api/v1/properties/public?city=Madrid&price_max=200000")
    assert response.status_code == 200
    data = response.json()

    for p in data:
        assert p["city"].lower() == "madrid"
        assert float(p["price_amount"]) <= 200000

    titles = [p["title"] for p in data]
    assert "Estudio Centro Madrid" in titles
    assert "Ático Salamanca" not in titles


def test_showcase_filter_rooms(client: TestClient, seed_data):
    """Filter by exact room count."""
    response = client.get("/api/v1/properties/public?rooms=3")
    assert response.status_code == 200
    data = response.json()

    for p in data:
        assert p["rooms"] == 3


def test_showcase_filter_sqm_range(client: TestClient, seed_data):
    """Filter by square meter range."""
    response = client.get("/api/v1/properties/public?sqm_min=70&sqm_max=100")
    assert response.status_code == 200
    data = response.json()

    for p in data:
        assert 70 <= p["sqm"] <= 100


def test_showcase_pagination(client: TestClient, seed_data):
    """Pagination with limit and offset works."""
    # Get all results first
    response_all = client.get("/api/v1/properties/public?limit=100")
    assert response_all.status_code == 200
    all_results = response_all.json()
    total = len(all_results)

    if total < 2:
        pytest.skip("Need at least 2 properties for pagination test")

    # Get first page with limit=1
    response = client.get("/api/v1/properties/public?limit=1&offset=0")
    assert response.status_code == 200
    page1 = response.json()
    assert len(page1) == 1

    # Get second page with limit=1
    response = client.get("/api/v1/properties/public?limit=1&offset=1")
    assert response.status_code == 200
    page2 = response.json()
    assert len(page2) == 1

    # They must be different properties
    assert page1[0]["id"] != page2[0]["id"]


def test_showcase_no_auth_required(client: TestClient, seed_data):
    """Showcase endpoint does not require authentication."""
    # No Authorization header at all
    response = client.get("/api/v1/properties/public")
    assert response.status_code == 200


def test_showcase_limit_validation(client: TestClient, seed_data):
    """Limit cannot exceed 100."""
    response = client.get("/api/v1/properties/public?limit=200")
    assert response.status_code == 422  # Validation error
