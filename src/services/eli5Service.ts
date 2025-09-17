const ELI5_SERVICE_URL = 'http://localhost:8000';

export interface ExplanationRequest {
  market_conditions: {
    sentiment: string;
    flows: string;
    global_cues: string;
    exchange_rate: string;
    crude_oil: string;
  };
  sector: string;
  company_size: string;
  price_change: {
    absolute: number;
    percentage: number;
  };
  current_day: number;
  active_events: Array<{
    type: string;
    subtype: string;
    impact: number;
  }>;
}

export interface ELI5Story {
  title: string;
  explanation: string;
  key_points: string[];
  analogy: string;
  prediction: string;
  confidence_score: number;
  market_mood: string;
  sector_context: string;
}

export interface ExplanationResponse {
  story: ELI5Story;
  metadata: {
    processing_time_ms: number;
    model_version: string;
    explanation_type: string;
  };
  timestamp: string;
}

class ELI5Service {
  private baseUrl: string;

  constructor(baseUrl: string = ELI5_SERVICE_URL) {
    this.baseUrl = baseUrl;
  }

  async generateExplanation(request: ExplanationRequest): Promise<ELI5Story> {
    try {
      console.log('🔄 Calling ELI5 microservice with:', request);
      
      const response = await fetch(`${this.baseUrl}/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.warn('⚠️ Microservice unavailable, using fallback');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExplanationResponse = await response.json();
      console.log('✅ Got explanation from microservice:', data.story.title);
      return data.story;
    } catch (error) {
      console.error('❌ Failed to generate explanation from microservice:', error);
      
      // Fallback to a simple explanation if the service is unavailable
      console.log('🔄 Using fallback explanation...');
      return this.getFallbackExplanation(request);
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('ELI5 service health check failed:', error);
      return false;
    }
  }

  async getSupportedSectors(): Promise<Record<string, any>> {
    try {
      const response = await fetch(`${this.baseUrl}/sectors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get sectors from microservice:', error);
      return {};
    }
  }

  private getFallbackExplanation(request: ExplanationRequest): ELI5Story {
    const priceChange = request.price_change.percentage;
    const isPositive = priceChange > 0;
    const isStrong = Math.abs(priceChange) > 2;
    const sentiment = request.market_conditions.sentiment;

    let title: string;
    let explanation: string;
    let analogy: string;
    let mood: string;

    // Generate more dynamic content based on market conditions
    if (isStrong && isPositive) {
      title = "� Stock is Having a Great Day!";
      explanation = `Our company's stock is like a popular toy that everyone wants to buy! The price went up ${Math.abs(priceChange).toFixed(1)}% because investors are feeling ${sentiment} about the market. When people are optimistic and lots of them want the same thing, the price goes up - just like when everyone wants the newest video game!`;
      analogy = sentiment.includes('bullish') 
        ? "It's like a lemonade stand on the hottest day of summer - everyone wants what you're selling!"
        : "It's like having the best cookies at the school bake sale!";
      mood = "Super excited! 🎉";
    } else if (isStrong && !isPositive) {
      title = "📉 Stock Taking a Rest Day";
      explanation = `Today our stock went down ${Math.abs(priceChange).toFixed(1)}%, which happens sometimes in the market. With sentiment being ${sentiment}, people are being more careful with their money - like when you save your allowance instead of spending it right away. It doesn't mean the company is bad, just that investors want to wait and see what happens next.`;
      analogy = sentiment.includes('bearish')
        ? "It's like trying to sell ice cream during a snowstorm - people just aren't in the mood right now."
        : "It's like a good movie that's having a quiet day at the box office.";
      mood = "Taking it easy 😌";
    } else {
      title = "📊 Pretty Normal Day";
      explanation = `Today is a calm day with the stock moving just ${Math.abs(priceChange).toFixed(1)}%. The market sentiment is ${sentiment}, so people are feeling pretty neutral - not super excited, but not worried either. It's like a regular school day where nothing super exciting happens, but everything is running normally.`;
      analogy = "It's like a steady bike ride on a flat road - smooth and predictable.";
      mood = "Just chilling 😐";
    }

    // Add sector and market condition context
    const sectorContext = `This company works in ${request.sector.replace('-', ' ')} industry.`;
    const conditionsContext = `Market conditions: ${request.market_conditions.sentiment} sentiment, ${request.market_conditions.flows} investor flows.`;

    return {
      title,
      explanation: `${explanation}\n\n${sectorContext} ${conditionsContext}`,
      key_points: [
        `Stock moved ${Math.abs(priceChange).toFixed(1)}% today`,
        `Market sentiment: ${sentiment}`,
        `Sector: ${request.sector.replace('-', ' ')}`,
        `Company size: ${request.company_size}`,
        `Global cues: ${request.market_conditions.global_cues}`
      ],
      analogy,
      prediction: isPositive 
        ? "If the good vibes continue, the stock might keep doing well!" 
        : "Things could turn around quickly - markets are full of surprises!",
      confidence_score: 0.6,
      market_mood: mood,
      sector_context: sectorContext
    };
  }
}

export const eli5Service = new ELI5Service();