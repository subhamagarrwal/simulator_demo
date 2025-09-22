# Financial Simulator Integration Guide

## Overview

This project now includes a complete financial simulation backend that integrates with the frontend controls. The system supports both static ("HOLD") and dynamic ("TRAJECTORY") simulation modes.

## Backend Setup

### 1. Install Python Dependencies

```bash
# On Windows
setup_backend.bat

# On macOS/Linux  
pip install -r requirements.txt
```

### 2. Start the Simulation Backend

```bash
python simulatorprogram.py
```

The backend will start on `http://127.0.0.1:5000`

### 3. Verify Backend is Running

Visit `http://127.0.0.1:5000/health` to check if the model is loaded correctly.

## API Endpoints

### POST /simulate
Main simulation endpoint that accepts simulation parameters and returns OHLC data.

**Request Format:**
```json
{
  "company_meta": {
    "company_id": "SAMPLE001",
    "company_name": "Sample Corp", 
    "sector": "technology",
    "market_cap_bucket": "mid_cap",
    "company_size": "mid_cap"
  },
  "last_close": 1000.0,
  "start_date": "2025-01-15",
  "horizon": 30,
  "mode": "hold",
  "controls": {
    "overall_market_sentiment": 0.2,
    "fii_flows": 500,
    "dii_flows": 200,
    "global_market_cues": 0.1,
    "inr_usd_delta": -0.001,
    "crude_oil_delta": 0.002,
    "earnings_announcement": 0.8,
    "analyst_rating_change": 1,
    "major_news": "positive",
    "insider_activity": "buy",
    "predefined_global_shock": "none"
  },
  "events": [
    {
      "date": "2025-01-20",
      "field": "earnings_announcement", 
      "value": 1.0
    }
  ]
}
```

**Response Format:**
```json
{
  "status": "success",
  "simulation_info": {
    "company_name": "Sample Corp",
    "mode": "hold",
    "horizon": 30,
    "start_date": "2025-01-15",
    "end_date": "2025-02-25",
    "features_used": ["overall_market_sentiment", "fii_flows", "..."],
    "num_events_applied": 1
  },
  "ohlc_data": [
    {
      "date": "2025-01-16",
      "open": 1000.0,
      "high": 1015.2, 
      "low": 995.8,
      "close": 1008.5
    }
  ],
  "predicted_log_returns": [0.0085, 0.0032, "..."],
  "feature_panel_shape": {
    "rows": 30,
    "columns": 13
  }
}
```

### POST /validate_controls
Returns allowed ranges and values for all control parameters.

### GET /health  
Health check endpoint to verify backend status and model loading.

## Frontend Integration

The frontend automatically integrates with the backend through the `simulationAPI` service:

```typescript
import { simulationAPI, SimulationHelper } from '@/services/simulationAPI';

// Convert frontend state to API format
const controls = SimulationHelper.convertControlsToAPI(frontendState);

// Create simulation request
const request = SimulationHelper.createSampleRequest(controls);

// Run simulation
const response = await simulationAPI.simulate(request);
```

## Control Mapping

### Frontend Sliders → Backend Controls

| Frontend Slider | Backend Control | Range |
|----------------|-----------------|--------|
| Market Sentiment | `overall_market_sentiment` | -1.0 to 1.0 |
| FII Flows | `fii_flows` | -2000 to 2000 |
| DII Flows | `dii_flows` | -1000 to 1000 |
| Global Market Cues | `global_market_cues` | -1.0 to 1.0 |
| INR/USD Delta | `inr_usd_delta` | -0.05 to 0.05 |
| Crude Oil Delta | `crude_oil_delta` | -0.1 to 0.1 |
| Earnings | `earnings_announcement` | 0 to 1 |
| Analyst Rating | `analyst_rating_change` | -2 to 2 |

### Frontend Events → Backend Categories

| Frontend Selection | Backend Value |
|-------------------|---------------|
| Major Contract Win | `major_news: "positive"` |
| New Product Launch | `major_news: "positive"` |
| CEO Resigns | `major_news: "negative"` |
| Regulatory Fine | `major_news: "negative"` |
| Heavy Promoter Buying | `insider_activity: "buy"` |
| Heavy Promoter Selling | `insider_activity: "sell"` |
| Financial Crisis | `predefined_global_shock: "financial_crisis"` |
| Geopolitical Conflict | `predefined_global_shock: "geopolitical"` |
| Pandemic News | `predefined_global_shock: "pandemic"` |

## Simulation Modes

### HOLD Mode (Static Environment)
- All control values remain constant throughout the simulation period
- Suitable for "what-if" scenarios with steady conditions
- Frontend sliders set once, applied to all trading days

### TRAJECTORY Mode (Dynamic Environment)  
- Control values can vary over time
- Supports time-varying paths, ramps, and cycles
- Events can override specific dates
- More complex scenario modeling

## Model Requirements

The system expects a trained scikit-learn pipeline saved as `model_and_pre_fin.pkl` that:

1. Handles both numeric and categorical features
2. Uses `OneHotEncoder(handle_unknown="ignore")` for categorical features
3. Predicts daily log-returns for stock prices
4. Accepts the feature columns listed in the control mapping above

## Development Notes

- Backend runs on Flask development server (suitable for testing)
- CORS is enabled for frontend integration
- Error handling includes validation for array lengths and categorical values
- Deterministic results available via optional `seed` parameter
- Intraday volatility varies by market cap bucket (Large: 1.0%, Mid: 1.5%, Small: 2.0%)

## Troubleshooting

1. **Model not loading**: Ensure `model_and_pre_fin.pkl` exists in the root directory
2. **CORS errors**: Backend includes CORS headers for localhost development
3. **Connection refused**: Make sure backend is running on port 5000
4. **Validation errors**: Check that array lengths match horizon parameter
5. **Feature errors**: Verify model expects the same feature columns as defined in the API