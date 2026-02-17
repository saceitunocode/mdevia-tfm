import os
import uuid
import shutil
from typing import BinaryIO, Optional
from pathlib import Path
from PIL import Image
from app.domain.services.storage_service import StorageService
from app.core.config import settings

class LocalStorageService(StorageService):
    def __init__(self):
        self.base_path = Path(settings.STORAGE_LOCAL_PATH)
        if not self.base_path.is_absolute():
            # If relative, use current working directory (backend root)
            self.base_path = Path(os.getcwd()) / self.base_path
        
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.base_url = settings.STORAGE_BASE_URL.rstrip("/")

    async def upload(self, file: BinaryIO, filename: str, folder: Optional[str] = None) -> str:
        # 1. Prepare Paths
        folder_path = self.base_path
        if folder:
            folder_path = folder_path / folder
        folder_path.mkdir(parents=True, exist_ok=True)

        # 2. Generate Unique Filename (WebP)
        file_uuid = uuid.uuid4()
        storage_filename = f"{file_uuid}.webp"
        storage_path = folder_path / storage_filename
        
        # 3. Process Image with Pillow
        try:
            # Reset file pointer if needed (though usually okay)
            file.seek(0)
            with Image.open(file) as img:
                # Convert to RGB if necessary (e.g. RGBA -> RGB for WebP if preferred, 
                # though WebP supports alpha, JPEG doesn't. We use WebP so alpha is fine.
                # But for standard property images, RGB is safer/smaller)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if larger than 1920px width
                max_width = 1920
                if img.width > max_width:
                    ratio = max_width / float(img.width)
                    new_height = int(float(img.height) * float(ratio))
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as WebP
                img.save(storage_path, "WEBP", quality=85, optimize=True)
                
            # Returning the relative key
            relative_key = f"{folder}/{storage_filename}" if folder else storage_filename
            return relative_key
            
        except Exception as e:
            # In case of error, ensuring we don't leave partial files if they were created
            if storage_path.exists():
                storage_path.unlink()
            raise RuntimeError(f"Error processing image: {str(e)}")

    async def delete(self, storage_key: str) -> bool:
        full_path = self.base_path / storage_key
        try:
            if full_path.exists():
                full_path.unlink()
                return True
            return False
        except Exception:
            return False

    def get_url(self, storage_key: str) -> str:
        return f"{self.base_url}/{storage_key}"
