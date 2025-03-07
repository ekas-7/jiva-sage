import logging
import os
import uuid
from typing import Dict, Any, Optional

from fastapi import UploadFile

from app.core.config import settings
from app.services.ocr.claude_service import ClaudeOCRService
from app.services.report_parser.report_mapper import ReportMapper

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Processes image files for OCR"""
    
    def __init__(self):
        """Initialize the image processor"""
        self.claude_service = ClaudeOCRService()
    
    async def process_image_file(self, file: UploadFile, phone_number: str) -> Dict[str, Any]:
        """
        Process an image file and extract lab report data
        
        Args:
            file: The uploaded image file
            phone_number: The user's phone number
        
        Returns:
            Extracted and standardized report data
        """
        try:
            # Create a temporary file path
            temp_file_path = os.path.join(settings.TEMP_FILE_PATH, f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}")
            
            # Save the uploaded file
            with open(temp_file_path, "wb") as temp_file:
                content = await file.read()
                temp_file.write(content)
            
            logger.info(f"Saved uploaded image to {temp_file_path}")
            
            try:
                # Extract data using Claude
                extracted_data = await self.claude_service.process_image(temp_file_path)
                
                # Map to standard format
                standardized_data = ReportMapper.map_to_standard_format(
                    extracted_data, 
                    "Image", 
                    os.path.basename(file.filename), 
                    phone_number
                )
                
                return standardized_data
            
            finally:
                # Clean up the temporary file
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                    logger.info(f"Removed temporary file {temp_file_path}")
        
        except Exception as e:
            logger.error(f"Error processing image file: {str(e)}")
            raise