from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseReportParser(ABC):
    """
    Abstract base class for report parsers
    
    This defines the interface that all specific report parsers should implement.
    """
    
    @abstractmethod
    async def parse(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse extracted data into a standardized format
        
        Args:
            data: Raw data extracted from the OCR process
        
        Returns:
            Standardized report data
        """
        pass
    
    @abstractmethod
    def validate(self, data: Dict[str, Any]) -> bool:
        """
        Validate if the data matches this parser's report type
        
        Args:
            data: Raw data extracted from the OCR process
        
        Returns:
            True if this parser can handle the data, False otherwise
        """
        pass