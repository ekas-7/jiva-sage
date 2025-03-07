from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


# Base User Schema
class UserBase(BaseModel):
    """Base user schema with common attributes"""
    name: str
    phone_number: str
    email: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[List[str]] = None
    allergies: Optional[List[str]] = None


# Schema for creating a new user
class UserCreate(UserBase):
    """Schema for creating a new user"""
    pass


# Schema for updating a user
class UserUpdate(BaseModel):
    """Schema for updating a user"""
    name: Optional[str] = None
    email: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[List[str]] = None
    allergies: Optional[List[str]] = None


# Schema for user response
class UserResponse(UserBase):
    """Schema for user response"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Schema for list of users response
class UserListResponse(BaseModel):
    """Schema for list of users response"""
    users: List[UserResponse]
    total: int