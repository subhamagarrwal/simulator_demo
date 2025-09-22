/**
 * Comprehensive Simulation Configuration
 * Contains all min/max ranges, default values, and categorical options for the financial simulation
 */

interface NumericRange {
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
  description: string;
}

interface CategoricalOption {
  value: string;
  label: string;
  impact: string;
}

interface CategoricalConfig {
  default: string;
  options: CategoricalOption[];
}

interface CompanyEvent {
  key: string;
  label: string;
  impact: string;
  type: 'POSITIVE' | 'NEGATIVE';
}

interface InsiderActivity {
  key: string;
  label: string;
  buttonText: string;
  impact: string;
  type: 'POSITIVE' | 'NEGATIVE';
}

interface SimulationMode {
  value: string;
  label: string;
  description: string;
}

export const SIMULATION_CONFIG = {
  // ==================== NUMERIC CONTROLS ====================
  
  NUMERIC_RANGES: {
    // Market Sentiment
    overall_market_sentiment: {
      min: -0.5295806094652642,
      max: 0.5166648458286379,
      default: 0,
      step: 0.01,
      unit: '',
      description: 'Overall market sentiment and investor confidence levels'
    },
    
    // Institutional Flows
    fii_flows: {
      min: -1798.114816925352,
      max: 1707.8646737801212,
      default: 0,
      step: 10,
      unit: ' Cr',
      description: 'Net foreign institutional investor money flows into Indian markets'
    },
    
    dii_flows: {
      min: -1580.3580671687012,
      max: 1414.6913915950788,
      default: 0,
      step: 10,
      unit: ' Cr',
      description: 'Net domestic institutional investor flows (mutual funds, insurance companies)'
    },
    
    // Global Market Impact
    global_market_cues: {
      min: -0.7021572639830562,
      max: 0.6776104425671782,
      default: 0,
      step: 0.01,
      unit: '',
      description: 'Impact of international market movements on domestic stock performance'
    },
    
    // Currency Exchange
    inr_usd_delta: {
      min: -0.0123434874854614,
      max: 0.0111704830210777,
      default: 0,
      step: 0.001,
      unit: '',
      description: 'Change in INR-USD exchange rate affecting stock valuations'
    },
    
    // Commodity Prices  
    crude_oil_delta: {
      min: -0.0367144071644758,
      max: 0.0429880748555434,
      default: 0,
      step: 0.001,
      unit: '',
      description: 'Change in crude oil prices impacting various sectors differently'
    },
    
    // Company-specific Events
    earnings_announcement: {
      min: 0,
      max: 1,
      default: 0.5,
      step: 0.1,
      unit: '',
      description: 'Probability of earnings announcement impact'
    },
    
    analyst_rating_change: {
      min: 0,
      max: 1,
      default: 0,
      step: 0.1,
      unit: '',
      description: 'Analyst rating change impact (0=no change, 1=maximum impact)'
    }
  },

  // ==================== CATEGORICAL CONTROLS ====================
  
  CATEGORICAL_OPTIONS: {
    // Major News Events
    major_news: {
      default: 'none',
      options: [
        { value: 'none', label: 'No News', impact: 'Neutral market conditions' },
        { value: 'positive', label: 'Positive News', impact: 'Moderate boost (+0.5-2%), Risk-on appetite' },
        { value: 'negative', label: 'Negative News', impact: 'Opening pressure (-0.5-2%), Risk-off sentiment' }
      ]
    },
    
    // Insider Activity
    insider_activity: {
      default: 'none',
      options: [
        { value: 'none', label: 'No Activity', impact: 'No insider trading signals' },
        { value: 'buy', label: 'Insider Buying', impact: 'Positive signal, confidence in company prospects' },
        { value: 'sell', label: 'Insider Selling', impact: 'Negative signal, potential concerns about future performance' }
      ]
    },
    
    // Global Economic Shocks
    predefined_global_shock: {
      default: 'none',
      options: [
        { value: 'none', label: 'No Shock', impact: 'Stable global conditions' },
        { value: 'financial_crisis', label: 'Financial Crisis', impact: 'Severe market disruption, flight to safety' },
        { value: 'geopolitical', label: 'Geopolitical Event', impact: 'Market uncertainty, volatility spike' },
        { value: 'pandemic', label: 'Pandemic Impact', impact: 'Economic disruption, sector-specific effects' }
      ]
    }
  },

  // ==================== SPECIFIC EVENT OPTIONS ====================
  
  COMPANY_EVENTS: [
    { key: 'contract-win', label: '🏆 Major Contract Win', impact: 'Market rally, significant growth prospects boost', type: 'POSITIVE' as const },
    { key: 'product-launch', label: '🚀 New Product Launch', impact: 'Innovation premium, enhanced future growth potential', type: 'POSITIVE' as const },
    { key: 'ceo-resigns', label: '😱 CEO Resigns', impact: 'Uncertainty-driven decline, leadership transition concerns', type: 'NEGATIVE' as const },
    { key: 'regulatory-fine', label: '⚖️ Regulatory Fine', impact: 'Compliance impact, reputation and operational concerns', type: 'NEGATIVE' as const }
  ],

  INSIDER_ACTIVITIES: [
    { key: 'buy', label: 'Insider Buying', buttonText: 'Buy', impact: 'Confidence signal from company insiders', type: 'POSITIVE' as const },
    { key: 'sell', label: 'Insider Selling', buttonText: 'Sell', impact: 'Potential concern signal from insiders', type: 'NEGATIVE' as const }
  ],

  // ==================== SIMULATION SETTINGS ====================
  
  SIMULATION_LIMITS: {
    horizon: {
      min: 1,
      max: 365,
      default: 30,
      description: 'Number of trading days to simulate'
    }
  },

  MODES: [
    { value: 'hold', label: 'Hold Mode', description: 'Static market conditions over entire horizon' },
    { value: 'trajectory', label: 'Trajectory Mode', description: 'Dynamic market conditions that change over time' }
  ],

  // ==================== COMPANY PROFILE SETTINGS ====================
  
  COMPANY_PROFILES: {
    market_cap_buckets: ['large_cap', 'mid_cap', 'small_cap'],
    sectors: [
      'IT Services', 'Banking', 'Pharmaceuticals', 'Automotive', 'Steel', 
      'Oil & Gas', 'FMCG', 'Telecommunications', 'Real Estate', 'Power'
    ],
    company_size_range: { min: 10, max: 98 }
  }
} as const;

// ==================== HELPER FUNCTIONS ====================

/**
 * Get the configuration for a specific numeric control
 */
export const getNumericConfig = (controlName: keyof typeof SIMULATION_CONFIG.NUMERIC_RANGES) => {
  return SIMULATION_CONFIG.NUMERIC_RANGES[controlName];
};

/**
 * Get the configuration for a specific categorical control
 */
export const getCategoricalConfig = (controlName: keyof typeof SIMULATION_CONFIG.CATEGORICAL_OPTIONS) => {
  return SIMULATION_CONFIG.CATEGORICAL_OPTIONS[controlName];
};

/**
 * Get all default values in a single object
 */
export const getAllDefaults = () => {
  const numericDefaults = Object.keys(SIMULATION_CONFIG.NUMERIC_RANGES).reduce((acc, key) => {
    const typedKey = key as keyof typeof SIMULATION_CONFIG.NUMERIC_RANGES;
    acc[key] = SIMULATION_CONFIG.NUMERIC_RANGES[typedKey].default;
    return acc;
  }, {} as Record<string, number>);

  const categoricalDefaults = Object.keys(SIMULATION_CONFIG.CATEGORICAL_OPTIONS).reduce((acc, key) => {
    const typedKey = key as keyof typeof SIMULATION_CONFIG.CATEGORICAL_OPTIONS;
    acc[key] = SIMULATION_CONFIG.CATEGORICAL_OPTIONS[typedKey].default;
    return acc;
  }, {} as Record<string, string>);

  return { ...numericDefaults, ...categoricalDefaults };
};

/**
 * Validate if a value is within the allowed range for a control
 */
export const validateNumericValue = (controlName: keyof typeof SIMULATION_CONFIG.NUMERIC_RANGES, value: number): boolean => {
  const config = SIMULATION_CONFIG.NUMERIC_RANGES[controlName];
  return value >= config.min && value <= config.max;
};

/**
 * Validate if a categorical value is allowed
 */
export const validateCategoricalValue = (controlName: keyof typeof SIMULATION_CONFIG.CATEGORICAL_OPTIONS, value: string): boolean => {
  const config = SIMULATION_CONFIG.CATEGORICAL_OPTIONS[controlName];
  return config.options.some((option: CategoricalOption) => option.value === value);
};

export default SIMULATION_CONFIG;