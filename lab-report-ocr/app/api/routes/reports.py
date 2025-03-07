import logging
from typing import List, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from bson import ObjectId
from pymongo import DESCENDING

from app.db.database import get_database
from app.models.schemas.report import (
    ReportUploadRequest,
    ReportQueryRequest,
    LabReportResponse,
    LabReportListResponse,
    LabReportUploadResponse,
)
from app.services.ocr.image_processor import ImageProcessor
from app.services.ocr.pdf_processor import PDFProcessor

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize processors
image_processor = ImageProcessor()
pdf_processor = PDFProcessor()


def fix_datetime_fields(data: Dict[str, Any]) -> Dict[str, Any]:
    """Fix empty or invalid datetime fields in the data"""
    # Handle collection_info datetime fields
    if "collection_info" in data and data["collection_info"]:
        for field in ["registered_on", "collected_on", "received_on", "reported_on"]:
            if field in data["collection_info"]:
                value = data["collection_info"][field]
                if value == "" or value is None:
                    data["collection_info"][field] = None
                elif isinstance(value, str):
                    try:
                        # Try to parse if it's a string
                        data["collection_info"][field] = datetime.fromisoformat(value)
                    except ValueError:
                        # If parsing fails, set to None
                        data["collection_info"][field] = None
    
    # Handle timestamp fields
    for field in ["created_at", "updated_at"]:
        if field in data and isinstance(data[field], str):
            try:
                data[field] = datetime.fromisoformat(data[field])
            except ValueError:
                data[field] = datetime.utcnow()
        elif field not in data or data[field] is None:
            data[field] = datetime.utcnow()
    
    return data


@router.post("/upload", response_model=LabReportUploadResponse)
async def upload_report(
    file: UploadFile = File(...),
    phone_number: str = Form(...),
    patient_name: str = Form(None),
    db = Depends(get_database)
):
    """
    Upload and process a lab report (PDF or image)
    """
    try:
        # Determine file type and process accordingly
        content_type = file.content_type
        
        if "image" in content_type:
            # Process as image
            report_data = await image_processor.process_image_file(file, phone_number)
        elif content_type == "application/pdf":
            # Process as PDF
            report_data = await pdf_processor.process_pdf_file(file, phone_number)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {content_type}. Only images and PDFs are supported."
            )
        
        # Add patient name if provided
        if patient_name and "patient_info" in report_data:
            report_data["patient_info"]["name"] = patient_name
        
        # Fix datetime fields
        report_data = fix_datetime_fields(report_data)
        
        # Ensure required fields have default values
        if "test_name" not in report_data or not report_data["test_name"]:
            report_data["test_name"] = "Laboratory Test"
            
        if "test_category" not in report_data or not report_data["test_category"]:
            report_data["test_category"] = "General"
            
        # Ensure report_info has a lab_name
        if "report_info" not in report_data:
            report_data["report_info"] = {"lab_name": "Unknown Laboratory"}
        elif "lab_name" not in report_data["report_info"] or not report_data["report_info"]["lab_name"]:
            report_data["report_info"]["lab_name"] = "Unknown Laboratory"
            
        # Ensure metadata has report_type
        if "metadata" not in report_data:
            report_data["metadata"] = {"report_type": "Laboratory Test"}
        elif "report_type" not in report_data["metadata"] or not report_data["metadata"]["report_type"]:
            # Use test_name as the report_type if available, otherwise default to "Laboratory Test"
            report_data["metadata"]["report_type"] = report_data.get("test_name", "Laboratory Test")
        
        # Insert into database
        result = await db.reports.insert_one(report_data)
        
        # Return success response
        return {
            "report_id": str(result.inserted_id),
            "message": "Report uploaded and processed successfully",
            "success": True
        }
    
    except Exception as e:
        logger.error(f"Error processing report upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing report: {str(e)}"
        )


@router.get("/by-phone/{phone_number}", response_model=LabReportListResponse)
async def get_reports_by_phone(
    phone_number: str,
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0),
    test_type: str = Query(None),
    db = Depends(get_database)
):
    """
    Get all reports for a specific phone number
    """
    try:
        # Build query
        query = {"patient_info.phone_number": phone_number}
        
        # Add test type filter if provided
        if test_type:
            query["test_name"] = {"$regex": test_type, "$options": "i"}
        
        # Get total count
        total = await db.reports.count_documents(query)
        
        # Get reports
        cursor = db.reports.find(query).sort("created_at", DESCENDING).skip(skip).limit(limit)
        
        # Convert to list and format for response
        reports = []
        async for doc in cursor:
            # Set the ID field
            doc["id"] = str(doc.pop("_id"))
            
            # Fix datetime fields
            doc = fix_datetime_fields(doc)
            
            # Ensure required fields have default values
            if "test_name" not in doc or not doc["test_name"]:
                doc["test_name"] = "Laboratory Test"
                
            if "test_category" not in doc or not doc["test_category"]:
                doc["test_category"] = "General"
                
            # Ensure report_info has a lab_name
            if "report_info" not in doc:
                doc["report_info"] = {"lab_name": "Unknown Laboratory"}
            elif "lab_name" not in doc["report_info"] or not doc["report_info"]["lab_name"]:
                doc["report_info"]["lab_name"] = "Unknown Laboratory"
                
            # Ensure metadata has report_type
            if "metadata" not in doc:
                doc["metadata"] = {"report_type": "Laboratory Test"}
            elif "report_type" not in doc["metadata"] or not doc["metadata"]["report_type"]:
                # Use test_name as the report_type if available, otherwise default to "Laboratory Test"
                doc["metadata"]["report_type"] = doc.get("test_name", "Laboratory Test")
            
            reports.append(doc)
        
        # Return response
        return {
            "reports": reports,
            "total": total
        }
    
    except Exception as e:
        logger.error(f"Error retrieving reports: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving reports: {str(e)}"
        )


@router.get("/{report_id}", response_model=LabReportResponse)
async def get_report_by_id(
    report_id: str,
    db = Depends(get_database)
):
    """
    Get a specific report by ID
    """
    try:
        # Convert string ID to ObjectId
        oid = ObjectId(report_id)
        
        # Get report
        report = await db.reports.find_one({"_id": oid})
        
        if not report:
            raise HTTPException(
                status_code=404,
                detail=f"Report with ID {report_id} not found"
            )
        
        # Format for response
        report["id"] = str(report.pop("_id"))
        
        # Fix datetime fields
        report = fix_datetime_fields(report)
        
        # Ensure required fields have default values
        if "test_name" not in report or not report["test_name"]:
            report["test_name"] = "Laboratory Test"
            
        if "test_category" not in report or not report["test_category"]:
            report["test_category"] = "General"
            
        # Ensure report_info has a lab_name
        if "report_info" not in report:
            report["report_info"] = {"lab_name": "Unknown Laboratory"}
        elif "lab_name" not in report["report_info"] or not report["report_info"]["lab_name"]:
            report["report_info"]["lab_name"] = "Unknown Laboratory"
            
        # Ensure metadata has report_type
        if "metadata" not in report:
            report["metadata"] = {"report_type": "Laboratory Test"}
        elif "report_type" not in report["metadata"] or not report["metadata"]["report_type"]:
            # Use test_name as the report_type if available, otherwise default to "Laboratory Test"
            report["metadata"]["report_type"] = report.get("test_name", "Laboratory Test")
        
        return report
    
    except Exception as e:
        logger.error(f"Error retrieving report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving report: {str(e)}"
        )


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    db = Depends(get_database)
):
    """
    Delete a specific report by ID
    """
    try:
        # Convert string ID to ObjectId
        oid = ObjectId(report_id)
        
        # Delete report
        result = await db.reports.delete_one({"_id": oid})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"Report with ID {report_id} not found"
            )
        
        return JSONResponse(
            status_code=200,
            content={"message": f"Report with ID {report_id} deleted successfully"}
        )
    
    except Exception as e:
        logger.error(f"Error deleting report: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting report: {str(e)}"
        )