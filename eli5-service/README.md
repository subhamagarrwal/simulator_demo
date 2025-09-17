# ELI5 Financial Explanation Microservice

A Python-based microservice that generates "Explain Like I'm 5" explanations for financial market movements and trading scenarios.

## Features

- FastAPI-based REST API
- Rule-based financial explanation engine
- Sector-specific analysis patterns
- Market sentiment analysis
- Event-driven explanations
- Simple analogies for complex financial concepts

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

## API Endpoints

- `POST /explain` - Generate ELI5 explanation for market conditions
- `GET /health` - Health check endpoint

## Usage

Send market conditions to get simple explanations:

```json
{
  "market_conditions": {
    "sentiment": "bullish",
    "flows": "positive",
    "global_cues": "positive",
    "exchange_rate": "strengthening",
    "crude_oil": "rising"
  },
  "sector": "it",
  "company_size": "mid-cap",
  "price_change": {
    "absolute": 45.30,
    "percentage": 2.45
  },
  "current_day": 15,
  "active_events": []
}
```