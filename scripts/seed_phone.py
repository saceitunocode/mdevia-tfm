import sys
import os
import uuid
sys.path.append(os.getcwd() + "/backend")

from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.user import User

def add_phone_to_agent():
    db = SessionLocal()
    try:
        # Buscar el agente Rafael Martinez
        agent = db.query(User).filter(User.full_name.ilike("%Rafael Martinez%")).first()
        if not agent:
            print("Agente no encontrado, buscando cualquiera...")
            agent = db.query(User).first()
        
        if agent:
            print(f"Agente encontrado: {agent.full_name}")
            print(f"Teléfono actual: {agent.phone_number}")
            
            agent.phone_number = "+34 600 123 456"
            db.commit()
            db.refresh(agent)
            print(f"Nuevo teléfono asignado: {agent.phone_number}")
        else:
            print("No se encontraron usuarios")

    finally:
        db.close()

if __name__ == "__main__":
    add_phone_to_agent()
