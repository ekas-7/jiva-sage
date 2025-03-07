import base64
import json
import logging
import os
import asyncio
import re
from typing import Dict, Any, Optional

import anthropic
from app.core.config import settings

logger = logging.getLogger(__name__)

# Valid Claude models with vision capabilities
VALID_CLAUDE_MODELS = [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307"
]

class ClaudeOCRService:
    """Service to process lab report images using Claude's vision capabilities"""
    
    def __init__(self):
        """Initialize the Claude client using direct Anthropic API"""
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        # Ensure we're using a valid model
        self.model = self._get_valid_model()
        logger.info(f"Using Claude model: {self.model}")
        
        self.system_prompt = self._get_system_prompt()
    
    def _get_valid_model(self) -> str:
        """Get a valid Claude model name, falling back to a known working model if necessary"""
        configured_model = settings.CLAUDE_MODEL
        
        # If the configured model is in our known valid list, use it
        if configured_model in VALID_CLAUDE_MODELS:
            return configured_model
        
        # Otherwise, default to a known working model
        logger.warning(f"Model '{configured_model}' may not be valid. Falling back to claude-3-sonnet-20240229")
        return "claude-3-sonnet-20240229"
    
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
        
        Return ONLY valid, syntactically correct JSON. Be extremely careful with JSON syntax - ensure all quotes, commas, and brackets are properly placed.
        
        Follow this exact structure:
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
        
        Response must be ONLY the JSON. Do not include any explanations, markdown code blocks, or descriptions. The JSON must be syntactically valid.
        """
    
    def _fix_json(self, json_str: str) -> str:
        """
        Fix common JSON syntax errors
        
        Args:
            json_str: Potentially broken JSON string
            
        Returns:
            Fixed JSON string
        """
        # Log the first part of the original string for debugging
        logger.debug(f"Original JSON string (first 200 chars): {json_str[:200]}...")
        
        # Remove any markdown code block markers
        json_str = json_str.replace("```json", "").replace("```", "").strip()
        
        # Attempt to extract JSON if surrounded by other text
        json_match = re.search(r'(\{.*\})', json_str, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        
        # Fix common JSON syntax errors:
        # 1. Fix trailing commas in objects
        json_str = re.sub(r',(\s*})', r'\1', json_str)
        
        # 2. Fix trailing commas in arrays
        json_str = re.sub(r',(\s*\])', r'\1', json_str)
        
        # 3. Fix missing quotes around property names
        json_str = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)', r'\1"\2"\3', json_str)
        
        # 4. Fix single quotes used instead of double quotes
        # This is tricky and might cause issues, so only do it if absolutely necessary
        if '"' not in json_str and "'" in json_str:
            json_str = json_str.replace("'", '"')
        
        # 5. Fix missing commas between properties
        # json_str = re.sub(r'(["]}])\s*(["[{a-zA-Z_])', r'\1,\2', json_str)
        
        # Log the fixed string for debugging
        logger.debug(f"Fixed JSON string (first 200 chars): {json_str[:200]}...")
        
        return json_str
    
    def _create_default_structure(self) -> Dict[str, Any]:
        """Create a default structure with all required fields"""
        return {
            "report_info": {
                "lab_name": "Unknown Laboratory",
                "lab_registration_number": "",
                "lab_contact": {
                    "phone": "",
                    "email": "",
                    "website": "",
                    "address": ""
                },
                "lab_signatories": []
            },
            "patient_info": {
                "name": "",
                "age": None,
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
            "test_category": "HAEMATOLOGY",
            "test_name": "COMPLETE BLOOD COUNT",
            "test_results": {},
            "clinical_notes": {
                "notes": "",
                "possible_causes": {}
            },
            "metadata": {
                "page_info": "",
                "disclaimer": "",
                "work_timings": "",
                "report_type": "CBC"
            }
        }
    
    async def process_image(self, image_path: str) -> Dict[str, Any]:
        """Process an image and extract lab report data"""
        try:
            # Determine file type from extension
            if image_path.lower().endswith(('.jpg', '.jpeg')):
                media_type = "image/jpeg"
            elif image_path.lower().endswith('.png'):
                media_type = "image/png"
            else:
                media_type = "image/jpeg"  # Default to JPEG
            
            # Read image file and encode as base64
            with open(image_path, "rb") as image_file:
                image_bytes = image_file.read()
                base64_encoded = base64.b64encode(image_bytes).decode('utf-8')
            
            logger.info(f"Processing image: {image_path} as {media_type}")
            
            # Create message content for API call
            message_content = [
                {
                    "type": "text",
                    "text": "Extract all data from this lab report and return it as valid JSON according to the specified format. Ensure the JSON is syntactically correct with proper quotes, commas, and brackets."
                },
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": base64_encoded
                    }
                }
            ]

            # Make the API call using a thread pool to avoid blocking the event loop
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.client.messages.create(
                    model=self.model,
                    max_tokens=4096,
                    temperature=0,
                    system=self.system_prompt,
                    messages=[{"role": "user", "content": message_content}]
                )
            )
            
            # Extract the response text
            response_text = response.content[0].text
            
            # Log a sample of the response for debugging
            logger.debug(f"Claude response (first 500 chars): {response_text[:500]}...")
            
            # Try to fix and parse the JSON
            try:
                # First, try to parse the raw response
                cleaned_text = self._fix_json(response_text)
                extracted_data = json.loads(cleaned_text)
                logger.info(f"Successfully extracted data from image: {image_path}")
            except json.JSONDecodeError as e:
                logger.warning(f"First parsing attempt failed: {str(e)}. Trying more aggressive JSON fixing...")
                
                try:
                    # More aggressive JSON extraction
                    pattern = r'({[^{]*?"report_info".*?})'
                    matches = re.findall(pattern, response_text, re.DOTALL)
                    
                    if matches:
                        for potential_json in matches:
                            try:
                                fixed_json = self._fix_json(potential_json)
                                extracted_data = json.loads(fixed_json)
                                logger.info(f"Successfully extracted JSON after aggressive cleaning")
                                break
                            except json.JSONDecodeError:
                                continue
                        else:
                            raise ValueError("Could not parse any potential JSON matches")
                    else:
                        # Fall back to a default structure and try to extract specific fields
                        logger.warning("No valid JSON structure found, using default structure")
                        extracted_data = self._create_default_structure()
                        
                        # Try to extract lab name, patient name, etc. using regex
                        lab_match = re.search(r'lab_name["\s:]+([^"]+)', response_text)
                        if lab_match:
                            extracted_data["report_info"]["lab_name"] = lab_match.group(1).strip().strip('"').strip("'")
                        
                        patient_match = re.search(r'name["\s:]+([^"]+)', response_text)
                        if patient_match:
                            extracted_data["patient_info"]["name"] = patient_match.group(1).strip().strip('"').strip("'")
                except Exception as nested_error:
                    logger.error(f"Error during aggressive JSON extraction: {str(nested_error)}")
                    logger.error(f"Using default structure instead")
                    extracted_data = self._create_default_structure()
            
            return extracted_data
        
        except Exception as e:
            logger.error(f"Error processing image with Claude: {str(e)}")
            logger.error(f"File path: {image_path}")
            raise