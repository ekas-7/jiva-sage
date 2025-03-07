import os
import uuid
import logging
import shutil
from typing import Optional, List
from fastapi import UploadFile

from app.core.config import settings

logger = logging.getLogger(__name__)

class FileStorage:
    """Service for handling temporary file storage"""
    
    @staticmethod
    async def save_upload(file: UploadFile, subfolder: str = "") -> str:
        """
        Save an uploaded file to temporary storage
        
        Args:
            file: The uploaded file
            subfolder: Optional subfolder within the temp directory
        
        Returns:
            Path to the saved file
        """
        try:
            # Create folder if it doesn't exist
            folder_path = settings.TEMP_FILE_PATH
            if subfolder:
                folder_path = os.path.join(folder_path, subfolder)
                os.makedirs(folder_path, exist_ok=True)
            
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(folder_path, unique_filename)
            
            # Save the file
            with open(file_path, "wb") as temp_file:
                content = await file.read()
                temp_file.write(content)
            
            logger.info(f"Saved file to {file_path}")
            return file_path
        
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise
    
    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Delete a file from temporary storage
        
        Args:
            file_path: Path to the file to delete
        
        Returns:
            True if successful, False otherwise
        """
        try:
            # Check if file exists
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file {file_path}")
                return True
            else:
                logger.warning(f"File {file_path} not found")
                return False
        
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
            return False
    
    @staticmethod
    def clean_temp_folder(subfolder: Optional[str] = None, max_age_hours: int = 24) -> int:
        """
        Clean up old files from temporary storage
        
        Args:
            subfolder: Optional subfolder to clean
            max_age_hours: Maximum age of files to keep in hours
        
        Returns:
            Number of files deleted
        """
        import time
        from datetime import datetime, timedelta
        
        try:
            # Determine folder to clean
            folder_path = settings.TEMP_FILE_PATH
            if subfolder:
                folder_path = os.path.join(folder_path, subfolder)
            
            # Skip if folder doesn't exist
            if not os.path.exists(folder_path):
                return 0
            
            # Calculate cutoff time
            cutoff_time = time.time() - (max_age_hours * 3600)
            
            # Track deleted files
            deleted_count = 0
            
            # Iterate through files and delete old ones
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                
                # Skip if not a file
                if not os.path.isfile(file_path):
                    continue
                
                # Check file age
                file_time = os.path.getmtime(file_path)
                if file_time < cutoff_time:
                    if FileStorage.delete_file(file_path):
                        deleted_count += 1
            
            logger.info(f"Cleaned {deleted_count} files from {folder_path}")
            return deleted_count
        
        except Exception as e:
            logger.error(f"Error cleaning temporary folder: {str(e)}")
            return 0