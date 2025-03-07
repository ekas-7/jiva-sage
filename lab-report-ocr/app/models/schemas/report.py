from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.domain.report import (
    LabContact, LabSignatory, LabInfo, PatientInfo, 
    CollectionInfo, TestResultValue, TestResult, 
    ClinicalNotes, ReportMetadata
)


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


# Response Schemas
class LabReportResponse(BaseModel):
    """Response schema for lab reports"""
    id: str
    report_info: LabInfo
    patient_info: PatientInfo
    collection_info: Optional[CollectionInfo] = None
    test_category: str
    test_name: str
    test_results: Dict[str, Any]
    clinical_notes: Optional[ClinicalNotes] = None
    metadata: ReportMetadata
    created_at: datetime
    updated_at: datetime


class LabReportListResponse(BaseModel):
    """Response schema for a list of lab reports"""
    reports: List[LabReportResponse]
    total: int


class LabReportUploadResponse(BaseModel):
    """Response schema for report upload"""
    report_id: str
    message: str = "Report uploaded successfully"
    success: bool = True