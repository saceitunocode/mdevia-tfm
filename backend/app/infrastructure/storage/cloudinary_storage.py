import cloudinary
import cloudinary.uploader
import asyncio
from functools import partial
from typing import BinaryIO, Optional
from app.core.config import settings
from app.domain.services.storage_service import StorageService

class CloudinaryStorageService(StorageService):
    def __init__(self):
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )

    async def upload(self, file: BinaryIO, filename: str, folder: Optional[str] = None) -> str:
        # 1. Prepare folder
        full_folder = settings.CLOUDINARY_FOLDER
        if folder:
            full_folder = f"{full_folder}/{folder}"
        
        # 2. Upload (Cloudinary SDK is sync, so we run it in a thread pool)
        print(f"DEBUG: Cloudinary Uploading file {filename} to {full_folder}")
        
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.get_event_loop()

        upload_func = partial(
            cloudinary.uploader.upload,
            file,
            folder=full_folder,
            resource_type="image",
            overwrite=True,
            unique_filename=True
        )
        
        try:
            result = await loop.run_in_executor(None, upload_func)
            print(f"DEBUG: Cloudinary Upload Success: {result.get('public_id')}")
            return result["public_id"]
        except Exception as e:
            print(f"DEBUG: Cloudinary Upload Error: {str(e)}")
            raise e

    async def delete(self, storage_key: str) -> bool:
        print(f"DEBUG: Cloudinary Deleting {storage_key}")
        
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = asyncio.get_event_loop()
            
        destroy_func = partial(cloudinary.uploader.destroy, storage_key)
        
        try:
            result = await loop.run_in_executor(None, destroy_func)
            success = result.get("result") == "ok"
            print(f"DEBUG: Cloudinary Delete Result for {storage_key}: {success}")
            return success
        except Exception as e:
            print(f"DEBUG: Cloudinary Delete Error for {storage_key}: {str(e)}")
            return False

    def get_url(self, storage_key: str) -> str:
        # storage_key here is the public_id
        transformations = [
            {'width': 1920, 'crop': "limit", 'quality': "auto", 'fetch_format': "auto"}
        ]
        
        # Add watermark if configured
        if settings.CLOUDINARY_WATERMARK_ID:
            transformations.append({
                'overlay': settings.CLOUDINARY_WATERMARK_ID.replace("/", ":"), # Replacing / with : is sometimes needed for nested IDs in overlays
                'gravity': "south_east",
                'width': 250,      # Size in pixels
                'opacity': 50,     # Percentage
                'x': 20, 'y': 20   # Margins
            })
            
            # Note: For nested public IDs in overlays, Cloudinary sometimes requires 
            # replacing "/" with ":" or using the public ID directly depending on the version.
            # Usually the public ID works directly. Let's try direct first but safe-guard with a comment.

        return cloudinary.CloudinaryImage(storage_key).build_url(
            secure=True,
            transformation=transformations
        )
