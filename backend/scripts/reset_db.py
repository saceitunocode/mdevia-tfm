import sys
from pathlib import Path

# Add backend root to path
sys.path.append(str(Path(__file__).parent.parent))

from app.infrastructure.database.base import Base
from app.infrastructure.database.session import engine

# Import all models to ensure they are registered with Base metadata
from app.infrastructure.database.models import *

def reset_db():
    print("🗑️  Resetting database (Drop & Create)...")
    
    dialect = engine.dialect.name
    print(f"   Detected dialect: {dialect}")
    
    with engine.begin() as connection:
        try:
            # Recreate everything
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            
            print("✨ Database recreated successfully!")
            
        except Exception as e:
            print(f"❌ Error resetting database: {e}")
            raise e

if __name__ == "__main__":
    reset_db()
