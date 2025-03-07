import logging
import os
import uuid
import tempfile
from typing import Dict, Any, List
import fitz  # PyMuPDF
from PIL import Image
import io

from fastapi import UploadFile

from app.core.config import settings
from app.services.ocr.claude_service import ClaudeOCRService
from app.services.report_parser.report_mapper import ReportMapper

logger = logging.getLogger(__name__)

class PDFProcessor:
    """Processes PDF files for OCR by converting to images"""
    
    def __init__(self):
        """Initialize the PDF processor"""
        self.claude_service = ClaudeOCRService()
    
    async def process_pdf_file(self, file: UploadFile, phone_number: str) -> Dict[str, Any]:
        """
        Process a PDF file and extract lab report data
        
        Args:
            file: The uploaded PDF file
            phone_number: The user's phone number
        
        Returns:
            Extracted and standardized report data
        """
        try:
            # Create a temporary file path for the PDF
            temp_pdf_path = os.path.join(settings.TEMP_FILE_PATH, f"{uuid.uuid4()}.pdf")
            
            # Save the uploaded file
            with open(temp_pdf_path, "wb") as temp_file:
                content = await file.read()
                temp_file.write(content)
            
            logger.info(f"Saved uploaded PDF to {temp_pdf_path}")
            
            try:
                # Convert PDF to images
                image_paths = self._convert_pdf_to_images(temp_pdf_path)
                logger.info(f"Converted PDF to {len(image_paths)} images")
                
                # Process the first page for now
                # In a more complex implementation, we might process all pages and merge the results
                if image_paths:
                    # Extract data using Claude on the first page
                    extracted_data = await self.claude_service.process_image(image_paths[0])
                    
                    # Map to standard format
                    standardized_data = ReportMapper.map_to_standard_format(
                        extracted_data,
                        "PDF",
                        os.path.basename(file.filename),
                        phone_number
                    )
                    
                    return standardized_data
                else:
                    raise ValueError("Failed to convert PDF to images")
            
            finally:
                # Clean up the temporary files
                if os.path.exists(temp_pdf_path):
                    os.remove(temp_pdf_path)
                    logger.info(f"Removed temporary PDF file {temp_pdf_path}")
                
                # Remove temporary image files
                for img_path in image_paths:
                    if os.path.exists(img_path):
                        os.remove(img_path)
                        logger.info(f"Removed temporary image file {img_path}")
        
        except Exception as e:
            logger.error(f"Error processing PDF file: {str(e)}")
            raise
    
    def _convert_pdf_to_images(self, pdf_path: str, dpi: int = 300) -> List[str]:
        """
        Convert PDF to images
        
        Args:
            pdf_path: Path to the PDF file
            dpi: DPI for the output images
        
        Returns:
            List of paths to the created image files
        """
        image_paths = []
        
        try:
            # Open the PDF
            pdf_document = fitz.open(pdf_path)
            
            # Process each page
            for page_number in range(len(pdf_document)):
                # Get the page
                page = pdf_document.load_page(page_number)
                
                # Convert page to a pixmap (image)
                pix = page.get_pixmap(matrix=fitz.Matrix(dpi/72, dpi/72))
                
                # Create a file path for the image
                image_path = os.path.join(
                    settings.TEMP_FILE_PATH, 
                    f"{uuid.uuid4()}_page_{page_number + 1}.png"
                )
                
                # Save the pixmap as an image
                pix.save(image_path)
                
                # Add the image path to the list
                image_paths.append(image_path)
            
            return image_paths
        
        except Exception as e:
            logger.error(f"Error converting PDF to images: {str(e)}")
            # Clean up any images created before the error
            for img_path in image_paths:
                if os.path.exists(img_path):
                    os.remove(img_path)
            raise