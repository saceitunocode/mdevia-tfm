import sys
import os
from pathlib import Path

# Añadir el raíz del backend al path para que reconozca el paquete 'app'
sys.path.append(str(Path(__file__).parent.parent))

import uuid
from decimal import Decimal
from sqlalchemy.orm import Session
from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.user import User
from app.infrastructure.database.models.client import Client
from app.infrastructure.database.models.property import Property
from app.domain.enums import UserRole, ClientType, PropertyStatus
from app.core.security import get_password_hash

def seed_users(db: Session):
    print("🌱 Seeding Users...")
    users = [
        {
            "email": "admin@mdevia.com",
            "password": "admin123",
            "full_name": "Administrador Sistema",
            "role": UserRole.ADMIN
        },
        {
            "email": "agente1@mdevia.com",
            "password": "agente123",
            "full_name": "Juan Agente",
            "role": UserRole.AGENT
        },
        {
            "email": "agente2@mdevia.com",
            "password": "agente123",
            "full_name": "Maria Agente",
            "role": UserRole.AGENT
        }
    ]
    
    user_objects = []
    for u_data in users:
        db_user = db.query(User).filter(User.email == u_data["email"]).first()
        if not db_user:
            user = User(
                email=u_data["email"],
                password_hash=get_password_hash(u_data["password"]),
                full_name=u_data["full_name"],
                role=u_data["role"],
                is_active=True
            )
            db.add(user)
            db.flush() # Para tener el ID disponible
            user_objects.append(user)
            print(f"  ✅ Created user: {u_data['email']}")
        else:
            user_objects.append(db_user)
            print(f"  ⏭️ User already exists: {u_data['email']}")
    
    db.commit()
    return user_objects

def seed_clients(db: Session, agents: list):
    print("🌱 Seeding Clients...")
    clients = [
        {"full_name": "Carlos Comprador", "email": "carlos@gmail.com", "phone": "600111222", "type": ClientType.BUYER},
        {"full_name": "Ana Vendedora", "email": "ana@outlook.com", "phone": "600333444", "type": ClientType.OWNER},
        {"full_name": "Luis Inquilino", "email": "luis@test.com", "phone": "600555666", "type": ClientType.TENANT},
        {"full_name": "Elena Mixta", "email": "elena@provider.es", "phone": "600777888", "type": ClientType.BUYER},
        {"full_name": "Roberto Dueño", "email": "roberto@casa.com", "phone": "600999000", "type": ClientType.OWNER},
    ]
    
    client_objects = []
    for i, c_data in enumerate(clients):
        db_client = db.query(Client).filter(Client.email == c_data["email"]).first()
        if not db_client:
            client = Client(
                full_name=c_data["full_name"],
                email=c_data["email"],
                phone=c_data["phone"],
                type=c_data["type"],
                responsible_agent_id=agents[i % len(agents)].id
            )
            db.add(client)
            db.flush()
            client_objects.append(client)
            print(f"  ✅ Created client: {c_data['full_name']}")
        else:
            client_objects.append(db_client)
            print(f"  ⏭️ Client already exists: {c_data['full_name']}")
            
    db.commit()
    return client_objects

def seed_properties(db: Session, agents: list, clients: list):
    print("🌱 Seeding Properties...")
    # Filtrar solo clientes que pueden ser propietarios (OWNER)
    owners = [c for c in clients if c.type == ClientType.OWNER]
    if not owners:
        owners = clients # Fallback si no hay específicos

    properties_data = [
        {"title": "Piso Luminoso en el Centro", "public_description": "3 habitaciones, reformado.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("250000.00"), "address_line1": "Calle Mayor 1", "city": "Madrid", "sqm": 90, "rooms": 3},
        {"title": "Chalet con Jardín", "public_description": "Gran jardín y piscina privada.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("450000.00"), "address_line1": "Av. Sauces 45", "city": "Las Rozas", "sqm": 250, "rooms": 5},
        {"title": "Estudio Moderno", "public_description": "Ideal para inversión.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("120000.00"), "address_line1": "Calle Luna 12", "city": "Madrid", "sqm": 35, "rooms": 1},
        {"title": "Ático con Vistas", "public_description": "Terraza de 40m2.", "status": PropertyStatus.SOLD, "price_amount": Decimal("320000.00"), "address_line1": "Calle Rio 4", "city": "Madrid", "sqm": 110, "rooms": 3},
        {"title": "Local Comercial", "public_description": "A pie de calle.", "status": PropertyStatus.RENTED, "price_amount": Decimal("1500.00"), "address_line1": "Calle Real 8", "city": "Alcorcón", "sqm": 80, "rooms": 1},
        {"title": "Apartamento en la Playa", "public_description": "Primera línea de mar.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("180000.00"), "address_line1": "Paseo Marítimo 22", "city": "Valencia", "sqm": 65, "rooms": 2},
        {"title": "Casa de Campo", "public_description": "Entorno tranquilo y natural.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("210000.00"), "address_line1": "Camino Viejo s/n", "city": "Chinchón", "sqm": 150, "rooms": 4},
        {"title": "Oficina Céntrica", "public_description": "Reformada y equipada.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("1200.00"), "address_line1": "Gran Vía 15", "city": "Madrid", "sqm": 120, "rooms": 4},
        {"title": "Duplex Exclusivo", "public_description": "Acabados de lujo.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("550000.00"), "address_line1": "Calle Serrano 100", "city": "Madrid", "sqm": 180, "rooms": 4},
        {"title": "Garaje Amplio", "public_description": "Fácil acceso.", "status": PropertyStatus.AVAILABLE, "price_amount": Decimal("15000.00"), "address_line1": "Calle Pez 2", "city": "Madrid", "sqm": 15, "rooms": 0},
    ]
    
    for i, p_data in enumerate(properties_data):
        db_prop = db.query(Property).filter(Property.title == p_data["title"]).first()
        if not db_prop:
            prop = Property(
                title=p_data["title"],
                public_description=p_data["public_description"],
                status=p_data["status"],
                price_amount=p_data["price_amount"],
                address_line1=p_data["address_line1"],
                city=p_data["city"],
                sqm=p_data["sqm"],
                rooms=p_data["rooms"],
                captor_agent_id=agents[i % len(agents)].id,
                owner_client_id=owners[i % len(owners)].id
            )
            db.add(prop)
            print(f"  ✅ Created property: {p_data['title']}")
        else:
            print(f"  ⏭️ Property already exists: {p_data['title']}")
            
    db.commit()

def run_seed():
    db = SessionLocal()
    try:
        users = seed_users(db)
        # Filtramos solo los agentes para asignar responsabilidades
        agent_users = [u for u in users if u.role == UserRole.AGENT]
        
        # Si no hay agentes creados (todos son admin o ya existían), cogemos todos los que tengan rol AGENT
        if not agent_users:
            agent_users = db.query(User).filter(User.role == UserRole.AGENT).all()
            
        clients = seed_clients(db, agent_users)
        seed_properties(db, agent_users, clients)
        
        print("\n✨ Database successfully seeded!")
    except Exception as e:
        import traceback
        print(f"\n❌ Error seeding database: {e}")
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
