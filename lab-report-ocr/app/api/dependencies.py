from fastapi import Header, HTTPException, Depends
from typing import Optional

from app.db.database import get_database
from app.core.config import settings


async def get_current_user(
    x_api_key: Optional[str] = Header(None),
    db = Depends(get_database)
):
    """
    Simple API key authentication
    
    This is a placeholder for more advanced authentication.
    In a production system, you would use OAuth2, JWT tokens, etc.
    """
    if not x_api_key:
        raise HTTPException(
            status_code=401,
            detail="API key is missing",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    
    # For demo purposes, we're using a simple API key check
    if x_api_key != settings.SECRET_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    
    # In a real application, you would look up the user associated with this API key
    # and return that user
    return {"is_authenticated": True}


async def validate_phone_number(phone_number: str):
    """
    Validate phone number format
    
    This is a simple validation that just checks if the phone number
    contains only digits, +, -, and spaces.
    """
    import re
    
    # Remove spaces, dashes, and parentheses
    cleaned_number = re.sub(r'[\s\-\(\)]', '', phone_number)
    
    # Check if the resulting string is a valid phone number
    # This is a simple pattern - for production, use a more robust library
    if not re.match(r'^\+?[0-9]{8,15}$', cleaned_number):
        raise HTTPException(
            status_code=400,
            detail="Invalid phone number format. Use international format like +1234567890"
        )
    
    return cleaned_number