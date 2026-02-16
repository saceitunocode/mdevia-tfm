from sqlalchemy.orm import Session
from app.infrastructure.database.models import Client, ClientNote
from app.domain.enums import ClientType
import random

def seed_clients(db: Session, agents: list):
    print("🌱 Seeding Clients (12 total)...")
    clients_data = [
        {"full_name": "Carlos Mendoza García", "email": "carlos.mendoza@gmail.com", "phone": "600000001", "type": ClientType.BUYER, "notes": ["Busca piso céntrico", "Presupuesto máximo 300k"]},
        {"full_name": "Ana Belén Rodríguez Ruiz", "email": "ana.belen@outlook.com", "phone": "600000002", "type": ClientType.OWNER, "notes": ["Prefiere contacto por email", "Vende por traslado"]},
        {"full_name": "Luis Felipe Torres Soria", "email": "luis.torres@test.com", "phone": "600000003", "type": ClientType.TENANT, "notes": ["Necesita mudarse en 1 mes", "Tiene mascota"]},
        {"full_name": "Elena María Vázquez Santos", "email": "elena.vazquez@provider.es", "phone": "600000004", "type": ClientType.BUYER, "notes": ["Interesada en obra nueva", "Zona norte"]},
        {"full_name": "Roberto Carlos Jiménez Ortiz", "email": "roberto.jimenez@casa.com", "phone": "600000005", "type": ClientType.OWNER, "notes": ["Herederos, urge venta"]},
        {"full_name": "Marta Sofía Alarcón Prieto", "email": "marta.alarcon@mail.com", "phone": "600000006", "type": ClientType.BUYER, "notes": ["Primera vivienda", "Hipoteca preconcebida"]},
        {"full_name": "Javier Ignacio Soler Blanco", "email": "javier.soler@pro.com", "phone": "600000007", "type": ClientType.TENANT, "notes": ["Estudiante de máster", "Aval bancario disponible"]},
        {"full_name": "Carmen Lucía Morales Vega", "email": "carmen.morales@gestor.es", "phone": "600000008", "type": ClientType.OWNER, "notes": ["Inversora recurrente"]},
        {"full_name": "Diego Armando Ruiz Cano", "email": "diego.ruiz@vivienda.com", "phone": "600000009", "type": ClientType.BUYER, "notes": ["Busca ático con terraza"]},
        {"full_name": "Beatriz Eugenia Navarro Gil", "email": "beatriz.navarro@inmueble.com", "phone": "600000010", "type": ClientType.TENANT, "notes": ["Funcionaria", "Contrato indefinido"]},
        {"full_name": "Ricardo Gómez Marín", "email": "ricardo.gomez@empresa.com", "phone": "600000011", "type": ClientType.BUYER, "notes": ["Familia numerosa, necesita 4 hab"]},
        {"full_name": "Sonia Peña Castillo", "email": "sonia.pena@propietaria.es", "phone": "600000012", "type": ClientType.OWNER, "notes": ["Venta de local comercial"]}
    ]
    
    client_objects = []
    for c_data in clients_data:
        agent = random.choice(agents)
        db_client = db.query(Client).filter(Client.email == c_data["email"]).first()
        if not db_client:
            from datetime import datetime, timezone, timedelta
            client_created_at = datetime.now(timezone.utc) - timedelta(days=random.randint(2, 12))
            client = Client(
                full_name=c_data["full_name"],
                email=c_data["email"],
                phone=c_data["phone"],
                type=c_data["type"],
                responsible_agent_id=agent.id,
                is_active=True,
                created_at=client_created_at
            )
            db.add(client)
            db.flush() # Need ID for notes
            
            # Add Client Notes
            for note_text in c_data.get("notes", []):
                db.add(ClientNote(client_id=client.id, author_user_id=agent.id, text=note_text))
            
            client_objects.append(client)
        else:
            client_objects.append(db_client)
    db.commit()
    return client_objects
