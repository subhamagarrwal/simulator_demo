import { MarketConditions, CompanyEvent } from './PriceSimulationEngine';

export interface StoryContext {
  marketConditions: MarketConditions;
  sector: string;
  companySize: string;
  priceChange: { absolute: number; percentage: number };
  currentDay: number;
  activeEvents: CompanyEvent[];
  previousPriceChange?: { absolute: number; percentage: number };
}

export interface ELI5Story {
  title: string;
  explanation: string;
  keyPoints: string[];
  analogy: string;
  prediction: string;
}

export class ELI5StoryGenerator {
  private storyTemplates = {
    // Price movement patterns
    strongBullish: {
      titles: [
        "📈 Our Stock is Having a Great Day!",
        "🚀 Shares Are Flying High Today!",
        "💰 Investors Are Really Happy Today!"
      ],
      explanations: [
        "Think of our company's stock like a popular toy that everyone wants to buy. When lots of people want the same toy, the price goes up because the store knows people really want it!",
        "Our company's shares are like tickets to a really cool movie. When everyone hears it's amazing, more people want tickets, so the price goes higher!",
        "Imagine our stock is like a lemonade stand on a hot day. When everyone is thirsty and wants lemonade, we can charge more because people really need what we're selling!"
      ]
    },
    strongBearish: {
      titles: [
        "📉 Our Stock is Taking a Break Today",
        "😟 Investors Are Being Careful Today",
        "📊 Stock Price is Going Down Right Now"
      ],
      explanations: [
        "Sometimes when people are worried about spending money, they don't buy as many things. It's like when kids save their allowance instead of buying candy - fewer people buying means lower prices.",
        "Think of our stock like an ice cream truck on a cold day. Even though the ice cream is still good, fewer people want to buy it when it's chilly outside!",
        "Our shares are like a popular game that just got harder to play. Some people are selling their copies because they're not sure if they want to keep playing right now."
      ]
    },
    neutral: {
      titles: [
        "😐 Stock is Taking it Easy Today",
        "📊 Pretty Normal Day for Our Stock",
        "🤷‍♂️ Not Much Happening in the Market Today"
      ],
      explanations: [
        "Today is like a regular school day - nothing super exciting happened, but nothing bad either. Our stock price is just staying about the same.",
        "Think of today like the weather being just right - not too hot, not too cold. Investors are feeling pretty 'meh' about buying or selling.",
        "Our stock is like a steady friend who doesn't have big mood swings. Some days are just calm and normal!"
      ]
    }
  };

  private sectorAnalogies = {
    'financial-services': {
      simple: "banks and money companies",
      analogy: "like the piggy bank where everyone keeps their money safe"
    },
    'it': {
      simple: "computer and tech companies", 
      analogy: "like the people who make our phones, apps, and video games"
    },
    'healthcare': {
      simple: "doctors and medicine companies",
      analogy: "like hospitals and companies that make medicine to help sick people"
    },
    'consumer-discretionary': {
      simple: "stores and fun stuff companies",
      analogy: "like toy stores, restaurants, and places that sell things we want but don't really need"
    },
    'consumer-staples': {
      simple: "grocery and basic needs companies",
      analogy: "like supermarkets and companies that make food, soap, and stuff we use every day"
    },
    'energy': {
      simple: "oil and power companies",
      analogy: "like gas stations and companies that make electricity for our homes"
    },
    'materials': {
      simple: "companies that make basic stuff",
      analogy: "like factories that make metal, wood, and materials to build things"
    },
    'industrials': {
      simple: "big machine companies",
      analogy: "like companies that make trucks, airplanes, and big machines for factories"
    },
    'utilities': {
      simple: "water and electricity companies",
      analogy: "like the people who make sure we have lights, water, and heat in our homes"
    },
    'real-estate': {
      simple: "house and building companies",
      analogy: "like people who build houses, offices, and help others buy or rent places to live"
    },
    'telecommunications': {
      simple: "phone and internet companies",
      analogy: "like companies that help us call friends and use the internet"
    },
    'automotive': {
      simple: "car companies",
      analogy: "like factories that make cars, trucks, and motorcycles"
    },
    'media-entertainment': {
      simple: "movie and TV companies",
      analogy: "like companies that make movies, TV shows, and fun entertainment"
    }
  };

  private eventExplanations = {
    earnings: {
      positive: "The company just showed their report card and got really good grades! This makes investors happy.",
      negative: "The company's report card wasn't as good as expected, so some investors are disappointed."
    },
    analyst: {
      upgrade: "Smart money experts said our company is doing better than they thought - like a teacher raising your grade!",
      downgrade: "Money experts think our company might not do as well as they hoped - like getting a lower grade than expected."
    },
    news: {
      positive: "Good news came out about our company today, like hearing your favorite team won a big game!",
      negative: "Some not-so-good news came out, which made investors a bit worried."
    },
    insider: {
      buying: "The company's own bosses are buying more shares - like the chef eating at their own restaurant because they know the food is good!",
      selling: "Some company bosses sold their shares, which can make other investors wonder why."
    }
  };

  public generateStory(context: StoryContext): ELI5Story {
    const priceChangePercent = Math.abs(context.priceChange.percentage);
    const isPositive = context.priceChange.percentage > 0;
    const isStrong = priceChangePercent > 2;
    
    let storyType: 'strongBullish' | 'strongBearish' | 'neutral';
    
    if (isStrong && isPositive) {
      storyType = 'strongBullish';
    } else if (isStrong && !isPositive) {
      storyType = 'strongBearish';
    } else {
      storyType = 'neutral';
    }

    const template = this.storyTemplates[storyType];
    const sectorInfo = this.sectorAnalogies[context.sector as keyof typeof this.sectorAnalogies] || {
      simple: "companies in this business area",
      analogy: "like other companies that do similar work"
    };

    // Generate the story
    const title = this.getRandomItem(template.titles);
    const baseExplanation = this.getRandomItem(template.explanations);
    
    // Add sector context
    const sectorExplanation = `Our company is in the ${sectorInfo.simple} business - ${sectorInfo.analogy}.`;
    
    // Add market condition context
    const marketExplanation = this.generateMarketExplanation(context.marketConditions);
    
    // Add event explanations
    const eventExplanations = context.activeEvents.map(event => 
      this.generateEventExplanation(event)
    ).filter(Boolean);

    // Combine explanations
    let fullExplanation = `${baseExplanation}\n\n${sectorExplanation}`;
    if (marketExplanation) {
      fullExplanation += `\n\n${marketExplanation}`;
    }
    if (eventExplanations.length > 0) {
      fullExplanation += `\n\n${eventExplanations.join(' ')}`;
    }

    // Generate key points
    const keyPoints = this.generateKeyPoints(context);
    
    // Generate analogy
    const analogy = this.generateAnalogy(context, storyType);
    
    // Generate prediction
    const prediction = this.generatePrediction(context, storyType);

    return {
      title,
      explanation: fullExplanation,
      keyPoints,
      analogy,
      prediction
    };
  }

  private generateMarketExplanation(conditions: MarketConditions): string {
    const explanations: string[] = [];

    // Sentiment explanation
    if (conditions.sentiment === 'strongly-bullish' || conditions.sentiment === 'bullish') {
      explanations.push("People are feeling really good about buying stocks right now, like kids excited about going to an amusement park!");
    } else if (conditions.sentiment === 'strongly-bearish' || conditions.sentiment === 'bearish') {
      explanations.push("People are being more careful with their money, like saving allowance instead of spending it on toys.");
    }

    // Global cues
    if (conditions.globalCues === 'positive') {
      explanations.push("Good news from around the world is making investors happy.");
    } else if (conditions.globalCues === 'negative') {
      explanations.push("Some worrying news from other countries is making people more careful.");
    }

    return explanations.join(' ');
  }

  private generateEventExplanation(event: CompanyEvent): string {
    if (event.type === 'earnings') {
      const earningsEvent = this.eventExplanations.earnings;
      return event.impact > 1 ? earningsEvent.positive : earningsEvent.negative;
    } else if (event.type === 'analyst') {
      const analystEvent = this.eventExplanations.analyst;
      return event.impact > 1 ? analystEvent.upgrade : analystEvent.downgrade;
    } else if (event.type === 'news') {
      const newsEvent = this.eventExplanations.news;
      return event.impact > 1 ? newsEvent.positive : newsEvent.negative;
    } else if (event.type === 'insider') {
      const insiderEvent = this.eventExplanations.insider;
      return event.impact > 1 ? insiderEvent.buying : insiderEvent.selling;
    }

    return '';
  }

  private generateKeyPoints(context: StoryContext): string[] {
    const points: string[] = [];
    
    const changePercent = Math.abs(context.priceChange.percentage);
    if (changePercent > 5) {
      points.push(`Stock moved ${changePercent.toFixed(1)}% - that's a pretty big change!`);
    } else if (changePercent > 2) {
      points.push(`Stock moved ${changePercent.toFixed(1)}% - a noticeable change.`);
    } else {
      points.push(`Stock moved ${changePercent.toFixed(1)}% - a small, normal change.`);
    }

    if (context.activeEvents.length > 0) {
      points.push(`${context.activeEvents.length} special event(s) happened today.`);
    }

    const sectorInfo = this.sectorAnalogies[context.sector as keyof typeof this.sectorAnalogies];
    if (sectorInfo) {
      points.push(`This company works with ${sectorInfo.simple}.`);
    }

    return points;
  }

  private generateAnalogy(context: StoryContext, storyType: string): string {
    if (storyType === 'strongBullish') {
      return "It's like having a lemonade stand on the hottest day of summer - everyone wants what you're selling!";
    } else if (storyType === 'strongBearish') {
      return "It's like trying to sell ice cream during a snowstorm - people just aren't in the mood to buy right now.";
    } else {
      return "It's like a regular day at school - nothing super exciting, but nothing bad either.";
    }
  }

  private generatePrediction(context: StoryContext, storyType: string): string {
    if (storyType === 'strongBullish') {
      return "If people keep feeling good about this company, the price might stay high or go even higher!";
    } else if (storyType === 'strongBearish') {
      return "The price might stay low until people feel better about buying again.";
    } else {
      return "Tomorrow could bring changes - markets are always full of surprises!";
    }
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Simple sentiment analysis for basic ML touch (rule-based)
  public analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'excellent', 'up', 'high', 'strong', 'bullish', 'gain', 'profit', 'growth'];
    const negativeWords = ['bad', 'poor', 'down', 'low', 'weak', 'bearish', 'loss', 'decline', 'drop', 'fall'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  // Pattern matching for market conditions
  public detectMarketPattern(priceHistory: number[]): string {
    if (priceHistory.length < 3) return 'insufficient-data';
    
    const recent = priceHistory.slice(-3);
    const trend = recent.map((price, index) => {
      if (index === 0) return 0;
      return price > recent[index - 1] ? 1 : -1;
    }).slice(1);
    
    const upTrend = trend.filter(t => t === 1).length;
    const downTrend = trend.filter(t => t === -1).length;
    
    if (upTrend >= 2) return 'upward-trend';
    if (downTrend >= 2) return 'downward-trend';
    return 'sideways';
  }
}