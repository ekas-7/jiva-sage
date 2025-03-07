from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field, model_validator


# Request Schemas
class ReportUploadRequest(BaseModel):
    """Request schema for uploading a new report"""
    phone_number: str
    patient_name: Optional[str] = None


class ReportQueryRequest(BaseModel):
    """Request schema for querying reports"""
    phone_number: str
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    test_type: Optional[str] = None


# Base schemas for lab components
class LabContact(BaseModel):
    """Lab contact information"""
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None


class LabSignatory(BaseModel):
    """Lab personnel who signed the report"""
    name: Optional[str] = ""
    qualification: Optional[str] = None
    designation: Optional[str] = None


# Response Schemas with relaxed validation
class LabInfoResponse(BaseModel):
    """Response schema for lab information with optional fields"""
    lab_name: str = "Unknown Laboratory"
    lab_registration_number: Optional[str] = None
    lab_contact: Optional[LabContact] = None
    lab_signatories: Optional[List[LabSignatory]] = None
    instruments: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }


class CollectionInfoResponse(BaseModel):
    """Response schema for collection information with optional datetime fields"""
    registered_on: Optional[datetime] = None
    collected_on: Optional[datetime] = None
    received_on: Optional[datetime] = None
    reported_on: Optional[datetime] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
    
    @model_validator(mode='before')
    @classmethod
    def validate_dates(cls, data):
        """Validate that date fields are either valid datetimes or None"""
        if isinstance(data, dict):
            for field in ['registered_on', 'collected_on', 'received_on', 'reported_on']:
                if field in data and (data[field] == "" or data[field] is None):
                    data[field] = None
        return data


class ClinicalNotesResponse(BaseModel):
    """Response schema for clinical notes"""
    notes: Optional[str] = None
    possible_causes: Optional[Dict[str, Any]] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }


class ReportMetadataResponse(BaseModel):
    """Response schema for report metadata with optional fields"""
    page_info: Optional[str] = None
    disclaimer: Optional[str] = None
    work_timings: Optional[str] = None
    report_type: str = "Laboratory Test"
    file_type: Optional[str] = None
    original_file_path: Optional[str] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }


class LabReportResponse(BaseModel):
    """Response schema for lab reports with optional fields"""
    id: str
    report_info: LabInfoResponse
    patient_info: Dict[str, Any]
    collection_info: Optional[CollectionInfoResponse] = None
    test_category: str = "General"
    test_name: str = "Laboratory Test"
    test_results: Dict[str, Any] = {}
    clinical_notes: Optional[ClinicalNotesResponse] = None
    metadata: ReportMetadataResponse
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
    
    @model_validator(mode='before')
    @classmethod
    def ensure_required_fields(cls, data):
        """Ensure all required fields exist with default values"""
        if isinstance(data, dict):
            # Fix collection_info
            if 'collection_info' not in data or data['collection_info'] is None:
                data['collection_info'] = {}
            
            # Fix report_info
            if 'report_info' not in data or data['report_info'] is None:
                data['report_info'] = {'lab_name': 'Unknown Laboratory'}
            elif 'lab_name' not in data['report_info'] or not data['report_info']['lab_name']:
                data['report_info']['lab_name'] = 'Unknown Laboratory'
            
            # Fix test category and name
            if 'test_category' not in data or not data['test_category']:
                data['test_category'] = 'General'
            if 'test_name' not in data or not data['test_name']:
                data['test_name'] = 'Laboratory Test'
            
            # Fix metadata
            if 'metadata' not in data or data['metadata'] is None:
                data['metadata'] = {'report_type': 'Laboratory Test'}
            elif 'report_type' not in data['metadata'] or not data['metadata']['report_type']:
                data['metadata']['report_type'] = data.get('test_name', 'Laboratory Test')
        
        return data


class LabReportListResponse(BaseModel):
    """Response schema for a list of lab reports"""
    reports: List[LabReportResponse]
    total: int


class LabReportUploadResponse(BaseModel):
    """Response schema for report upload"""
    report_id: str
    message: str = "Report uploaded successfully"
    success: bool = True