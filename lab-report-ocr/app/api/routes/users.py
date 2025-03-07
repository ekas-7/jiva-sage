import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from bson import ObjectId
from pymongo import DESCENDING

from app.db.database import get_database
from app.models.schemas.user import (
    UserCreate, 
    UserResponse, 
    UserUpdate,
    UserListResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db = Depends(get_database)
):
    """
    Create a new user
    """
    try:
        # Check if phone number already exists
        existing_user = await db.users.find_one({"phone_number": user.phone_number})
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=f"User with phone number {user.phone_number} already exists"
            )
        
        # Insert user
        user_dict = user.model_dump()
        result = await db.users.insert_one(user_dict)
        
        # Get created user
        created_user = await db.users.find_one({"_id": result.inserted_id})
        created_user["id"] = str(created_user.pop("_id"))
        
        return created_user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )


@router.get("/", response_model=UserListResponse)
async def get_users(
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
    name: Optional[str] = None,
    db = Depends(get_database)
):
    """
    Get all users with optional filtering
    """
    try:
        # Build query
        query = {}
        if name:
            query["name"] = {"$regex": name, "$options": "i"}
        
        # Get total count
        total = await db.users.count_documents(query)
        
        # Get users
        cursor = db.users.find(query).sort("_id", DESCENDING).skip(skip).limit(limit)
        
        # Convert to list and format for response
        users = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            users.append(doc)
        
        # Return response
        return {
            "users": users,
            "total": total
        }
    
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving users: {str(e)}"
        )


@router.get("/by-phone/{phone_number}", response_model=UserResponse)
async def get_user_by_phone(
    phone_number: str,
    db = Depends(get_database)
):
    """
    Get a specific user by phone number
    """
    try:
        # Get user
        user = await db.users.find_one({"phone_number": phone_number})
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User with phone number {phone_number} not found"
            )
        
        # Format for response
        user["id"] = str(user.pop("_id"))
        
        return user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving user: {str(e)}"
        )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    db = Depends(get_database)
):
    """
    Get a specific user by ID
    """
    try:
        # Convert string ID to ObjectId
        oid = ObjectId(user_id)
        
        # Get user
        user = await db.users.find_one({"_id": oid})
        
        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User with ID {user_id} not found"
            )
        
        # Format for response
        user["id"] = str(user.pop("_id"))
        
        return user
    
    except Exception as e:
        logger.error(f"Error retrieving user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving user: {str(e)}"
        )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    db = Depends(get_database)
):
    """
    Update a specific user by ID
    """
    try:
        # Convert string ID to ObjectId
        oid = ObjectId(user_id)
        
        # Check if user exists
        existing_user = await db.users.find_one({"_id": oid})
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail=f"User with ID {user_id} not found"
            )
        
        # Update user
        update_data = user_update.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No fields to update"
            )
        
        await db.users.update_one({"_id": oid}, {"$set": update_data})
        
        # Get updated user
        updated_user = await db.users.find_one({"_id": oid})
        updated_user["id"] = str(updated_user.pop("_id"))
        
        return updated_user
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error updating user: {str(e)}"
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db = Depends(get_database)
):
    """
    Delete a specific user by ID
    """
    try:
        # Convert string ID to ObjectId
        oid = ObjectId(user_id)
        
        # Delete user
        result = await db.users.delete_one({"_id": oid})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"User with ID {user_id} not found"
            )
        
        return JSONResponse(
            status_code=200,
            content={"message": f"User with ID {user_id} deleted successfully"}
        )
    
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting user: {str(e)}"
        )