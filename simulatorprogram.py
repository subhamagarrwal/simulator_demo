#!/usr/bin/env python3
"""
Financial Stock Simulator Backend
Provides simulation capabilities for stock price prediction using trained ML models.
Supports both HOLD (constant environment) and TRAJECTORY (time-varying) modes.
"""

import os
import numpy as np
import pandas as pd
import pickle
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union, Any
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Load the trained model and preprocessor
MODEL_PATH = "model_and_pre_fin.pkl"
try:
    with open(MODEL_PATH, 'rb') as f:
        pipe = pickle.load(f)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"❌ Model file not found: {MODEL_PATH}")
    pipe = None
except Exception as e:
    print(f"❌ Error loading model: {e}")
    pipe = None

def future_business_days(start_date: str, horizon: int) -> pd.DatetimeIndex:
    """Generate future business days starting after start_date."""
    start = pd.Timestamp(start_date)
    # Get next business day after start_date
    next_day = start + pd.Timedelta(days=1)
    return pd.bdate_range(start=next_day, periods=horizon)

def expand_control(name: str, value: Any, n: int, default: Any) -> np.ndarray:
    """Expand control value to array of length n."""
    if value is None:
        value = default
    
    if np.isscalar(value):
        return np.repeat(value, n)
    
    value = np.asarray(value)
    if len(value) != n:
        raise ValueError(f"Control '{name}' length {len(value)} != horizon {n}")
    return value

def make_future_features(
    company_meta: Dict,
    start_date: str,
    horizon: int = 88,
    mode: str = "hold",
    controls: Optional[Dict] = None,
    events: Optional[List[Dict]] = None
) -> pd.DataFrame:
    """
    Create future feature panel for simulation.
    
    Args:
        company_meta: Company metadata (sector, market_cap_bucket, etc.)
        start_date: Starting date for simulation
        horizon: Number of trading days to simulate
        mode: "hold" or "trajectory"
        controls: Control values for simulation
        events: Optional list of events to override specific dates
    
    Returns:
        DataFrame with features ready for model prediction
    """
    dates = future_business_days(start_date, horizon)
    n = len(dates)
    
    if controls is None:
        controls = {}
    
    # Numeric controls with defaults
    numeric_controls = {
        "overall_market_sentiment": 0.0,
        "fii_flows": 0.0,
        "dii_flows": 0.0,
        "global_market_cues": 0.0,
        "inr_usd_delta": 0.0,
        "crude_oil_delta": 0.0,
        "earnings_announcement": 0,
        "analyst_rating_change": 0
    }
    
    # Categorical controls with defaults
    categorical_controls = {
        "major_news": "none",
        "insider_activity": "none", 
        "predefined_global_shock": "none"
    }
    
    # Build numeric features
    data = {}
    for name, default in numeric_controls.items():
        data[name] = expand_control(name, controls.get(name), n, default)
    
    # Build categorical features
    cat_data = {}
    for name, default in categorical_controls.items():
        cat_data[name] = expand_control(name, controls.get(name), n, default)
    
    # Add company metadata (repeated for all days)
    cat_data["sector"] = np.repeat(company_meta["sector"], n)
    cat_data["market_cap_bucket"] = np.repeat(company_meta["market_cap_bucket"], n)
    
    # Create DataFrame
    df = pd.DataFrame({**data, **cat_data})
    df.insert(0, "date", dates)
    df["company_id"] = company_meta.get("company_id", company_meta["ticker"])  # fallback to ticker if no company_id
    df["ticker"] = company_meta["ticker"]
    df["company_name"] = company_meta["company_name"]
    df["company_size"] = company_meta["company_size"]
    
    # Apply events (override specific dates/fields)
    if events:
        for event in events:
            event_date = pd.Timestamp(event["date"])
            field = event["field"]
            value = event["value"]
            
            # Find matching date
            mask = df["date"] == event_date
            if mask.any():
                df.loc[mask, field] = value
                print(f"Applied event: {event_date.date()} {field} = {value}")
            else:
                print(f"Warning: Event date {event_date.date()} not found in simulation period")
    
    return df

def generate_ohlc(
    last_close: float,
    log_returns: np.ndarray,
    dates: pd.DatetimeIndex,
    base_vol: float = 0.015,
    seed: Optional[int] = None
) -> List[Dict]:
    """
    Generate OHLC data from predicted log returns.
    
    Args:
        last_close: Last known closing price
        log_returns: Array of predicted daily log returns
        dates: Trading dates
        base_vol: Base intraday volatility for high/low generation
        seed: Random seed for reproducible results
    
    Returns:
        List of OHLC dictionaries
    """
    if seed is not None:
        np.random.seed(seed)
    
    ohlc_data = []
    current_close = last_close
    
    for i, (date, log_return) in enumerate(zip(dates, log_returns)):
        # Open is previous close (gap handling could be added here)
        open_price = current_close
        
        # Close from predicted log return
        close_price = open_price * np.exp(log_return)
        
        # Generate high/low with intraday volatility
        intraday_vol = base_vol * np.random.uniform(0.5, 1.5)
        
        # High/low relative to open-close range
        price_range = abs(close_price - open_price)
        high_extra = np.random.exponential(price_range * 0.3) * intraday_vol
        low_extra = np.random.exponential(price_range * 0.3) * intraday_vol
        
        high_price = max(open_price, close_price) + high_extra
        low_price = min(open_price, close_price) - low_extra
        
        # Ensure logical constraints
        high_price = max(high_price, open_price, close_price)
        low_price = min(low_price, open_price, close_price)
        
        ohlc_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2)
        })
        
        current_close = close_price
    
    return ohlc_data

def get_base_volatility(market_cap_bucket: str) -> float:
    """Get base volatility based on market cap."""
    vol_map = {
        "large_cap": 0.010,
        "mid_cap": 0.015,
        "small_cap": 0.020
    }
    return vol_map.get(market_cap_bucket, 0.015)

def generate_synthetic_returns(future_df: pd.DataFrame, controls: Dict, events: List, base_vol: float, seed: Optional[int] = None) -> np.ndarray:
    """
    Generate synthetic log returns based on events and controls when ML model is unavailable.
    This provides realistic-looking data for testing the frontend integration.
    """
    if seed is not None:
        np.random.seed(seed)
    
    n = len(future_df)
    log_returns = np.random.normal(0, base_vol, n)  # Base random walk
    
    # Apply event impacts
    for i, row in future_df.iterrows():
        # Earnings impact
        if 'earnings_announcement' in row and row['earnings_announcement'] != 0:
            impact = row['earnings_announcement'] * 0.05  # Scale earnings impact
            log_returns[i] += impact
        
        # Analyst rating impact  
        if 'analyst_rating_change' in row and row['analyst_rating_change'] != 0:
            impact = row['analyst_rating_change'] * 0.03  # Scale analyst impact
            log_returns[i] += impact
            
        # Global shock impact
        if 'predefined_global_shock' in row and row['predefined_global_shock'] != 'none':
            shock_impacts = {
                'geo_political': -0.04,
                'pandemic_wave': -0.06, 
                'commodity_spike': -0.03,
                'policy_rate_shock': -0.02,
                'credit_event': -0.05
            }
            impact = shock_impacts.get(row['predefined_global_shock'], 0)
            log_returns[i] += impact
            
        # Major news impact
        if 'major_news' in row and row['major_news'] != 'none':
            if row['major_news'] in ['contract-win', 'product-launch']:
                log_returns[i] += 0.025  # Positive news
            else:
                log_returns[i] -= 0.025  # Negative news
                
        # Insider activity impact
        if 'insider_activity' in row and row['insider_activity'] != 'none':
            if row['insider_activity'] == 'promoter-buying':
                log_returns[i] += 0.02
            else:
                log_returns[i] -= 0.02
                
        # Market sentiment impact
        if 'overall_market_sentiment' in row:
            sentiment_impact = (row['overall_market_sentiment'] - 0.5) * 0.02
            log_returns[i] += sentiment_impact
    
    return log_returns

@app.route('/simulate', methods=['POST'])
def simulate():
    """
    Main simulation endpoint.
    Accepts JSON payload and returns OHLC data with predictions.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Extract required parameters
        company_meta = data.get("company_meta", {})
        last_close = data.get("last_close")
        start_date = data.get("start_date")
        horizon = data.get("horizon", 88)
        #trajectory is by default
        mode = data.get("mode", "trajectory")
        controls = data.get("controls", {})
        events = data.get("events", [])
        base_vol = data.get("base_vol")
        seed = data.get("seed")
        
        # Validation
        if not company_meta:
            return jsonify({"error": "company_meta is required"}), 400
        
        # Validate required company information
        required_company_fields = ["company_name", "ticker", "sector", "market_cap_bucket", "company_size"]
        missing_fields = [field for field in required_company_fields if not company_meta.get(field)]
        if missing_fields:
            return jsonify({
                "error": f"Missing required company fields: {', '.join(missing_fields)}",
                "required_fields": required_company_fields
            }), 400
            
        if last_close is None:
            return jsonify({"error": "last_close is required"}), 400
        if not start_date:
            return jsonify({"error": "start_date is required"}), 400
        
        # Set base volatility from market cap if not provided
        if base_vol is None:
            base_vol = get_base_volatility(company_meta.get("market_cap_bucket", "mid_cap"))
        
        # Generate future features
        future_df = make_future_features(
            company_meta=company_meta,
            start_date=start_date,
            horizon=horizon,
            mode=mode,
            controls=controls,
            events=events
        )
        
        # Check if model is available
        if pipe is None:
            print("⚠️  Model not loaded - using synthetic data generation")
            # Generate synthetic log returns based on events and controls
            log_returns = generate_synthetic_returns(future_df, controls, events, base_vol, seed)
            available_features = ["synthetic_generation"]
        else:
            # Use the actual ML model for predictions
            # Prepare features for prediction
            # Assuming the model expects specific columns - adjust as needed
            feature_cols = [
                "overall_market_sentiment", "fii_flows", "dii_flows", 
                "global_market_cues", "inr_usd_delta", "crude_oil_delta",
                "earnings_announcement", "analyst_rating_change",
                "sector", "market_cap_bucket", "major_news", 
                "insider_activity", "predefined_global_shock"
            ]
            
            # Select features that exist in the dataframe
            available_features = [col for col in feature_cols if col in future_df.columns]
            X_future = future_df[available_features]
            
            # Predict log returns
            log_returns = pipe.predict(X_future)
        
        # Generate OHLC data
        ohlc_data = generate_ohlc(
            last_close=last_close,
            log_returns=log_returns,
            dates=future_df["date"],
            base_vol=base_vol,
            seed=seed
        )
        
        # Prepare response
        response = {
            "status": "success",
            "simulation_info": {
                "company_name": company_meta["company_name"],
                "ticker": company_meta["ticker"],
                "sector": company_meta["sector"],
                "market_cap_bucket": company_meta["market_cap_bucket"],
                "mode": mode,
                "horizon": horizon,
                "start_date": start_date,
                "end_date": future_df["date"].iloc[-1].strftime("%Y-%m-%d"),
                "features_used": available_features,
                "num_events_applied": len(events) if events else 0,
                "model_status": "ml_model" if pipe else "synthetic_fallback"
            },
            "ohlc_data": ohlc_data,
            "predicted_log_returns": log_returns.tolist(),
            "feature_panel_shape": {
                "rows": len(future_df),
                "columns": len(available_features)
            }
        }
        
        return jsonify(response)
        
    except ValueError as e:
        return jsonify({"error": f"Validation error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Simulation error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": pipe is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/validate_controls', methods=['POST'])
def validate_controls():
    """Validate control values and return allowed ranges/values."""
    allowed_controls = {
        "numeric": {
            "overall_market_sentiment": {"min": -1.0, "max": 1.0},
            "fii_flows": {"min": -2000, "max": 2000},
            "dii_flows": {"min": -1000, "max": 1000},
            "global_market_cues": {"min": -1.0, "max": 1.0},
            "inr_usd_delta": {"min": -0.05, "max": 0.05},
            "crude_oil_delta": {"min": -0.1, "max": 0.1},
            "earnings_announcement": {"min": 0, "max": 1},
            "analyst_rating_change": {"min": -2, "max": 2}
        },
        "categorical": {
            "major_news": ["none", "positive", "negative"],
            "insider_activity": ["none", "buy", "sell"],
            "predefined_global_shock": ["none", "financial_crisis", "geopolitical", "pandemic"]
        }
    }
    
    return jsonify({
        "status": "success",
        "allowed_controls": allowed_controls
    })

if __name__ == '__main__':
    print("🚀 Starting Financial Simulator Backend...")
    print(f"📊 Model status: {'✅ Loaded' if pipe else '❌ Not loaded'}")
    
    # Run the Flask app
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True
    )
