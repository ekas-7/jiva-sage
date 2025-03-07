import logging
from typing import Dict, List, Optional, Any, Union

from app.db.repositories.base import BaseRepository
from app.models.domain.user import User

logger = logging.getLogger(__name__)

class UserRepository(BaseRepository):
    """
    Repository for users
    """
    
    def __init__(self, db):
        """
        Initialize the repository with the database connection
        """
        super().__init__("users", db)
    
    async def find_by_phone(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """
        Find a user by phone number
        """
        return await self.collection.find_one({"phone_number": phone_number})
    
    async def find_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Find a user by email
        """
        return await self.collection.find_one({"email": email})
    
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """
        Create a new user
        """
        # Check if user already exists with this phone number
        existing_user = await self.find_by_phone(user_data["phone_number"])
        if existing_user:
            logger.warning(f"User with phone number {user_data['phone_number']} already exists")
            return str(existing_user["_id"])
        
        # If email is provided, check if it already exists
        if "email" in user_data and user_data["email"]:
            existing_user = await self.find_by_email(user_data["email"])
            if existing_user:
                logger.warning(f"User with email {user_data['email']} already exists")
                return str(existing_user["_id"])
        
        # Create new user
        return await self.create(user_data)
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """
        Update user information
        """
        # If email is being updated, check if it already exists
        if "email" in update_data and update_data["email"]:
            existing_user = await self.find_by_email(update_data["email"])
            if existing_user and str(existing_user["_id"]) != user_id:
                logger.warning(f"Cannot update user: email {update_data['email']} already in use")
                return False
        
        # If phone number is being updated, check if it already exists
        if "phone_number" in update_data and update_data["phone_number"]:
            existing_user = await self.find_by_phone(update_data["phone_number"])
            if existing_user and str(existing_user["_id"]) != user_id:
                logger.warning(f"Cannot update user: phone number {update_data['phone_number']} already in use")
                return False
        
        # Update the user
        return await self.update(user_id, update_data)
    
    async def find_users_by_name(self, name: str, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Find users by name (partial match)
        """
        return await self.find_by_query(
            query={"name": {"$regex": name, "$options": "i"}},
            skip=skip,
            limit=limit
        )