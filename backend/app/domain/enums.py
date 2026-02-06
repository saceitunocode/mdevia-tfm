from enum import Enum

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    AGENT = "AGENT"

class ClientType(str, Enum):
    BUYER = "BUYER"
    TENANT = "TENANT"
    OWNER = "OWNER"

class PropertyStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    SOLD = "SOLD"
    RENTED = "RENTED"

class VisitStatus(str, Enum):
    PENDING = "PENDING"
    DONE = "DONE"
    CANCELLED = "CANCELLED"

class EventType(str, Enum):
    VISIT = "VISIT"
    NOTE = "NOTE"
    CAPTATION = "CAPTATION"
    REMINDER = "REMINDER"

class EventStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"

class OperationType(str, Enum):
    SALE = "SALE"
    RENT = "RENT"

class OperationStatus(str, Enum):
    INTEREST = "INTEREST"
    NEGOTIATION = "NEGOTIATION"
    RESERVED = "RESERVED"
    CLOSED = "CLOSED"
    CANCELLED = "CANCELLED"
