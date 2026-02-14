import pytest
import os
import sys

# Update path to include backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool, NullPool

from app.core.config import settings
from app.infrastructure.database.session import SessionLocal, get_db
from app.infrastructure.database.base import Base
from app.main import app

# Force settings to use test database
# This ensures that if any part of the code accesses settings.DATABASE_URL dynamically, it gets the test one.
# However, SessionLocal might have already been initialized with the old URL.
# We will handle that by reconfiguring SessionLocal.
TEST_DB_NAME = "mdevia_tfm_test"

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """
    Creates the test database if it doesn't exist.
    Configures SessionLocal to point to the test database.
    Creates all tables in the test database.
    """
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

    # 1. Connect to default 'postgres' to create test DB
    default_db_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/postgres"
    
    try:
        conn = psycopg2.connect(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            dbname="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if test db exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{TEST_DB_NAME}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f"CREATE DATABASE {TEST_DB_NAME}")
            print(f"\n✅ Created test database: {TEST_DB_NAME}")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"\n⚠️ Warning setting up test DB (might already exist or permission error): {e}")

    # 2. Update Settings to point to test DB
    settings.POSTGRES_DB = TEST_DB_NAME
    # Verify the property update
    expected_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{TEST_DB_NAME}"
    
    # 3. Create Test Engine
    # Use NullPool to avoid connection pooling issues during tests
    test_engine = create_engine(expected_url, poolclass=NullPool)
    
    # 4. Reconfigure SessionLocal to use test engine
    # This affects all code importing SessionLocal
    SessionLocal.configure(bind=test_engine)
    
    # 5. Create Tables
    # Import all models to ensure they are registered with Base
    from app.infrastructure.database.models import (
        User, Client, Property, PropertyImage, Operation, OperationStatusHistory, 
        OperationNote, CalendarEvent, Visit, DomainEvent, ClientNote, PropertyNote, 
        VisitNote, PropertyStatusHistory
    )
    
    print("\n🏗️  Recreating tables in test database...")
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    
    yield
    
    # Cleanup (Optional: Drop tables or DB at the end)
    # Base.metadata.drop_all(bind=test_engine)
    # print("\n🧹 Dropped test database tables")

@pytest.fixture(scope="function")
def db_session(setup_test_database):
    """
    Yields a database session that rolls back after user usage.
    However, since existing tests use 'clean_clients_db' which commits/truncates, 
    we allow them to commit to the TEST DB.
    This fixture ensures we provide a session connected to the TEST DB.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# Override the app dependency
@pytest.fixture(scope="function", autouse=True)
def override_get_db(db_session):
    def _get_db_override():
        try:
            yield db_session
        finally:
            pass # Session is closed by the fixture
    
    app.dependency_overrides[get_db] = _get_db_override
    yield
    app.dependency_overrides.clear()
