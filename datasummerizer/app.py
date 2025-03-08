from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import openai
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Define input model (Flexible to handle any data inside "reports")
class HealthAnalysisRequest(BaseModel):
    reports: list[dict]  # Accepts any structure inside "reports"

# Define response model (Strict format)
class HealthAnalysisResponse(BaseModel):
    patient_name: str
    analysis_date: str
    overall_health_status: str
    analysis: list[dict]
    nutrition_recommendations: list[dict]
    activity_recommendations: list[dict]
    follow_up_recommendations: list[str]

class HealthAnalysisBatchResponse(BaseModel):
    reports: list[HealthAnalysisResponse]

# Dependency to get API key
def get_openai_api_key():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="OpenAI API key is missing")
    return api_key

@app.post("/analyze-health", response_model=HealthAnalysisBatchResponse)
async def analyze_health(
    request: HealthAnalysisRequest, api_key: str = Depends(get_openai_api_key)
):
    try:
        client = openai.OpenAI(api_key=api_key)  # Use OpenAI client
        processed_reports = []

        for report in request.reports:
            prompt = f"""
            Given the following patient report, extract relevant details and generate a structured health analysis
            in the following strict JSON format:
            {{
              "patient_name": "string",
              "analysis_date": "string",
              "overall_health_status": "string",
              "analysis": [
                {{
                  "parameter": "string",
                  "status": "string",
                  "interpretation": "string",
                  "risk_level": "string"
                }}
              ],
              "nutrition_recommendations": [
                {{
                  "food_type": "string",
                  "reason": "string",
                  "examples": [
                    "string"
                  ],
                  "frequency": "string",
                  "portion_size": "string"
                }}
              ],
              "activity_recommendations": [
                {{
                  "activity_type": "string",
                  "reason": "string",
                  "examples": [
                    "string"
                  ],
                  "frequency": "string",
                  "intensity": "string",
                  "duration": "string",
                  "precautions": [
                    "string"
                  ]
                }}
              ],
              "follow_up_recommendations": [
                "string"
              ]
            }}

            Here is the raw patient report data: {json.dumps(report, indent=2)}

            Ensure that the response follows this exact JSON structure and fills missing details intelligently.
            """

            response = client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a medical expert providing structured health analysis."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800
            )

            result = response.choices[0].message.content
            processed_reports.append(HealthAnalysisResponse.model_validate_json(result))

        return HealthAnalysisBatchResponse(reports=processed_reports)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
