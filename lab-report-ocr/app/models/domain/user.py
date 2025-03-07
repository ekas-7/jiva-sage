from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    """User domain model"""
    id: Optional[str] = Field(default=None, alias="_id")
    name: str
    phone_number: str
    email: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }