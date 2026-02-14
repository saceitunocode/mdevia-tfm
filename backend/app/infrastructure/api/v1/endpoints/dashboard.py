from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, ConfigDict

from app.infrastructure.api.v1.deps import get_db, CurrentUser
from app.infrastructure.database.models import Property, Client, Visit, Operation
from app.domain.enums import VisitStatus, OperationStatus, PropertyStatus

router = APIRouter()


class DashboardStats(BaseModel):
    total_properties: int
    total_clients: int
    pending_visits: int
    active_operations: int
    available_properties: int
    sold_properties: int
    rented_properties: int


class UpcomingVisit(BaseModel):
    id: str
    client_name: str
    property_title: str
    scheduled_at: datetime
    status: str

    model_config = ConfigDict(from_attributes=True)


class RecentProperty(BaseModel):
    id: str
    title: str
    city: str
    price_amount: float | None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecentOperation(BaseModel):
    id: str
    type: str
    status: str
    client_name: str
    property_title: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardResponse(BaseModel):
    stats: DashboardStats
    upcoming_visits: list[UpcomingVisit]
    recent_properties: list[RecentProperty]
    recent_operations: list[RecentOperation]


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    current_user: CurrentUser,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get dashboard data: stats, upcoming visits, recent properties and operations.
    """
    # --- Stats ---
    total_properties = db.query(func.count(Property.id)).filter(Property.is_active == True).scalar() or 0
    available_properties = db.query(func.count(Property.id)).filter(
        Property.is_active == True, Property.status == PropertyStatus.AVAILABLE
    ).scalar() or 0
    sold_properties = db.query(func.count(Property.id)).filter(
        Property.is_active == True, Property.status == PropertyStatus.SOLD
    ).scalar() or 0
    rented_properties = db.query(func.count(Property.id)).filter(
        Property.is_active == True, Property.status == PropertyStatus.RENTED
    ).scalar() or 0
    total_clients = db.query(func.count(Client.id)).filter(Client.is_active == True).scalar() or 0
    pending_visits = db.query(func.count(Visit.id)).filter(Visit.status == VisitStatus.PENDING).scalar() or 0
    active_operations = db.query(func.count(Operation.id)).filter(
        Operation.status.in_([OperationStatus.INTEREST, OperationStatus.NEGOTIATION, OperationStatus.RESERVED])
    ).scalar() or 0

    stats = DashboardStats(
        total_properties=total_properties,
        total_clients=total_clients,
        pending_visits=pending_visits,
        active_operations=active_operations,
        available_properties=available_properties,
        sold_properties=sold_properties,
        rented_properties=rented_properties,
    )

    # --- Upcoming Visits (next 7 days, pending) ---
    now = datetime.now(timezone.utc)
    week_ahead = now + timedelta(days=7)

    upcoming_rows = (
        db.query(Visit, Client.full_name, Property.title)
        .join(Client, Visit.client_id == Client.id)
        .join(Property, Visit.property_id == Property.id)
        .filter(
            Visit.status == VisitStatus.PENDING,
            Visit.scheduled_at >= now,
            Visit.scheduled_at <= week_ahead,
        )
        .order_by(Visit.scheduled_at.asc())
        .limit(5)
        .all()
    )

    upcoming_visits = [
        UpcomingVisit(
            id=str(visit.id),
            client_name=client_name,
            property_title=property_title,
            scheduled_at=visit.scheduled_at,
            status=visit.status.value,
        )
        for visit, client_name, property_title in upcoming_rows
    ]

    # --- Recent Properties (last 5 created) ---
    recent_props = (
        db.query(Property)
        .filter(Property.is_active == True)
        .order_by(Property.created_at.desc())
        .limit(5)
        .all()
    )

    recent_properties = [
        RecentProperty(
            id=str(p.id),
            title=p.title,
            city=p.city,
            price_amount=float(p.price_amount) if p.price_amount else None,
            status=p.status.value,
            created_at=p.created_at,
        )
        for p in recent_props
    ]

    # --- Recent Operations (last 5) ---
    recent_ops = (
        db.query(Operation, Client.full_name, Property.title)
        .join(Client, Operation.client_id == Client.id)
        .join(Property, Operation.property_id == Property.id)
        .order_by(Operation.created_at.desc())
        .limit(5)
        .all()
    )

    recent_operations = [
        RecentOperation(
            id=str(op.id),
            type=op.type.value,
            status=op.status.value,
            client_name=client_name,
            property_title=property_title,
            created_at=op.created_at,
        )
        for op, client_name, property_title in recent_ops
    ]

    return DashboardResponse(
        stats=stats,
        upcoming_visits=upcoming_visits,
        recent_properties=recent_properties,
        recent_operations=recent_operations,
    )
