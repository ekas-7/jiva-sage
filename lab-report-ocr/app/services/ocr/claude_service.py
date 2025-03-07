import base64
import json
import logging
import os
from typing import Dict, Any, Optional

import anthropic
from langchain_anthropic import ChatAnthropic
from langchain.schema import HumanMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

class ClaudeOCRService:
    """Service to process lab report images using Claude's vision capabilities"""
    
    def __init__(self):
        """Initialize the Claude client"""
        self.client = ChatAnthropic(
            model=settings.CLAUDE_MODEL,
            anthropic_api_key=settings.ANTHROPIC_API_KEY,
            temperature=0
        )
        self.system_prompt = self._get_system_prompt()
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for Claude to process lab reports"""
        return """
        You are an OCR assistant specializing in extracting structured data from medical lab report images.
        
        Your task is to extract all relevant information from the lab report image and return it in a specific JSON format.
        
        Extract the following types of information:
        1. Lab information (name, registration number, contact details, signatories)
        2. Patient information (name, age, gender, ID, referred by)
        3. Collection information (dates and times)
        4. Test category and name
        5. All test results with values, units, and reference ranges
        6. Clinical notes if present
        7. Any metadata (page information, disclaimers)
        
        For each test result, indicate whether it's normal or abnormal based on the reference range.
        
        Return the data in the following JSON format:
        ```json
        {
          "report_info": {
            "lab_name": "",
            "lab_registration_number": "",
            "lab_contact": {
              "phone": "",
              "email": "",
              "website": "",
              "address": ""
            },
            "lab_signatories": [
              {
                "name": "",
                "qualification": "",
                "designation": ""
              }
            ],
            "instruments": ""
          },
          "patient_info": {
            "name": "",
            "age": null,
            "gender": "",
            "patient_id": "",
            "referred_by": "",
            "registration_number": ""
          },
          "collection_info": {
            "registered_on": "",
            "collected_on": "",
            "received_on": "",
            "reported_on": ""
          },
          "test_category": "",
          "test_name": "",
          "test_results": {},
          "clinical_notes": {
            "notes": "",
            "possible_causes": {}
          },
          "metadata": {
            "page_info": "",
            "disclaimer": "",
            "work_timings": ""
          }
        }
        ```
        
        For the test_results object, use a flexible structure based on the report format. Each test should have value, unit, reference_range, is_normal (boolean), and flag (if abnormal).
        
        Only extract information that is actually present in the image. If something is not present, either omit it or use null.
        
        Respond with ONLY the JSON. Do not include any explanations or descriptions.
        """
    
    async def process_image(self, image_path: str) -> Dict[str, Any]:
        """Process an image and extract lab report data"""
        try:
            # Read image file and encode as base64
            with open(image_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode("utf-8")
            
            # Create message with image
            user_message = HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": "Extract all data from this lab report and return it in the JSON format as instructed."
                    },
                    {
                        "type": "image",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            )
            
            # Get Claude's response
            response = self.client.invoke(
                [user_message],
                system=self.system_prompt
            )
            
            # Parse the JSON from the response
            response_text = response.content
            
            # Remove any markdown code block indicators
            response_text = response_text.replace("```json", "").replace("```", "").strip()
            
            # Parse the JSON
            extracted_data = json.loads(response_text)
            logger.info(f"Successfully extracted data from image: {image_path}")
            
            return extracted_data
        
        except Exception as e:
            logger.error(f"Error processing image with Claude: {str(e)}")
            raise
    
    async def process_pdf(self, pdf_data: bytes) -> Dict[str, Any]:
        """Process a PDF and extract lab report data"""
        # For PDFs, we'd use a PDF processing service to convert to images first
        # Then process each image with Claude
        # This is a placeholder for that logic
        raise NotImplementedError("PDF processing not yet implemented")