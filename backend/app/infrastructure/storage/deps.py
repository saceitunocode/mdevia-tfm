from app.domain.services.storage_service import StorageService
from app.infrastructure.storage.local_storage import LocalStorageService
from app.infrastructure.storage.cloudinary_storage import CloudinaryStorageService
from app.core.config import settings

def get_storage_service() -> StorageService:
    if settings.STORAGE_TYPE == "cloudinary":
        return CloudinaryStorageService()
    
    if settings.STORAGE_TYPE == "local":
        return LocalStorageService()
    
    # Default to local
    return LocalStorageService()
