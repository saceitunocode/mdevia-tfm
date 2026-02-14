import pytest
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Client, Property, Operation, OperationNote, OperationStatusHistory
from app.domain.enums import ClientType, PropertyStatus, UserRole, OperationType, OperationStatus
from app.core.security import get_password_hash

# Fixture local para sesión DB
@pytest.fixture(scope="module")
def db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def test_operation_flow_lifecycle(db_session: Session):
    # 1. SETUP: Create Agent, Client (Buyer) and Property
    agent_id = uuid.uuid4()
    agent = User(
        id=agent_id,
        email=f"agent-ops-{agent_id}@test.com",
        password_hash=get_password_hash("securepass"),
        full_name="Agent Operations",
        role=UserRole.AGENT,
        is_active=True
    )
    db_session.add(agent)
    
    client_buyer_id = uuid.uuid4()
    client_buyer = Client(
        id=client_buyer_id,
        full_name="Buyer Client",
        email=f"buyer-{client_buyer_id}@test.com",
        type=ClientType.BUYER,
        responsible_agent_id=agent.id,
        phone="555-BUYER"
    )
    db_session.add(client_buyer)
    
    # Needs an owner for the property too
    client_owner_id = uuid.uuid4()
    client_owner = Client(
        id=client_owner_id,
        full_name="Owner Client",
        type=ClientType.OWNER,
        responsible_agent_id=agent.id,
        phone="555-OWNER"
    )
    db_session.add(client_owner)
    db_session.commit()

    prop_id = uuid.uuid4()
    prop = Property(
        id=prop_id,
        title="Luxury Apartment",
        address_line1="5th Avenue",
        city="Metropolis",
        sqm=200,
        rooms=3,
        status=PropertyStatus.AVAILABLE,
        owner_client_id=client_owner.id,
        captor_agent_id=agent.id
    )
    db_session.add(prop)
    db_session.commit()

    # 2. CREATE OPERATION (Interest Phase)
    op_id = uuid.uuid4()
    operation = Operation(
        id=op_id,
        type=OperationType.SALE,
        status=OperationStatus.INTEREST,
        client_id=client_buyer.id,
        property_id=prop.id,
        agent_id=agent.id
    )
    db_session.add(operation)
    db_session.commit()

    # Verify initial state
    loaded_op = db_session.get(Operation, op_id)
    assert loaded_op.status == OperationStatus.INTEREST
    assert loaded_op.property.title == "Luxury Apartment"
    assert loaded_op.client.full_name == "Buyer Client"

    # 3. ADD NOTES (Trazabilidad)
    note1 = OperationNote(
        operation_id=op_id,
        author_user_id=agent.id,
        text="Client is very interested, visited twice."
    )
    db_session.add(note1)
    db_session.commit()

    # 4. CHANGE STATUS & RECORD HISTORY (Negociación)
    # Simulator business logic: Change status -> Create History
    old_status = loaded_op.status
    new_status = OperationStatus.NEGOTIATION
    
    loaded_op.status = new_status
    history_entry = OperationStatusHistory(
        operation_id=op_id,
        from_status=old_status,
        to_status=new_status,
        changed_by_user_id=agent.id,
        note="Offer presented: 500k"
    )
    db_session.add(history_entry)
    db_session.commit()

    # 5. VERIFY COMPLETE STATE LOAD
    db_session.expire_all()
    final_op = db_session.get(Operation, op_id)
    
    # Check Status
    assert final_op.status == OperationStatus.NEGOTIATION
    
    # Check Notes
    assert len(final_op.notes) == 1
    assert final_op.notes[0].text == "Client is very interested, visited twice."
    assert final_op.notes[0].author.full_name == "Agent Operations"
    
    # Check History
    assert len(final_op.status_history) == 1
    assert final_op.status_history[0].from_status == OperationStatus.INTEREST
    assert final_op.status_history[0].to_status == OperationStatus.NEGOTIATION
    assert final_op.status_history[0].note == "Offer presented: 500k"

    # 6. CASCADE DELETE CHECK
    db_session.delete(final_op)
    db_session.commit()
    
    # Verify children are gone
    assert db_session.query(OperationNote).filter(OperationNote.operation_id == op_id).count() == 0
    assert db_session.query(OperationStatusHistory).filter(OperationStatusHistory.operation_id == op_id).count() == 0
    
    # Clean parents
    db_session.delete(prop)
    db_session.delete(client_buyer)
    db_session.delete(client_owner)
    db_session.delete(agent)
    db_session.commit()
