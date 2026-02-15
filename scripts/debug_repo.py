import sys
import os
import uuid
sys.path.append(os.getcwd() + "/backend")

from app.infrastructure.database.session import SessionLocal
from app.infrastructure.repositories.property_repository import PropertyRepository
from app.domain.schemas.property import PropertyPublic

PROPERTY_ID = "6dc73202-3bfe-471c-8b79-8a06c7191891"

def check_property_repo():
    db = SessionLocal()
    repo = PropertyRepository()
    try:
        print("\n--- Verificando Repositorio ---")
        try:
            prop_uuid = uuid.UUID(PROPERTY_ID)
        except ValueError:
            print("ID inválido")
            return

        # Usar el método REAL del repositorio
        prop = repo.get_by_id(db=db, property_id=prop_uuid)

        if not prop:
            print(f"Propiedad {prop_uuid} no encontrada por repo.")
            return

        print(f"Propiedad encontrada: {prop.title}")
        print(f"Captor Agent Relation Loaded? {prop.captor_agent is not None}")
        
        if prop.captor_agent:
            print(f"Agent Name: {prop.captor_agent.full_name}")
            print(f"Agent Email: {prop.captor_agent.email}")
            
        print("\n--- Validando Pydantic ---")
        prop_public = PropertyPublic.model_validate(prop)
        print(f"Dump Pydantic: {prop_public.model_dump(include={'captor_agent'})}")

    finally:
        db.close()

if __name__ == "__main__":
    check_property_repo()
