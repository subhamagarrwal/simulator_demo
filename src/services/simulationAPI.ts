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
   * Convert frontend slider values to simulation controls
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
   * Map frontend major news selection to API format
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
   * Map frontend insider activity to API format
   */
  private static mapInsiderActivity(selectedOption: string | null, activeEvent: string): 'none' | 'buy' | 'sell' {
    if (activeEvent !== 'insider' || !selectedOption) return 'none';
    
    if (selectedOption === 'promoter-buying') return 'buy';
    if (selectedOption === 'promoter-selling') return 'sell';
    return 'none';
  }
  
  /**
   * Map frontend global shock to API format
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