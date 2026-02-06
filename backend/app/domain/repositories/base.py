from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List

T = TypeVar("T")

class BaseRepository(ABC, Generic[T]):
    @abstractmethod
    def get_by_id(self, id: Any) -> Optional[T]:
        pass

    @abstractmethod
    def get_all(self) -> List[T]:
        pass

    @abstractmethod
    def create(self, entity: T) -> T:
        pass
