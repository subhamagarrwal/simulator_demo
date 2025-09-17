from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
from financial_explainer import FinancialExplainer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="ELI5 Financial Explanation Service",
    description="Microservice for generating simple explanations of financial market movements",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the financial explainer
explainer = FinancialExplainer()

# Pydantic models for request/response
class MarketConditions(BaseModel):
    sentiment: str
    flows: str
    global_cues: str
    exchange_rate: str
    crude_oil: str

class PriceChange(BaseModel):
    absolute: float
    percentage: float

class CompanyEvent(BaseModel):
    type: str
    subtype: str
    impact: float

class ExplanationRequest(BaseModel):
    market_conditions: MarketConditions
    sector: str
    company_size: str
    price_change: PriceChange
    current_day: int
    active_events: List[CompanyEvent] = []
    previous_price_change: Optional[PriceChange] = None

class ELI5Story(BaseModel):
    title: str
    explanation: str
    key_points: List[str]
    analogy: str
    prediction: str
    confidence_score: float
    market_mood: str
    sector_context: str

class ExplanationResponse(BaseModel):
    story: ELI5Story
    metadata: Dict[str, Any]
    timestamp: str

@app.get("/")
async def root():
    return {"message": "ELI5 Financial Explanation Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "eli5-financial-explainer"}

@app.post("/explain", response_model=ExplanationResponse)
async def generate_explanation(request: ExplanationRequest):
    """
    Generate an ELI5 explanation for the given market conditions and events.
    """
    try:
        logger.info(f"Generating explanation for sector: {request.sector}, price change: {request.price_change.percentage}%")
        
        # Convert request to dictionary for processing
        context = {
            "market_conditions": request.market_conditions.dict(),
            "sector": request.sector,
            "company_size": request.company_size,
            "price_change": request.price_change.dict(),
            "current_day": request.current_day,
            "active_events": [event.dict() for event in request.active_events],
            "previous_price_change": request.previous_price_change.dict() if request.previous_price_change else None
        }
        
        # Generate the explanation using our financial explainer
        story = explainer.generate_story(context)
        
        # Create response
        response = ExplanationResponse(
            story=story,
            metadata={
                "processing_time_ms": 0,  # You could add timing here
                "model_version": "1.0.0",
                "explanation_type": "rule_based_with_financial_patterns"
            },
            timestamp=explainer.get_current_timestamp()
        )
        
        logger.info("Successfully generated explanation")
        return response
        
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {str(e)}")

@app.get("/sectors")
async def get_supported_sectors():
    """
    Get list of supported sectors and their descriptions.
    """
    return explainer.get_sector_info()

@app.get("/market-conditions")
async def get_market_condition_options():
    """
    Get available options for each market condition parameter.
    """
    return explainer.get_market_condition_options()

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )