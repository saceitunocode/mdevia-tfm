from abc import ABC, abstractmethod
from typing import BinaryIO, Optional

class StorageService(ABC):
    @abstractmethod
    async def upload(self, file: BinaryIO, filename: str, folder: Optional[str] = None) -> str:
        """
        Uploads a file and returns the storage key.
        """
        pass

    @abstractmethod
    async def delete(self, storage_key: str) -> bool:
        """
        Deletes a file from storage.
        """
        pass

    @abstractmethod
    def get_url(self, storage_key: str) -> str:
        """
        Returns the public URL for a storage key.
        """
        pass
