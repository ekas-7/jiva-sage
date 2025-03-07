import logging
from datetime import datetime
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)

class ReportMapper:
    """Maps extracted OCR data to a standardized format"""
    
    @staticmethod
    def map_to_standard_format(extracted_data: Dict[str, Any], file_type: str, file_path: str, phone_number: str) -> Dict[str, Any]:
        """
        Map extracted data to a standardized format
        
        Args:
            extracted_data: The data extracted by Claude
            file_type: The type of file (PDF or Image)
            file_path: Path to the original file
            phone_number: User's phone number
        
        Returns:
            Standardized report data
        """
        try:
            # Ensure patient_info contains phone_number
            if "patient_info" not in extracted_data:
                extracted_data["patient_info"] = {}
            
            extracted_data["patient_info"]["phone_number"] = phone_number
            
            # Add metadata
            if "metadata" not in extracted_data:
                extracted_data["metadata"] = {}
            
            extracted_data["metadata"]["file_type"] = file_type
            extracted_data["metadata"]["original_file_path"] = file_path
            
            # Determine report type if not present
            if "test_name" in extracted_data and extracted_data["test_name"]:
                if "report_type" not in extracted_data["metadata"]:
                    extracted_data["metadata"]["report_type"] = extracted_data["test_name"]
            
            # Format dates in collection_info
            if "collection_info" in extracted_data and extracted_data["collection_info"]:
                collection_info = extracted_data["collection_info"]
                
                for date_field in ["registered_on", "collected_on", "received_on", "reported_on"]:
                    if date_field in collection_info and collection_info[date_field]:
                        try:
                            # Try to parse date in various formats
                            date_str = collection_info[date_field]
                            
                            # Handle different date formats
                            for fmt in [
                                "%d/%m/%Y %H:%M:%S",
                                "%d/%m/%Y %H:%M",
                                "%d/%m/%Y",
                                "%Y-%m-%d %H:%M:%S",
                                "%Y-%m-%d %H:%M",
                                "%Y-%m-%d",
                                "%d-%m-%Y %H:%M:%S",
                                "%d-%m-%Y %H:%M",
                                "%d-%m-%Y",
                                "%d-%b-%Y %H:%M:%S",
                                "%d-%b-%Y %H:%M",
                                "%d-%b-%Y",
                            ]:
                                try:
                                    date_obj = datetime.strptime(date_str, fmt)
                                    collection_info[date_field] = date_obj.isoformat()
                                    break
                                except ValueError:
                                    continue
                        except Exception as e:
                            logger.warning(f"Could not parse date '{collection_info[date_field]}': {str(e)}")
            
            # Process test results to ensure consistent format with is_normal flags
            if "test_results" in extracted_data and extracted_data["test_results"]:
                ReportMapper._process_test_results(extracted_data["test_results"])
            
            # Add timestamps
            current_time = datetime.utcnow().isoformat()
            extracted_data["created_at"] = current_time
            extracted_data["updated_at"] = current_time
            
            return extracted_data
        
        except Exception as e:
            logger.error(f"Error mapping report data: {str(e)}")
            raise
    
    @staticmethod
    def _process_test_results(test_results: Dict[str, Any]) -> None:
        """
        Process test results to ensure consistent format
        
        Args:
            test_results: Test result dictionary
        """
        for key, value in test_results.items():
            if isinstance(value, dict):
                # Check if this is a test result value
                if all(k in value for k in ["value", "unit"]) and "reference_range" in value:
                    # Ensure is_normal is set based on reference range
                    if "is_normal" not in value:
                        value["is_normal"] = ReportMapper._is_value_normal(
                            value["value"], value.get("reference_range"), value.get("flag")
                        )
                else:
                    # Recursive call for nested dictionaries
                    ReportMapper._process_test_results(value)
    
    @staticmethod
    def _is_value_normal(value: Any, reference_range: Optional[str], flag: Optional[str]) -> bool:
        """
        Determine if a value is normal based on reference range or flag
        
        Args:
            value: The test value
            reference_range: The reference range string
            flag: H, L, or other flag
        
        Returns:
            Boolean indicating if value is normal
        """
        if flag:
            return flag.upper() not in ["H", "L", "HIGH", "LOW", "ABNORMAL"]
        
        if not reference_range:
            return True
        
        try:
            # Handle numeric comparisons
            if isinstance(value, (int, float)) and "-" in reference_range:
                min_val, max_val = reference_range.split("-")
                min_val = float(min_val.strip())
                max_val = float(max_val.strip())
                return min_val <= value <= max_val
        except:
            pass
        
        # Default to true if we can't determine
        return True