from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from pydantic import BaseModel, Field


class LabContact(BaseModel):
    """Lab contact information"""
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None


class LabSignatory(BaseModel):
    """Lab personnel who signed the report"""
    name: str
    qualification: Optional[str] = None
    designation: Optional[str] = None


class LabInfo(BaseModel):
    """Information about the laboratory"""
    lab_name: str
    lab_registration_number: Optional[str] = None
    lab_contact: Optional[LabContact] = None
    lab_signatories: Optional[List[LabSignatory]] = None
    instruments: Optional[str] = None


class PatientInfo(BaseModel):
    """Patient information"""
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    patient_id: Optional[str] = None
    phone_number: str  # Required for retrieval
    referred_by: Optional[str] = None
    registration_number: Optional[str] = None
    sample_collection_location: Optional[str] = None


class CollectionInfo(BaseModel):
    """Information about when the sample was collected"""
    registered_on: Optional[datetime] = None
    collected_on: Optional[datetime] = None
    received_on: Optional[datetime] = None
    reported_on: Optional[datetime] = None


class TestResultValue(BaseModel):
    """Individual test result with value, unit, and reference range"""
    value: Union[float, int, str]
    unit: Optional[str] = None
    reference_range: Optional[str] = None
    is_normal: Optional[bool] = None
    flag: Optional[str] = None  # H for High, L for Low, etc.


class TestResult(BaseModel):
    """Test results, structured to handle nested test categories"""
    test_name: str
    test_category: Optional[str] = None
    sub_category: Optional[str] = None
    result: Union[TestResultValue, Dict[str, "TestResult"], Dict[str, TestResultValue]]


class ClinicalNotes(BaseModel):
    """Clinical notes and observations"""
    notes: Optional[str] = None
    possible_causes: Optional[Dict[str, Dict[str, str]]] = None  # Parameter: {High: cause, Low: cause}


class ReportMetadata(BaseModel):
    """Additional report metadata"""
    page_info: Optional[str] = None
    disclaimer: Optional[str] = None
    work_timings: Optional[str] = None
    report_type: str  # CBC, Lipid Profile, etc.
    file_type: str  # PDF, Image
    original_file_path: Optional[str] = None


class LabReport(BaseModel):
    """Complete lab report model"""
    id: Optional[str] = Field(default=None, alias="_id")
    report_info: LabInfo
    patient_info: PatientInfo
    collection_info: Optional[CollectionInfo] = None
    test_category: str  # High-level category (e.g., HAEMATOLOGY)
    test_name: str  # Specific test name (e.g., COMPLETE BLOOD COUNT)
    test_results: Dict[str, Any]  # Flexible structure to accommodate different test formats
    clinical_notes: Optional[ClinicalNotes] = None
    metadata: ReportMetadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }