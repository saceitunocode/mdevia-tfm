from sqlalchemy.orm import Session
from app.infrastructure.database.models import User
from app.domain.enums import UserRole
from app.core.security import get_password_hash

def seed_users(db: Session):
    print("🌱 Seeding Users...")
    users = [
        {"email": "faceituno@frinmobiliaria.com", "password": "admin123", "full_name": "Francisco Manuel Aceituno Jimenez", "role": UserRole.ADMIN},
        {"email": "mpoyatos@frinmobiliaria.com", "password": "admin123", "full_name": "Miguel Angel Poyatos Puentes", "role": UserRole.ADMIN},
        {"email": "saceituno@frinmobiliaria.com", "password": "agente123", "full_name": "Sergio Aceituno Jimenez", "role": UserRole.AGENT},
        {"email": "rmartinez@frinmobiliaria.com", "password": "agente123", "full_name": "Rafael Martinez Ruiz", "role": UserRole.AGENT}
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
            db.flush()
            user_objects.append(user)
            print(f"  ✅ Created user: {u_data['email']}")
        else:
            user_objects.append(db_user)
            print(f"  ⏭️ User already exists: {u_data['email']}")
    
    db.commit()
    return user_objects
