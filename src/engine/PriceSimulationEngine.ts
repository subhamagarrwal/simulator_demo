import { sectorModels, getDefaultSectorModel, SectorImpactModel } from '../models/sectorModels';

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketConditions {
  sentiment: string;
  flows: string;
  globalCues: string;
  exchangeRate: string;
  crudeOil: string;
}

export interface CompanyEvent {
  type: 'earnings' | 'analyst' | 'news' | 'insider' | 'shock';
  subtype: string;
  impact: number;
}

export interface SimulationState {
  currentPrice: number;
  currentDay: number;
  startTime: Date;
  historicalData: CandlestickData[];
  companyProfile: {
    size: string;
    sector: string;
    companySizeValue: number; // Random value between 10-98
  };
  marketConditions: MarketConditions;
  activeEvents: CompanyEvent[];
  basePrice: number;
}

export class PriceSimulationEngine {
  private state: SimulationState;
  private sectorModel: SectorImpactModel;
  
  // Generate a random company size value between 10-98
  private generateRandomCompanySize(): number {
    return Math.floor(Math.random() * (98 - 10 + 1)) + 10;
  }
  
  // Base prices for different company sizes
  private getBasePriceForSize(size: string): number {
    switch (size) {
      case 'small-cap':
        return 124.36;
      case 'mid-cap':
        return 154.80;
      case 'large-cap':
        return 179.52;
      default:
        return 154.80; // default to mid-cap
    }
  }
  
  constructor(initialState: Partial<SimulationState>) {
    const companySize = initialState.companyProfile?.size || 'mid-cap';
    const basePrice = initialState.basePrice || this.getBasePriceForSize(companySize);
    const randomSizeValue = this.generateRandomCompanySize();
    
    this.state = {
      currentPrice: basePrice,
      currentDay: 1,
      startTime: new Date(),
      historicalData: [],
      companyProfile: { 
        size: companySize, 
        sector: 'it',
        companySizeValue: randomSizeValue
      },
      marketConditions: {
        sentiment: 'neutral',
        flows: 'neutral',
        globalCues: 'neutral',
        exchangeRate: 'stable',
        crudeOil: 'stable'
      },
      activeEvents: [],
      basePrice: basePrice,
      ...initialState
    };
    
    this.sectorModel = sectorModels[this.state.companyProfile.sector] || getDefaultSectorModel();
    this.initializeHistoricalData();
  }
  
  private initializeHistoricalData() {
    // Generate 30 days of historical data
    const basePrice = this.state.basePrice;
    let currentPrice = basePrice;
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyVolatility = this.sectorModel.baseVolatility / 100;
      const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
      const priceChange = currentPrice * dailyVolatility * randomFactor;
      
      const open = currentPrice;
      const close = Math.max(open + priceChange, open * 0.85); // Minimum 15% drop protection
      
      // Generate intraday high and low
      const volatilityRange = Math.abs(close - open) + (currentPrice * dailyVolatility * 0.5);
      const high = Math.max(open, close) + (volatilityRange * Math.random());
      const low = Math.min(open, close) - (volatilityRange * Math.random());
      
      // Generate volume (higher volume on larger price movements)
      const baseVolume = 1000000;
      const volumeMultiplier = 1 + Math.abs(priceChange / currentPrice) * 3;
      const volume = Math.floor(baseVolume * volumeMultiplier * (0.7 + Math.random() * 0.6));
      
      this.state.historicalData.push({
        time: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
      
      currentPrice = close;
    }
    
    this.state.currentPrice = currentPrice;
  }
  
  public updateSector(sector: string) {
    this.state.companyProfile.sector = sector;
    this.sectorModel = sectorModels[sector] || getDefaultSectorModel();
  }
  
  public updateMarketConditions(conditions: Partial<MarketConditions>) {
    this.state.marketConditions = { ...this.state.marketConditions, ...conditions };
  }
  
  public addEvent(event: CompanyEvent) {
    this.state.activeEvents.push(event);
  }
  
  public clearEvents() {
    this.state.activeEvents = [];
  }
  
  public calculateMarketImpact(): number {
    let totalImpact = 1.0;
    
    // Market sentiment impact
    totalImpact *= this.sectorModel.sentimentMultipliers[this.state.marketConditions.sentiment as keyof typeof this.sectorModel.sentimentMultipliers] || 1.0;
    
    // Investor flows impact
    totalImpact *= this.sectorModel.flowsImpact[this.state.marketConditions.flows as keyof typeof this.sectorModel.flowsImpact] || 1.0;
    
    // Global cues impact
    totalImpact *= this.sectorModel.globalCuesImpact[this.state.marketConditions.globalCues as keyof typeof this.sectorModel.globalCuesImpact] || 1.0;
    
    // Currency impact
    totalImpact *= this.sectorModel.currencyImpact[this.state.marketConditions.exchangeRate as keyof typeof this.sectorModel.currencyImpact] || 1.0;
    
    // Oil impact
    totalImpact *= this.sectorModel.oilImpact[this.state.marketConditions.crudeOil as keyof typeof this.sectorModel.oilImpact] || 1.0;
    
    // Company size impact
    const sizeMultipliers = {
      'small-cap': 1.2, // More volatile
      'mid-cap': 1.0,
      'large-cap': 0.8  // Less volatile
    };
    totalImpact *= sizeMultipliers[this.state.companyProfile.size as keyof typeof sizeMultipliers] || 1.0;
    
    // Event impacts
    this.state.activeEvents.forEach(event => {
      const eventImpact = this.sectorModel.eventImpacts[event.type]?.[event.subtype as keyof typeof this.sectorModel.eventImpacts[typeof event.type]] || 1.0;
      totalImpact *= eventImpact;
    });
    
    return totalImpact;
  }
  
  // Debug method to see impact breakdown
  public getMarketImpactBreakdown(): any {
    const sentiment = this.sectorModel.sentimentMultipliers[this.state.marketConditions.sentiment as keyof typeof this.sectorModel.sentimentMultipliers] || 1.0;
    const flows = this.sectorModel.flowsImpact[this.state.marketConditions.flows as keyof typeof this.sectorModel.flowsImpact] || 1.0;
    const global = this.sectorModel.globalCuesImpact[this.state.marketConditions.globalCues as keyof typeof this.sectorModel.globalCuesImpact] || 1.0;
    const currency = this.sectorModel.currencyImpact[this.state.marketConditions.exchangeRate as keyof typeof this.sectorModel.currencyImpact] || 1.0;
    const oil = this.sectorModel.oilImpact[this.state.marketConditions.crudeOil as keyof typeof this.sectorModel.oilImpact] || 1.0;
    
    return {
      conditions: this.state.marketConditions,
      sector: this.state.companyProfile.sector,
      impacts: {
        sentiment: { value: this.state.marketConditions.sentiment, multiplier: sentiment },
        flows: { value: this.state.marketConditions.flows, multiplier: flows },
        global: { value: this.state.marketConditions.globalCues, multiplier: global },
        currency: { value: this.state.marketConditions.exchangeRate, multiplier: currency },
        oil: { value: this.state.marketConditions.crudeOil, multiplier: oil }
      },
      totalImpact: this.calculateMarketImpact()
    };
  }
  
  public simulateNextCandle(): CandlestickData {
    const marketImpact = this.calculateMarketImpact();
    
    // Calculate base price movement with proper trend bias
    const baseVolatility = this.sectorModel.baseVolatility / 100;
    
    // Create a strong trend component based on market impact
    const trendStrength = Math.abs(marketImpact - 1.0) * 2; // Amplify the trend
    const trendDirection = marketImpact > 1 ? 1 : marketImpact < 1 ? -1 : 0;
    
    // Random component for natural price movement (reduced influence)
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    
    // Combine trend and random (trend dominates when market impact is strong)
    const trendWeight = Math.min(0.8, trendStrength); // Max 80% trend influence
    const randomWeight = 1 - trendWeight;
    
    const combinedFactor = (trendDirection * trendStrength * trendWeight) + (randomFactor * baseVolatility * randomWeight);
    const priceChange = this.state.currentPrice * combinedFactor;
    
    const open = this.state.currentPrice;
    let close = open + priceChange;
    
    // Apply additional market impact boost for strong positive/negative sentiment
    if (marketImpact > 1.05) { // Strong positive
      close *= (1 + (marketImpact - 1) * 0.3); // 30% of the market impact as direct price boost
    } else if (marketImpact < 0.95) { // Strong negative
      close *= (1 + (marketImpact - 1) * 0.3); // 30% of the market impact as direct price drop
    }
    
    // Ensure price doesn't go negative but allow for larger drops if warranted
    close = Math.max(close, open * 0.75); // Max 25% daily drop
    
    // Generate realistic intraday high and low
    const intradayVolatility = Math.abs(close - open) * 0.8 + (this.state.currentPrice * baseVolatility * 0.3);
    
    const high = Math.max(open, close) + (intradayVolatility * Math.random() * 0.7);
    const low = Math.min(open, close) - (intradayVolatility * Math.random() * 0.7);
    
    // Generate volume based on price movement and market conditions
    const baseVolume = 1200000;
    const priceMovementFactor = Math.abs(priceChange / this.state.currentPrice) * 5;
    const marketImpactFactor = Math.abs(marketImpact - 1.0) * 3;
    const eventFactor = this.state.activeEvents.length > 0 ? 1.5 : 1.0;
    
    const volumeMultiplier = 1 + priceMovementFactor + marketImpactFactor;
    const volume = Math.floor(baseVolume * volumeMultiplier * eventFactor * (0.6 + Math.random() * 0.8));
    
    // Create the new candlestick
    const now = new Date();
    const timeString = now.toISOString().split('T')[0];
    
    const newCandle: CandlestickData = {
      time: timeString,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    };
    
    // Update state
    this.state.currentPrice = close;
    this.state.currentDay += 1;
    
    // Add to historical data (keep last 50 days)
    this.state.historicalData.push(newCandle);
    if (this.state.historicalData.length > 50) {
      this.state.historicalData.shift();
    }
    
    return newCandle;
  }
  
  public simulateIntradayMovement(minutes: number): CandlestickData[] {
    const intradayData: CandlestickData[] = [];
    const startPrice = this.state.currentPrice;
    const marketImpact = this.calculateMarketImpact();
    
    // Calculate target end price for the day
    const baseVolatility = this.sectorModel.baseVolatility / 100;
    const dailyMovement = startPrice * baseVolatility * (marketImpact - 1.0) * 0.8;
    const targetPrice = startPrice + dailyMovement;
    
    let currentPrice = startPrice;
    
    for (let i = 0; i < minutes; i++) {
      const progress = i / minutes;
      
      // Trend toward target price with some randomness
      const trendComponent = (targetPrice - currentPrice) * 0.02;
      const randomComponent = currentPrice * (baseVolatility / 100) * (Math.random() - 0.5) * 0.1;
      
      const priceChange = trendComponent + randomComponent;
      const newPrice = Math.max(currentPrice + priceChange, currentPrice * 0.99);
      
      const open = currentPrice;
      const close = newPrice;
      const high = Math.max(open, close) + Math.abs(priceChange) * Math.random();
      const low = Math.min(open, close) - Math.abs(priceChange) * Math.random();
      
      const volume = Math.floor(20000 + Math.random() * 30000);
      
      const now = new Date();
      now.setHours(9, 30 + i, 0, 0); // Market hours
      
      intradayData.push({
        time: now.toISOString(),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      });
      
      currentPrice = newPrice;
    }
    
    this.state.currentPrice = currentPrice;
    return intradayData;
  }
  
  public getState(): SimulationState {
    return { ...this.state };
  }
  
  public getHistoricalData(): CandlestickData[] {
    return [...this.state.historicalData];
  }
  
  public getCurrentPrice(): number {
    return this.state.currentPrice;
  }
  
  public getCompanySizeValue(): number {
    return this.state.companyProfile.companySizeValue;
  }
  
  public getPriceChange(): { absolute: number; percentage: number } {
    const previousClose = this.state.historicalData[this.state.historicalData.length - 1]?.close || this.state.basePrice;
    const absolute = this.state.currentPrice - previousClose;
    const percentage = (absolute / previousClose) * 100;
    
    return {
      absolute: parseFloat(absolute.toFixed(2)),
      percentage: parseFloat(percentage.toFixed(2))
    };
  }
  
  public getSimulationDuration(): { days: number; hours: number; minutes: number; startDate: string } {
    const now = new Date();
    const elapsed = now.getTime() - this.state.startTime.getTime();
    
    const totalMinutes = Math.floor(elapsed / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    const startDate = this.state.startTime.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    return { days, hours, minutes, startDate };
  }

  public reset(newProfile?: { size: string; sector: string }) {
    if (newProfile) {
      this.state.companyProfile = {
        ...newProfile,
        companySizeValue: this.generateRandomCompanySize()
      };
      this.sectorModel = sectorModels[newProfile.sector] || getDefaultSectorModel();
    }
    
    this.state.currentDay = 1;
    this.state.startTime = new Date();
    this.state.historicalData = [];
    this.state.activeEvents = [];
    this.state.currentPrice = this.state.basePrice;
    this.initializeHistoricalData();
  }
}