from typing import BinaryIO, Optional, Protocol
import uuid
from sqlalchemy.orm import Session
from app.domain.services.storage_service import StorageService
from app.infrastructure.database.models.property_image import PropertyImage
from app.infrastructure.repositories.property_image_repository import PropertyImageRepository

class PropertyImageUseCase:
    def __init__(self, storage_service: StorageService, repository: PropertyImageRepository):
        self.storage_service = storage_service
        self.repository = repository

    async def upload_image(
        self, 
        db: Session, 
        property_id: uuid.UUID, 
        file: BinaryIO, 
        filename: str,
        caption: Optional[str] = None,
        alt_text: Optional[str] = None,
        is_cover: bool = False
    ) -> PropertyImage:
        # 1. Determine if it's the first image
        count = self.repository.count_by_property(db, property_id)
        if count == 0:
            is_cover = True
        
        # 2. If it is a cover, unset other covers
        if is_cover:
            self.repository.unset_all_covers(db, property_id)
        
        # 3. Upload to storage
        # Path: properties/{property_id}
        folder = f"properties/{property_id}"
        storage_key = await self.storage_service.upload(file, filename, folder=folder)
        public_url = self.storage_service.get_url(storage_key)
        
        # 4. Save to DB
        image = PropertyImage(
            property_id=property_id,
            storage_key=storage_key,
            public_url=public_url,
            caption=caption,
            alt_text=alt_text,
            is_cover=is_cover,
            position=count # Add to the end
        )
        
        return self.repository.create(db, image)

    async def delete_image(self, db: Session, image_id: uuid.UUID) -> bool:
        image = self.repository.get_by_id(db, image_id)
        if not image:
            return False
        
        # 1. Delete from physical storage (Cloudinary or Local)
        try:
            await self.storage_service.delete(image.storage_key)
        except Exception as e:
            print(f"Error deleting file from storage: {e}")
            # We continue to mark as inactive in DB even if file delete fails
        
        # 2. Physical delete in DB
        self.repository.delete(db, image)
        
        return True

    async def set_cover_image(self, db: Session, property_id: uuid.UUID, image_id: uuid.UUID):
        image = self.repository.get_by_id(db, image_id)
        if not image or image.property_id != property_id:
            return False
        
        self.repository.set_as_cover(db, property_id, image_id)
        return True

    async def reorder_images(self, db: Session, property_id: uuid.UUID, image_ids: list[uuid.UUID]):
        # Just simple sequential update based on the list order
        for idx, img_id in enumerate(image_ids):
            self.repository.update_position(db, img_id, idx)
        return True
