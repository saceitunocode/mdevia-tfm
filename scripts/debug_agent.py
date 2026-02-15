import sys
import os
import uuid
sys.path.append(os.getcwd() + "/backend")

from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models.property import Property
from app.infrastructure.database.models.user import User
from app.domain.schemas.property import PropertyPublic
from sqlalchemy.orm import joinedload
from sqlalchemy import text

PROPERTY_ID = "6dc73202-3bfe-471c-8b79-8a06c7191891"

def check_property_agent():
    db = SessionLocal()
    try:
        print("\n--- Verificando Propiedad ---")
        try:
            prop_uuid = uuid.UUID(PROPERTY_ID)
        except ValueError:
            print(f"Error: ID {PROPERTY_ID} no es un UUID válido. Buscando cualquier propiedad...")
            prop = db.query(Property).first()
            if prop:
                prop_uuid = prop.id
                print(f"Usando propiedad alternativa: {prop_uuid}")
            else:
                print("No se encontraron propiedades.")
                return

        prop = db.query(Property).options(
            joinedload(Property.captor_agent)
        ).filter(Property.id == prop_uuid).first()

        if not prop:
            print(f"Propiedad {prop_uuid} no encontrada.")
            
            # Listar todas para ver qué hay
            all_props = db.query(Property.id, Property.title).limit(5).all()
            print("Algunas propiedades disponibles:", all_props)
            return

        print(f"Propiedad encontrada: {prop.title}")
        print(f"Captor Agent ID: {prop.captor_agent_id}")
        
        if prop.captor_agent:
            print(f"Captor Agent Object: {prop.captor_agent}")
            print(f"Agent Name: {prop.captor_agent.full_name}")
            print(f"Agent Email: {prop.captor_agent.email}")
        else:
            print("Captor Agent es None en la relación ORM.")
            # Verificar si existe el ID en la tabla usuarios manualmente
            if prop.captor_agent_id:
                user = db.query(User).filter(User.id == prop.captor_agent_id).first()
                if user:
                    print(f"Usuario existe en DB pero no cargó en relación: {user.email}, {user.full_name}")
                else:
                    print("Usuario NO existe en la base de datos (clave foránea rota o usuario borrado sin cascada?)")

        print("\n--- Probando Esquema Pydantic PropertyPublic ---")
        try:
            prop_public = PropertyPublic.model_validate(prop)
            print("Validación Pydantic exitosa.")
            print(f"Datos exportados: {prop_public.model_dump(include={'captor_agent'})}")
        except Exception as e:
            print(f"Error validando Pydantic: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    check_property_agent()
