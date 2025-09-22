/**
 * Financial Simulator API Integration
 * Handles communication with the Python simulation backend
 */

export interface CompanyMeta {
  company_name: string;
  ticker: string;
  sector: string;
  market_cap_bucket: 'large_cap' | 'mid_cap' | 'small_cap';
  company_size: 'large_cap' | 'mid_cap' | 'small_cap';
  company_id?: string; // Optional fallback
}

export interface SimulationControls {
  // Numeric controls (sliders from frontend)
  overall_market_sentiment: number;
  fii_flows: number;
  dii_flows: number;
  global_market_cues: number;
  inr_usd_delta: number;
  crude_oil_delta: number;
  earnings_announcement: number;
  analyst_rating_change: number;
  
  // Categorical controls (buttons/events from frontend)
  major_news: 'none' | 'positive' | 'negative';
  insider_activity: 'none' | 'buy' | 'sell';
  predefined_global_shock: 'none' | 'financial_crisis' | 'geopolitical' | 'pandemic';
}

export interface SimulationEvent {
  date: string; // YYYY-MM-DD format
  field: keyof SimulationControls;
  value: any;
}

export interface SimulationRequest {
  company_meta: CompanyMeta;
  last_close: number;
  start_date: string; // YYYY-MM-DD format
  horizon: number;
  mode: 'hold' | 'trajectory';
  controls: Partial<SimulationControls>;
  events?: SimulationEvent[];
  base_vol?: number;
  seed?: number;
}

export interface OHLCData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface SimulationResponse {
  status: 'success' | 'error';
  simulation_info: {
    company_name: string;
    ticker: string;
    sector: string;
    market_cap_bucket: string;
    mode: string;
    horizon: number;
    start_date: string;
    end_date: string;
    features_used: string[];
    num_events_applied: number;
  };
  ohlc_data: OHLCData[];
  predicted_log_returns: number[];
  feature_panel_shape: {
    rows: number;
    columns: number;
  };
  error?: string;
}

class SimulationAPI {
  private baseURL = 'http://127.0.0.1:5000';
  
  async simulate(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseURL}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Simulation API error:', error);
      throw error;
    }
  }
  
  async validateControls(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/validate_controls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Validation API error:', error);
      throw error;
    }
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data.status === 'healthy' && data.model_loaded === true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Utility functions for converting frontend state to API format
export class SimulationHelper {
  /**
   * Convert frontend state to proper backend format based on mode
   */
  static formatSimulationRequest(
    frontendState: any, 
    selectedEvents: any, 
    companyMeta: CompanyMeta, 
    horizon: number, 
    mode: 'hold' | 'trajectory',
    lastClose: number,
    startDate: string
  ): any {
    // Build controls based on mode
    let controls: any = {};
    
    if (mode === 'hold') {
      // HOLD mode - scalar values
      controls = {
        overall_market_sentiment: frontendState.overall_market_sentiment || 0,
        fii_flows: frontendState.fii_flows || 0,
        dii_flows: frontendState.dii_flows || 0,
        global_market_cues: frontendState.global_market_cues || 0,
        inr_usd_delta: frontendState.inr_usd_delta || 0,
        crude_oil_delta: frontendState.crude_oil_delta || 0,
        earnings_announcement: this.mapEventToValue(selectedEvents.earnings, 'earnings'),
        analyst_rating_change: this.mapEventToValue(selectedEvents.analyst, 'analyst'),
        major_news: this.mapEventToCategory(selectedEvents.majorNews, 'news'),
        insider_activity: this.mapEventToCategory(selectedEvents.insiderActivity, 'insider'),
        predefined_global_shock: this.mapEventToCategory(selectedEvents.globalShock, 'shock')
      };
    } else {
      // TRAJECTORY mode - arrays of length horizon
      controls = {
        overall_market_sentiment: this.createArray(frontendState.overall_market_sentiment || 0, horizon),
        fii_flows: this.createArray(frontendState.fii_flows || 0, horizon),
        dii_flows: this.createArray(frontendState.dii_flows || 0, horizon),
        global_market_cues: this.createArray(frontendState.global_market_cues || 0, horizon),
        inr_usd_delta: this.createArray(frontendState.inr_usd_delta || 0, horizon),
        crude_oil_delta: this.createArray(frontendState.crude_oil_delta || 0, horizon),
        earnings_announcement: this.createArray(this.mapEventToValue(selectedEvents.earnings, 'earnings'), horizon),
        analyst_rating_change: this.createArray(this.mapEventToValue(selectedEvents.analyst, 'analyst'), horizon),
        major_news: this.createArray(this.mapEventToCategory(selectedEvents.majorNews, 'news'), horizon),
        insider_activity: this.createArray(this.mapEventToCategory(selectedEvents.insiderActivity, 'insider'), horizon),
        predefined_global_shock: this.createArray(this.mapEventToCategory(selectedEvents.globalShock, 'shock'), horizon)
      };
    }

    // Build the complete request
    const request = {
      company_meta: {
        company_name: companyMeta.company_name,
        sector: companyMeta.sector,
        market_cap_bucket: companyMeta.market_cap_bucket,
        company_size: this.mapSizeToNumber(companyMeta.market_cap_bucket)
      },
      last_close: lastClose,
      start_date: startDate,
      horizon: horizon,
      mode: mode,
      controls: controls,
      ...(mode === 'trajectory' && { events: [] }) // Can add specific events later
    };

    // Log the formatted request
    console.log('\n=== BACKEND SIMULATION REQUEST ===');
    console.log(`🎯 MODE: ${mode.toUpperCase()}`);
    if (mode === 'hold') {
      console.log('📊 HOLD MODE: All control values are scalars (constant over time)');
    } else {
      console.log('📈 TRAJECTORY MODE: All control values are arrays (can vary over time)');
    }
    console.log(JSON.stringify(request, null, 2));
    console.log('=====================================\n');

    return request;
  }

  /**
   * Create array of repeated values for trajectory mode
   */
  private static createArray(value: any, length: number): any[] {
    return new Array(length).fill(value);
  }

  /**
   * Map company size to numeric value for backend
   */
  private static mapSizeToNumber(size: string): number {
    const sizeMap = {
      'large_cap': 85,
      'mid_cap': 50,
      'small_cap': 25
    };
    return sizeMap[size as keyof typeof sizeMap] || 50;
  }

  /**
   * Map frontend event selection to numeric value for earnings/analyst
   */
  private static mapEventToValue(eventKey: string | null, eventType: string): number {
    if (!eventKey) return 0;
    
    const earningsMap: Record<string, number> = {
      'beat-estimates': 1,
      'miss-estimates': -1,
      'guidance-raised': 1,
      'guidance-lowered': -1
    };

    const analystMap: Record<string, number> = {
      'upgrade': 1,
      'downgrade': -1,
      'target-raised': 1,
      'target-lowered': -1
    };

    if (eventType === 'earnings') {
      return earningsMap[eventKey] || 0;
    } else if (eventType === 'analyst') {
      return analystMap[eventKey] || 0;
    }
    
    return 0;
  }

  /**
   * Map frontend event selection to category for news/insider/shock
   */
  private static mapEventToCategory(eventKey: string | null, eventType: string): string {
    if (!eventKey) return 'none';
    
    const newsMap: Record<string, string> = {
      'contract-win': 'positive',
      'product-launch': 'positive',
      'ceo-resigns': 'negative',
      'regulatory-fine': 'negative'
    };

    const insiderMap: Record<string, string> = {
      'promoter-buying': 'buy',
      'promoter-selling': 'sell'
    };

    const shockMap: Record<string, string> = {
      'financial-crisis': 'financial_crisis',
      'geopolitical': 'geopolitical',
      'pandemic': 'pandemic'
    };

    if (eventType === 'news') {
      return newsMap[eventKey] || 'none';
    } else if (eventType === 'insider') {
      return insiderMap[eventKey] || 'none';
    } else if (eventType === 'shock') {
      return shockMap[eventKey] || 'none';
    }
    
    return 'none';
  }

  /**
   * Convert frontend slider values to simulation controls (LEGACY - keeping for compatibility)
   */
  static convertControlsToAPI(frontendState: any): Partial<SimulationControls> {
    return {
      overall_market_sentiment: frontendState.marketSentiment || 0,
      fii_flows: frontendState.fiiFlows || 0,
      dii_flows: frontendState.diiFlows || 0,
      global_market_cues: frontendState.globalMarketCues || 0,
      inr_usd_delta: frontendState.inrUsdDelta || 0,
      crude_oil_delta: frontendState.crudeOilDelta || 0,
      earnings_announcement: frontendState.earningsAnnouncement || 0,
      analyst_rating_change: frontendState.analystRatingChange || 0,
      major_news: this.mapMajorNews(frontendState.selectedEventOption, frontendState.activeEvent),
      insider_activity: this.mapInsiderActivity(frontendState.selectedEventOption, frontendState.activeEvent),
      predefined_global_shock: this.mapGlobalShock(frontendState.selectedEventOption, frontendState.activeEvent)
    };
  }
  
  /**
   * Map frontend major news selection to API format (LEGACY)
   */
  private static mapMajorNews(selectedOption: string | null, activeEvent: string): 'none' | 'positive' | 'negative' {
    if (activeEvent !== 'news' || !selectedOption) return 'none';
    
    const positiveNews = ['contract-win', 'product-launch'];
    const negativeNews = ['ceo-resigns', 'regulatory-fine'];
    
    if (positiveNews.includes(selectedOption)) return 'positive';
    if (negativeNews.includes(selectedOption)) return 'negative';
    return 'none';
  }
  
  /**
   * Map frontend insider activity to API format (LEGACY)
   */
  private static mapInsiderActivity(selectedOption: string | null, activeEvent: string): 'none' | 'buy' | 'sell' {
    if (activeEvent !== 'insider' || !selectedOption) return 'none';
    
    if (selectedOption === 'promoter-buying') return 'buy';
    if (selectedOption === 'promoter-selling') return 'sell';
    return 'none';
  }
  
  /**
   * Map frontend global shock to API format (LEGACY)
   */
  private static mapGlobalShock(selectedOption: string | null, activeEvent: string): 'none' | 'financial_crisis' | 'geopolitical' | 'pandemic' {
    if (activeEvent !== 'shock' || !selectedOption) return 'none';
    
    const shockMap: Record<string, 'financial_crisis' | 'geopolitical' | 'pandemic'> = {
      'financial-crisis': 'financial_crisis',
      'geopolitical': 'geopolitical',
      'pandemic': 'pandemic'
    };
    
    return shockMap[selectedOption] || 'none';
  }
  
  /**
   * Create a sample company meta for testing
   */
  static createSampleCompanyMeta(): CompanyMeta {
    return {
      company_name: "Sample Corp Ltd",
      ticker: "SMPL",
      sector: "technology",
      market_cap_bucket: "mid_cap",
      company_size: "mid_cap",
      company_id: "SAMPLE001" // Optional fallback
    };
  }
  
  /**
   * Create a sample simulation request
   */
  static createSampleRequest(controls: Partial<SimulationControls>): SimulationRequest {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return {
      company_meta: this.createSampleCompanyMeta(),
      last_close: 1000.0,
      start_date: startDate,
      horizon: 30, // 30 trading days
      mode: 'hold',
      controls: controls
    };
  }
}

// Create and export singleton instance
export const simulationAPI = new SimulationAPI();