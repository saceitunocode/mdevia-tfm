import sys
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add backend root to path
sys.path.append(str(Path(__file__).parent.parent))

from app.infrastructure.database.session import SessionLocal
from app.infrastructure.database.models import User, Property
from app.domain.enums import UserRole
from scripts.seed_data.users import seed_users
from scripts.seed_data.clients import seed_clients
from scripts.seed_data.stories import seed_stories
from scripts.seed_data.agenda import seed_dense_agenda

def run_seed():
    db = SessionLocal()
    try:
        # Reset Database (Optional, but good for idempotent runs if logic allows)
        # But here we usually just append or check existence.
        # The individual scripts check for existence.
        
        # 1. Users & Agents
        user_objects = seed_users(db)
        agents = [u for u in user_objects if u.role == UserRole.AGENT]
        if not agents: agents = user_objects # Fallback
        
        # 2. Clients (Depend on Agents)
        client_objects = seed_clients(db, agents)
        
        # 3. Stories (Properties + Visits + Operations) (Depend on Agents & Clients)
        seed_stories(db, agents, client_objects)
        
        # 4. Dense Agent (Filler Events) (Depend on Agents, Clients & Properties)
        # Need to query properties created or just pass them if returned.
        # seed_stories doesn't return list yet, let's just query.
        all_props = db.query(Property).all()
        seed_dense_agenda(db, agents, client_objects, all_props)
        
        print("\n✨ Database fully seeded via Orchestrated Modules!")
        
    except Exception as e:
        import traceback; traceback.print_exc(); db.rollback()
    finally: db.close()

if __name__ == "__main__":
    run_seed()
