import os
import re
from typing import Dict, Set

def get_model_columns() -> Dict[str, Set[str]]:
    models_dir = "app/infrastructure/database/models"
    model_columns = {}
    
    for filename in os.listdir(models_dir):
        if filename.endswith(".py") and not filename.startswith("__"):
            with open(os.path.join(models_dir, filename), "r") as f:
                content = f.read()
                
                # Find table name
                table_match = re.search(r'__tablename__\s*=\s*["\'](\w+)["\']', content)
                if not table_match:
                    continue
                table_name = table_match.group(1)
                
                # Find Column definitions
                columns = re.findall(r'(\w+)\s*=\s*Column\(', content)
                model_columns[table_name] = set(columns)
                
    return model_columns

def get_migration_columns() -> Dict[str, Set[str]]:
    versions_dir = "alembic/versions"
    migration_columns = {}
    
    for filename in os.listdir(versions_dir):
        if filename.endswith(".py"):
            with open(os.path.join(versions_dir, filename), "r") as f:
                content = f.read()
                
                # Find op.create_table
                create_matches = re.finditer(r'op\.create_table\(\s*["\'](\w+)["\'](.*?)\)', content, re.DOTALL)
                for match in create_matches:
                    table_name = match.group(1)
                    columns_content = match.group(2)
                    columns = re.findall(r'sa\.Column\(\s*["\'](\w+)["\']', columns_content)
                    if table_name not in migration_columns:
                        migration_columns[table_name] = set()
                    migration_columns[table_name].update(columns)
                
                # Find op.add_column
                add_matches = re.finditer(r'op\.add_column\(\s*["\'](\w+)["\']\s*,\s*sa\.Column\(\s*["\'](\w+)["\']', content)
                for match in add_matches:
                    table_name = match.group(1)
                    column_name = match.group(2)
                    if table_name not in migration_columns:
                        migration_columns[table_name] = set()
                    migration_columns[table_name].add(column_name)
                    
    return migration_columns

def audit():
    models = get_model_columns()
    migrations = get_migration_columns()
    
    print("--- Auditoría de Modelos vs Migraciones ---")
    all_missing = False
    for table, m_cols in models.items():
        mig_cols = migrations.get(table, set())
        missing = m_cols - mig_cols
        if missing:
            all_missing = True
            print(f"Tabla: {table}")
            print(f"  Columnas en Modelo pero NO en Migraciones: {missing}")
            
    if not all_missing:
        print("¡Todo parece estar en orden!")

if __name__ == "__main__":
    audit()
