import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json
import re

class FinancialExplainer:
    """
    Advanced rule-based financial explanation engine that generates ELI5 stories
    based on market conditions, sector patterns, and financial data analysis.
    """
    
    def __init__(self):
        self.market_patterns = self._load_market_patterns()
        self.sector_data = self._load_sector_data()
        self.story_templates = self._load_story_templates()
        self.analogy_bank = self._load_analogy_bank()
        self.financial_indicators = self._load_financial_indicators()
        
    def _load_market_patterns(self) -> Dict:
        """Load historical market patterns and behaviors"""
        return {
            "volatility_patterns": {
                "low": {"threshold": 1.0, "description": "calm waters", "investor_mood": "relaxed"},
                "medium": {"threshold": 3.0, "description": "choppy seas", "investor_mood": "cautious"},
                "high": {"threshold": 5.0, "description": "stormy weather", "investor_mood": "nervous"},
                "extreme": {"threshold": 10.0, "description": "perfect storm", "investor_mood": "panicked"}
            },
            "trend_patterns": {
                "strong_uptrend": {"min_days": 3, "min_gain": 5.0, "confidence": 0.85},
                "weak_uptrend": {"min_days": 2, "min_gain": 2.0, "confidence": 0.65},
                "sideways": {"max_movement": 1.5, "confidence": 0.70},
                "weak_downtrend": {"min_days": 2, "min_loss": -2.0, "confidence": 0.65},
                "strong_downtrend": {"min_days": 3, "min_loss": -5.0, "confidence": 0.85}
            },
            "market_cycles": {
                "bull_market": {"duration_months": [12, 60], "avg_gain": 15.0},
                "bear_market": {"duration_months": [6, 18], "avg_loss": -20.0},
                "correction": {"duration_days": [30, 90], "avg_loss": -10.0},
                "rally": {"duration_days": [5, 30], "avg_gain": 8.0}
            }
        }
    
    def _load_sector_data(self) -> Dict:
        """Load sector-specific behavior patterns and correlations"""
        return {
            "financial-services": {
                "volatility_multiplier": 1.2,
                "interest_rate_sensitivity": "high",
                "economic_cycle_correlation": 0.85,
                "key_drivers": ["interest rates", "economic growth", "credit conditions"],
                "analogies": ["banks are like heart pumping money", "financial plumbing of economy"],
                "seasonal_patterns": {"q4": "strong", "q1": "weak"},
                "regulatory_impact": "high"
            },
            "it": {
                "volatility_multiplier": 1.5,
                "growth_sensitivity": "high",
                "innovation_impact": 0.9,
                "key_drivers": ["innovation", "digital transformation", "consumer demand"],
                "analogies": ["digital wizards making magic", "building tomorrow's world"],
                "seasonal_patterns": {"q4": "strong", "q2": "moderate"},
                "regulatory_impact": "medium"
            },
            "healthcare": {
                "volatility_multiplier": 0.8,
                "demographic_correlation": 0.75,
                "regulatory_sensitivity": "very_high",
                "key_drivers": ["aging population", "drug approvals", "healthcare policy"],
                "analogies": ["doctors for the whole world", "medicine makers"],
                "seasonal_patterns": {"q1": "strong", "q3": "weak"},
                "regulatory_impact": "very_high"
            },
            "energy": {
                "volatility_multiplier": 2.0,
                "oil_correlation": 0.85,
                "geopolitical_sensitivity": "very_high",
                "key_drivers": ["oil prices", "renewable transition", "geopolitics"],
                "analogies": ["gas station for the world", "power button of economy"],
                "seasonal_patterns": {"summer": "strong", "spring": "weak"},
                "regulatory_impact": "high"
            },
            "consumer-discretionary": {
                "volatility_multiplier": 1.3,
                "consumer_confidence_correlation": 0.8,
                "economic_sensitivity": "high",
                "key_drivers": ["consumer spending", "employment", "disposable income"],
                "analogies": ["toy store when kids have allowance", "fun stuff people buy"],
                "seasonal_patterns": {"q4": "very_strong", "q1": "weak"},
                "regulatory_impact": "low"
            }
        }
    
    def _load_story_templates(self) -> Dict:
        """Load story templates for different market scenarios"""
        return {
            "strong_bullish": {
                "titles": [
                    "🚀 Stock is Having an Amazing Day!",
                    "📈 Everyone Wants to Buy Our Shares!",
                    "💰 Investors Are Super Excited Today!",
                    "⭐ Our Company is the Star of the Show!"
                ],
                "opening_lines": [
                    "Imagine our stock is like the most popular ice cream flavor on a hot summer day",
                    "Think of our company like a really cool new toy that everyone wants",
                    "Our shares are like tickets to the best concert ever",
                    "Picture our stock as a lemonade stand with the best recipe in town"
                ],
                "explanations": [
                    "When lots of people want to buy something and there's only so much available, the price goes up! It's like when everyone wants the same limited edition sneakers.",
                    "Good news about our company is spreading, and investors are getting excited. It's like when word spreads that a restaurant has amazing food!",
                    "Our company is doing better than people expected, so more investors want to own a piece of it. Like finding out your favorite team has a secret winning strategy!"
                ]
            },
            "strong_bearish": {
                "titles": [
                    "📉 Stock is Taking a Rest Day",
                    "😟 Investors Are Being Extra Careful",
                    "🛑 People Are Waiting to See What Happens",
                    "💭 Market is Having Second Thoughts"
                ],
                "opening_lines": [
                    "Sometimes even the best ice cream shop has a quiet day",
                    "Our stock is like a popular ride that's temporarily closed for maintenance",
                    "Think of today like a rainy day when fewer people go to the amusement park",
                    "Our shares are like a good book that people are saving to read later"
                ],
                "explanations": [
                    "When people are worried about spending money, they hold onto it instead of investing. It's like saving your allowance when you're not sure what you want to buy.",
                    "Some concerning news is making investors cautious. It's like when you hear thunder and decide to stay inside even though it's not raining yet.",
                    "People are waiting to see if things get better before they buy more shares. Like waiting to see if a movie gets good reviews before going to see it."
                ]
            },
            "event_driven": {
                "earnings_beat": "The company just showed their report card and got straight A's! This makes investors really happy and confident.",
                "earnings_miss": "The company's report card wasn't as good as everyone hoped. It's like getting a B+ when you expected an A.",
                "analyst_upgrade": "Smart money experts raised their grade for our company - like a teacher saying your project is better than they first thought!",
                "analyst_downgrade": "Money experts lowered their expectations a bit - like a teacher saying the test might be harder than expected.",
                "positive_news": "Great news came out that makes our company look stronger - like finding out your favorite athlete just won a big competition!",
                "negative_news": "Some worrying news appeared that makes people think twice - like hearing your favorite restaurant might close."
            }
        }
    
    def _load_analogy_bank(self) -> Dict:
        """Load analogies for different financial concepts"""
        return {
            "price_movements": {
                "up_strong": [
                    "like a rocket taking off to the moon",
                    "like a hot air balloon rising on a perfect day",
                    "like climbing a mountain with the best equipment",
                    "like a superhero flying higher and higher"
                ],
                "up_gentle": [
                    "like a bird gently rising in the sky",
                    "like walking up a hill with a nice breeze",
                    "like a balloon slowly floating upward",
                    "like growing taller bit by bit"
                ],
                "down_strong": [
                    "like a roller coaster going down the big hill",
                    "like leaves falling in autumn",
                    "like sliding down a playground slide",
                    "like a ball rolling down a steep hill"
                ],
                "down_gentle": [
                    "like slowly walking down some stairs",
                    "like a feather floating gently to the ground",
                    "like water slowly draining from a bathtub",
                    "like gradually cooling down after exercise"
                ],
                "sideways": [
                    "like a boat floating calmly on still water",
                    "like riding a bike on a flat road",
                    "like a see-saw perfectly balanced",
                    "like a plane cruising at the same altitude"
                ]
            },
            "market_sentiment": {
                "very_positive": "like kids on Christmas morning - everyone's super excited!",
                "positive": "like students on the last day of school - feeling pretty good!",
                "neutral": "like a regular Tuesday - nothing special happening",
                "negative": "like waiting in line at the dentist - a bit worried",
                "very_negative": "like kids when they hear thunder - everyone's scared"
            },
            "volume_patterns": {
                "high": "like a busy playground at recess - lots of activity!",
                "low": "like a library during study time - very quiet",
                "normal": "like a regular school day - typical amount of activity"
            }
        }
    
    def _load_financial_indicators(self) -> Dict:
        """Load financial indicators and their ELI5 explanations"""
        return {
            "rsi": {
                "overbought": "The stock has been bought so much it's like a toy everyone wants but is now too expensive",
                "oversold": "The stock has been sold so much it's like a good toy on clearance that people forgot about",
                "neutral": "The stock is priced just right - not too hot, not too cold"
            },
            "moving_averages": {
                "above_ma": "The stock price is above its average - like scoring above your usual grade average",
                "below_ma": "The stock price is below its average - like scoring below your usual grade average",
                "at_ma": "The stock price is right at its average - perfectly normal performance"
            },
            "volume": {
                "high_on_up": "Lots of people are buying because they're excited - like a popular food truck with a long line",
                "high_on_down": "Lots of people are selling because they're worried - like everyone leaving a movie that turned out to be bad",
                "low": "Not many people are buying or selling - like a quiet day at the store"
            }
        }
    
    def generate_story(self, context: Dict) -> Dict:
        """Generate a comprehensive ELI5 story based on market context"""
        
        # Analyze the situation
        analysis = self._analyze_market_context(context)
        
        # Generate story components
        title = self._generate_title(analysis)
        explanation = self._generate_explanation(analysis, context)
        key_points = self._generate_key_points(analysis, context)
        analogy = self._generate_analogy(analysis)
        prediction = self._generate_prediction(analysis, context)
        
        # Calculate confidence score
        confidence = self._calculate_confidence(analysis, context)
        
        # Determine market mood
        market_mood = self._determine_market_mood(context)
        
        # Add sector context
        sector_context = self._generate_sector_context(context["sector"], analysis)
        
        return {
            "title": title,
            "explanation": explanation,
            "key_points": key_points,
            "analogy": analogy,
            "prediction": prediction,
            "confidence_score": confidence,
            "market_mood": market_mood,
            "sector_context": sector_context
        }
    
    def _analyze_market_context(self, context: Dict) -> Dict:
        """Analyze market context to determine key patterns and signals"""
        price_change = context["price_change"]["percentage"]
        abs_change = abs(price_change)
        
        # Determine volatility level
        volatility_level = "low"
        for level, data in self.market_patterns["volatility_patterns"].items():
            if abs_change >= data["threshold"]:
                volatility_level = level
        
        # Determine movement strength and direction
        movement_strength = "weak" if abs_change < 2.0 else "moderate" if abs_change < 5.0 else "strong"
        direction = "up" if price_change > 0 else "down" if price_change < 0 else "flat"
        
        # Analyze market conditions sentiment
        sentiment_score = self._calculate_sentiment_score(context["market_conditions"])
        
        # Determine event impact
        event_impact = self._analyze_events(context.get("active_events", []))
        
        # Sector analysis
        sector_multiplier = self.sector_data.get(context["sector"], {}).get("volatility_multiplier", 1.0)
        
        return {
            "volatility_level": volatility_level,
            "movement_strength": movement_strength,
            "direction": direction,
            "sentiment_score": sentiment_score,
            "event_impact": event_impact,
            "sector_multiplier": sector_multiplier,
            "abs_change": abs_change,
            "price_change": price_change
        }
    
    def _calculate_sentiment_score(self, conditions: Dict) -> float:
        """Calculate overall market sentiment score"""
        sentiment_weights = {
            "sentiment": 0.3,
            "flows": 0.25,
            "global_cues": 0.2,
            "exchange_rate": 0.15,
            "crude_oil": 0.1
        }
        
        sentiment_values = {
            "strongly-bullish": 1.0, "bullish": 0.6, "neutral": 0.0, 
            "bearish": -0.6, "strongly-bearish": -1.0,
            "positive": 0.7, "negative": -0.7, "stable": 0.0,
            "strengthening": 0.5, "weakening": -0.5,
            "rising": 0.4, "falling": -0.4
        }
        
        total_score = 0.0
        for condition, value in conditions.items():
            if condition in sentiment_weights:
                score = sentiment_values.get(value, 0.0)
                total_score += score * sentiment_weights[condition]
        
        return total_score
    
    def _analyze_events(self, events: List) -> Dict:
        """Analyze active events and their impact"""
        if not events:
            return {"count": 0, "net_impact": 0.0, "types": []}
        
        total_impact = sum(event.get("impact", 1.0) - 1.0 for event in events)
        event_types = [event.get("type", "unknown") for event in events]
        
        return {
            "count": len(events),
            "net_impact": total_impact,
            "types": event_types
        }
    
    def _generate_title(self, analysis: Dict) -> str:
        """Generate an engaging title based on analysis"""
        movement = analysis["movement_strength"]
        direction = analysis["direction"]
        
        if direction == "up" and movement in ["moderate", "strong"]:
            templates = self.story_templates["strong_bullish"]["titles"]
        elif direction == "down" and movement in ["moderate", "strong"]:
            templates = self.story_templates["strong_bearish"]["titles"]
        else:
            templates = [
                "📊 Another Day in the Stock Market",
                "🤷‍♂️ Pretty Normal Trading Day",
                "📈 Stock Taking it Easy Today",
                "💭 Quiet Day for Our Shares"
            ]
        
        return random.choice(templates)
    
    def _generate_explanation(self, analysis: Dict, context: Dict) -> str:
        """Generate detailed explanation with multiple paragraphs"""
        direction = analysis["direction"]
        movement = analysis["movement_strength"]
        
        # Main explanation based on price movement
        if direction == "up" and movement in ["moderate", "strong"]:
            base_explanation = random.choice(self.story_templates["strong_bullish"]["explanations"])
        elif direction == "down" and movement in ["moderate", "strong"]:
            base_explanation = random.choice(self.story_templates["strong_bearish"]["explanations"])
        else:
            base_explanation = "Today is pretty calm in the stock market. Our shares are staying around the same price, which is totally normal. Sometimes stocks need a break from big movements!"
        
        # Add sector context
        sector = context["sector"]
        sector_info = self.sector_data.get(sector, {})
        sector_explanation = f"\n\nOur company works in {sector.replace('-', ' ')}, which means {random.choice(sector_info.get('analogies', ['they do important business work']))}"
        
        # Add market conditions context
        sentiment_score = analysis["sentiment_score"]
        if sentiment_score > 0.3:
            mood_explanation = "\n\nOverall, people are feeling pretty good about the stock market right now, like when everyone's excited about going to a fun party!"
        elif sentiment_score < -0.3:
            mood_explanation = "\n\nOverall, people are being more careful with their money right now, like when you're not sure if you want to spend your allowance yet."
        else:
            mood_explanation = "\n\nPeople are feeling pretty neutral about the market - not super excited, but not worried either."
        
        # Add event explanation if any
        event_explanation = ""
        if analysis["event_impact"]["count"] > 0:
            event_explanation = f"\n\nPlus, there's some special news happening today that's affecting how people feel about our stock!"
        
        return base_explanation + sector_explanation + mood_explanation + event_explanation
    
    def _generate_key_points(self, analysis: Dict, context: Dict) -> List[str]:
        """Generate key bullet points"""
        points = []
        
        # Price movement point
        abs_change = analysis["abs_change"]
        if abs_change > 5:
            points.append(f"Big price movement: {abs_change:.1f}% change today!")
        elif abs_change > 2:
            points.append(f"Noticeable price movement: {abs_change:.1f}% change")
        else:
            points.append(f"Small price movement: {abs_change:.1f}% change (pretty normal)")
        
        # Sector point
        sector = context["sector"].replace("-", " ").title()
        points.append(f"Company operates in {sector} industry")
        
        # Market sentiment point
        sentiment_score = analysis["sentiment_score"]
        if sentiment_score > 0.3:
            points.append("Overall market mood is positive")
        elif sentiment_score < -0.3:
            points.append("Overall market mood is cautious")
        else:
            points.append("Overall market mood is neutral")
        
        # Events point
        if analysis["event_impact"]["count"] > 0:
            points.append(f"{analysis['event_impact']['count']} special event(s) happening")
        
        # Volatility point
        vol_level = analysis["volatility_level"]
        if vol_level in ["high", "extreme"]:
            points.append("Higher than normal volatility today")
        elif vol_level == "low":
            points.append("Very calm trading day")
        
        return points
    
    def _generate_analogy(self, analysis: Dict) -> str:
        """Generate a simple analogy for the situation"""
        direction = analysis["direction"]
        movement = analysis["movement_strength"]
        
        if direction == "up":
            if movement == "strong":
                return random.choice(self.analogy_bank["price_movements"]["up_strong"])
            else:
                return random.choice(self.analogy_bank["price_movements"]["up_gentle"])
        elif direction == "down":
            if movement == "strong":
                return random.choice(self.analogy_bank["price_movements"]["down_strong"])
            else:
                return random.choice(self.analogy_bank["price_movements"]["down_gentle"])
        else:
            return random.choice(self.analogy_bank["price_movements"]["sideways"])
    
    def _generate_prediction(self, analysis: Dict, context: Dict) -> str:
        """Generate a simple prediction for what might happen next"""
        direction = analysis["direction"]
        sentiment_score = analysis["sentiment_score"]
        
        predictions = []
        
        if sentiment_score > 0.5 and direction == "up":
            predictions = [
                "If people keep feeling good about this company, the price might stay high or go even higher!",
                "With all this positive energy, the stock might continue doing well!",
                "The good vibes might keep the price moving up!"
            ]
        elif sentiment_score < -0.5 and direction == "down":
            predictions = [
                "The price might stay low until people feel better about buying again.",
                "It might take some time for investors to get excited again.",
                "The stock might need to prove itself before people start buying more."
            ]
        else:
            predictions = [
                "Tomorrow could bring changes - markets are always full of surprises!",
                "Stocks can change direction quickly, so we'll have to wait and see!",
                "The market is unpredictable, which makes it exciting!"
            ]
        
        return random.choice(predictions)
    
    def _calculate_confidence(self, analysis: Dict, context: Dict) -> float:
        """Calculate confidence score for the explanation"""
        base_confidence = 0.7
        
        # Adjust based on movement strength
        if analysis["movement_strength"] == "strong":
            base_confidence += 0.2
        elif analysis["movement_strength"] == "weak":
            base_confidence -= 0.1
        
        # Adjust based on sentiment clarity
        abs_sentiment = abs(analysis["sentiment_score"])
        if abs_sentiment > 0.5:
            base_confidence += 0.15
        elif abs_sentiment < 0.2:
            base_confidence -= 0.1
        
        # Adjust based on events
        if analysis["event_impact"]["count"] > 0:
            base_confidence += 0.1
        
        return min(max(base_confidence, 0.0), 1.0)
    
    def _determine_market_mood(self, context: Dict) -> str:
        """Determine overall market mood description"""
        conditions = context["market_conditions"]
        sentiment = conditions.get("sentiment", "neutral")
        
        mood_map = {
            "strongly-bullish": "Super excited! 🚀",
            "bullish": "Pretty optimistic 📈",
            "neutral": "Just chilling 😐",
            "bearish": "A bit worried 😟",
            "strongly-bearish": "Pretty scared 😰"
        }
        
        return mood_map.get(sentiment, "Not sure how to feel 🤔")
    
    def _generate_sector_context(self, sector: str, analysis: Dict) -> str:
        """Generate sector-specific context"""
        sector_info = self.sector_data.get(sector, {})
        key_drivers = sector_info.get("key_drivers", ["market conditions"])
        
        context = f"Companies in {sector.replace('-', ' ')} are mainly affected by {', '.join(key_drivers[:2])}."
        
        if analysis["movement_strength"] != "weak":
            regulatory_impact = sector_info.get("regulatory_impact", "medium")
            if regulatory_impact == "high":
                context += " This sector is also sensitive to government rules and regulations."
            elif regulatory_impact == "very_high":
                context += " This sector is heavily influenced by government policies and regulations."
        
        return context
    
    def get_current_timestamp(self) -> str:
        """Get current timestamp"""
        return datetime.now().isoformat()
    
    def get_sector_info(self) -> Dict:
        """Get information about supported sectors"""
        return {
            sector: {
                "name": sector.replace("-", " ").title(),
                "key_drivers": data.get("key_drivers", []),
                "volatility_level": "High" if data.get("volatility_multiplier", 1.0) > 1.3 else 
                                 "Low" if data.get("volatility_multiplier", 1.0) < 0.9 else "Medium"
            }
            for sector, data in self.sector_data.items()
        }
    
    def get_market_condition_options(self) -> Dict:
        """Get available market condition options"""
        return {
            "sentiment": ["strongly-bullish", "bullish", "neutral", "bearish", "strongly-bearish"],
            "flows": ["positive", "neutral", "negative"],
            "global_cues": ["positive", "neutral", "negative"],
            "exchange_rate": ["strengthening", "stable", "weakening"],
            "crude_oil": ["rising", "stable", "falling"]
        }