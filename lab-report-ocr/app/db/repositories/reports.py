import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

from app.db.repositories.base import BaseRepository
from app.models.domain.report import LabReport

logger = logging.getLogger(__name__)

class ReportRepository(BaseRepository):
    """
    Repository for lab reports
    """
    
    def __init__(self, db):
        """
        Initialize the repository with the database connection
        """
        super().__init__("reports", db)
    
    async def find_by_phone(
        self, 
        phone_number: str, 
        skip: int = 0, 
        limit: int = 10,
        test_type: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Find reports by phone number with optional filters
        """
        query = {"patient_info.phone_number": phone_number}
        
        # Add test type filter if provided
        if test_type:
            query["test_name"] = {"$regex": test_type, "$options": "i"}
        
        # Add date range filter if provided
        date_filter = {}
        if from_date:
            date_filter["$gte"] = from_date.isoformat()
        if to_date:
            date_filter["$lte"] = to_date.isoformat()
        
        if date_filter:
            query["collection_info.reported_on"] = date_filter
        
        # Get reports
        return await self.find_by_query(
            query=query,
            skip=skip,
            limit=limit,
            sort_field="collection_info.reported_on",
            sort_direction=-1
        )
    
    async def find_recent_by_phone(
        self, 
        phone_number: str, 
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find most recent reports for a patient
        """
        return await self.find_by_query(
            query={"patient_info.phone_number": phone_number},
            limit=limit,
            sort_field="collection_info.reported_on",
            sort_direction=-1
        )
    
    async def find_by_test_type(
        self, 
        test_type: str, 
        skip: int = 0, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find reports by test type
        """
        return await self.find_by_query(
            query={"test_name": {"$regex": test_type, "$options": "i"}},
            skip=skip,
            limit=limit
        )
    
    async def find_abnormal_results(
        self, 
        phone_number: Optional[str] = None, 
        skip: int = 0, 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find reports with abnormal results
        """
        # This is a simplified approach - in reality, you would need
        # a more sophisticated query to identify abnormal results
        query = {"$or": [
            {"test_results.is_normal": False},
            {"test_results.flag": {"$in": ["H", "L", "HIGH", "LOW", "ABNORMAL"]}}
        ]}
        
        if phone_number:
            query["patient_info.phone_number"] = phone_number
        
        return await self.find_by_query(
            query=query,
            skip=skip,
            limit=limit
        )