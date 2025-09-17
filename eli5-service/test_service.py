import requests
import json

def test_eli5_service():
    """Test the ELI5 financial explanation service"""
    
    base_url = "http://localhost:8000"
    
    # Test health check
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Test explanation generation
    print("\n📊 Testing explanation generation...")
    
    test_request = {
        "market_conditions": {
            "sentiment": "bullish",
            "flows": "positive",
            "global_cues": "positive",
            "exchange_rate": "stable",
            "crude_oil": "rising"
        },
        "sector": "it",
        "company_size": "mid-cap",
        "price_change": {
            "absolute": 45.30,
            "percentage": 2.45
        },
        "current_day": 15,
        "active_events": [
            {
                "type": "earnings",
                "subtype": "beat",
                "impact": 1.15
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{base_url}/explain",
            json=test_request,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            story = result["story"]
            
            print("✅ Successfully generated explanation!")
            print(f"\n📝 Title: {story['title']}")
            print(f"\n📖 Explanation: {story['explanation'][:200]}...")
            print(f"\n🎯 Key Points: {story['key_points'][:2]}")
            print(f"\n🎭 Analogy: {story['analogy']}")
            print(f"\n🔮 Prediction: {story['prediction']}")
            print(f"\n📊 Confidence: {story['confidence_score']:.2f}")
            print(f"\n😊 Market Mood: {story['market_mood']}")
            
        else:
            print(f"❌ Request failed with status {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    # Test other endpoints
    print("\n🏢 Testing sectors endpoint...")
    try:
        response = requests.get(f"{base_url}/sectors")
        sectors = response.json()
        print(f"✅ Available sectors: {list(sectors.keys())[:3]}...")
    except Exception as e:
        print(f"❌ Sectors endpoint failed: {e}")

if __name__ == "__main__":
    test_eli5_service()