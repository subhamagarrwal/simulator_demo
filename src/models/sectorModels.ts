// Sector-specific impact models for price simulation
export interface SectorImpactModel {
  // Base volatility for the sector (daily price movement range)
  baseVolatility: number;
  
  // Market sentiment impact multipliers
  sentimentMultipliers: {
    "strongly-bullish": number;
    "bullish": number;
    "neutral": number;
    "bearish": number;
    "strongly-bearish": number;
  };
  
  // Investor flows impact
  flowsImpact: {
    "strong-inflows": number;
    "moderate-inflows": number;
    "neutral": number;
    "moderate-outflows": number;
    "strong-outflows": number;
  };
  
  // Global cues sensitivity
  globalCuesImpact: {
    "strongly-positive": number;
    "positive": number;
    "neutral": number;
    "negative": number;
    "strongly-negative": number;
  };
  
  // Currency impact (INR-USD)
  currencyImpact: {
    "rupee-appreciating": number;
    "stable": number;
    "rupee-depreciating": number;
  };
  
  // Oil price impact
  oilImpact: {
    "sharply-up": number;
    "up": number;
    "stable": number;
    "down": number;
    "sharply-down": number;
  };
  
  // Event-specific impacts
  eventImpacts: {
    earnings: {
      "sig-beat": number;
      "slight-beat": number;
      "meets": number;
      "slight-miss": number;
      "sig-miss": number;
    };
    analyst: {
      "strong-buy": number;
      "buy": number;
      "hold": number;
      "sell": number;
      "strong-sell": number;
    };
    news: {
      "contract-win": number;
      "product-launch": number;
      "ceo-resigns": number;
      "regulatory-fine": number;
    };
    insider: {
      "promoter-buying": number;
      "promoter-selling": number;
    };
    shock: {
      "financial-crisis": number;
      "geopolitical": number;
      "pandemic": number;
    };
  };
}

export const sectorModels: Record<string, SectorImpactModel> = {
  "financial-services": {
    baseVolatility: 2.8,
    sentimentMultipliers: {
      "strongly-bullish": 2.2,  // Increased from 1.8
      "bullish": 1.6,           // Increased from 1.3
      "neutral": 1.0,
      "bearish": 0.6,           // Decreased from 0.7
      "strongly-bearish": 0.3   // Decreased from 0.4
    },
    flowsImpact: {
      "strong-inflows": 2.0,    // Increased from 1.6
      "moderate-inflows": 1.4,  // Increased from 1.2
      "neutral": 1.0,
      "moderate-outflows": 0.7, // Decreased from 0.8
      "strong-outflows": 0.4    // Decreased from 0.5
    },
    globalCuesImpact: {
      "strongly-positive": 1.4,
      "positive": 1.2,
      "neutral": 1.0,
      "negative": 0.8,
      "strongly-negative": 0.6
    },
    currencyImpact: {
      "rupee-appreciating": 1.1,
      "stable": 1.0,
      "rupee-depreciating": 0.95
    },
    oilImpact: {
      "sharply-up": 0.92,
      "up": 0.96,
      "stable": 1.0,
      "down": 1.04,
      "sharply-down": 1.08
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.12,
        "slight-beat": 1.05,
        "meets": 1.0,
        "slight-miss": 0.94,
        "sig-miss": 0.86
      },
      analyst: {
        "strong-buy": 1.08,
        "buy": 1.04,
        "hold": 1.0,
        "sell": 0.96,
        "strong-sell": 0.91
      },
      news: {
        "contract-win": 1.07,
        "product-launch": 1.04,
        "ceo-resigns": 0.93,
        "regulatory-fine": 0.88
      },
      insider: {
        "promoter-buying": 1.06,
        "promoter-selling": 0.94
      },
      shock: {
        "financial-crisis": 0.75,
        "geopolitical": 0.82,
        "pandemic": 0.78
      }
    }
  },
  
  "it": {
    baseVolatility: 3.2,
    sentimentMultipliers: {
      "strongly-bullish": 2.5,  // Increased from 2.1
      "bullish": 1.8,           // Increased from 1.4
      "neutral": 1.0,
      "bearish": 0.5,           // Decreased from 0.6
      "strongly-bearish": 0.2   // Decreased from 0.3
    },
    flowsImpact: {
      "strong-inflows": 2.2,    // Increased from 1.8
      "moderate-inflows": 1.5,  // Increased from 1.3
      "neutral": 1.0,
      "moderate-outflows": 0.6, // Decreased from 0.7
      "strong-outflows": 0.3    // Decreased from 0.4
    },
    globalCuesImpact: {
      "strongly-positive": 1.6,
      "positive": 1.3,
      "neutral": 1.0,
      "negative": 0.7,
      "strongly-negative": 0.5
    },
    currencyImpact: {
      "rupee-appreciating": 0.88,
      "stable": 1.0,
      "rupee-depreciating": 1.15
    },
    oilImpact: {
      "sharply-up": 0.94,
      "up": 0.97,
      "stable": 1.0,
      "down": 1.03,
      "sharply-down": 1.06
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.20,      // Increased from 1.15
        "slight-beat": 1.10,   // Increased from 1.07
        "meets": 1.0,
        "slight-miss": 0.90,   // Decreased from 0.92
        "sig-miss": 0.78       // Decreased from 0.83
      },
      analyst: {
        "strong-buy": 1.15,    // Increased from 1.12
        "buy": 1.08,           // Increased from 1.06
        "hold": 1.0,
        "sell": 0.92,          // Decreased from 0.93
        "strong-sell": 0.80    // Decreased from 0.85
      },
      news: {
        "contract-win": 1.15,  // Increased from 1.10
        "product-launch": 1.12,// Increased from 1.08
        "ceo-resigns": 0.85,   // Decreased from 0.90
        "regulatory-fine": 0.88// Decreased from 0.92
      },
      insider: {
        "promoter-buying": 1.12, // Increased from 1.08
        "promoter-selling": 0.88 // Decreased from 0.92
      },
      shock: {
        "financial-crisis": 0.60, // Decreased from 0.70
        "geopolitical": 0.80,     // Decreased from 0.85
        "pandemic": 1.15          // Increased from 1.05 (IT benefits from remote work)
      }
    }
  },
  
  "healthcare": {
    baseVolatility: 2.5,
    sentimentMultipliers: {
      "strongly-bullish": 1.6,
      "bullish": 1.25,
      "neutral": 1.0,
      "bearish": 0.8,
      "strongly-bearish": 0.6
    },
    flowsImpact: {
      "strong-inflows": 1.4,
      "moderate-inflows": 1.15,
      "neutral": 1.0,
      "moderate-outflows": 0.85,
      "strong-outflows": 0.7
    },
    globalCuesImpact: {
      "strongly-positive": 1.3,
      "positive": 1.15,
      "neutral": 1.0,
      "negative": 0.85,
      "strongly-negative": 0.7
    },
    currencyImpact: {
      "rupee-appreciating": 0.92,
      "stable": 1.0,
      "rupee-depreciating": 1.08
    },
    oilImpact: {
      "sharply-up": 0.96,
      "up": 0.98,
      "stable": 1.0,
      "down": 1.02,
      "sharply-down": 1.04
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.10,
        "slight-beat": 1.04,
        "meets": 1.0,
        "slight-miss": 0.96,
        "sig-miss": 0.88
      },
      analyst: {
        "strong-buy": 1.09,
        "buy": 1.04,
        "hold": 1.0,
        "sell": 0.96,
        "strong-sell": 0.90
      },
      news: {
        "contract-win": 1.06,
        "product-launch": 1.12,
        "ceo-resigns": 0.94,
        "regulatory-fine": 0.85
      },
      insider: {
        "promoter-buying": 1.05,
        "promoter-selling": 0.95
      },
      shock: {
        "financial-crisis": 0.80,
        "geopolitical": 0.88,
        "pandemic": 1.25
      }
    }
  },
  
  "consumer-discretionary": {
    baseVolatility: 3.0,
    sentimentMultipliers: {
      "strongly-bullish": 1.9,
      "bullish": 1.35,
      "neutral": 1.0,
      "bearish": 0.65,
      "strongly-bearish": 0.4
    },
    flowsImpact: {
      "strong-inflows": 1.5,
      "moderate-inflows": 1.2,
      "neutral": 1.0,
      "moderate-outflows": 0.8,
      "strong-outflows": 0.6
    },
    globalCuesImpact: {
      "strongly-positive": 1.4,
      "positive": 1.2,
      "neutral": 1.0,
      "negative": 0.8,
      "strongly-negative": 0.6
    },
    currencyImpact: {
      "rupee-appreciating": 1.05,
      "stable": 1.0,
      "rupee-depreciating": 0.92
    },
    oilImpact: {
      "sharply-up": 0.85,
      "up": 0.92,
      "stable": 1.0,
      "down": 1.08,
      "sharply-down": 1.15
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.13,
        "slight-beat": 1.06,
        "meets": 1.0,
        "slight-miss": 0.93,
        "sig-miss": 0.84
      },
      analyst: {
        "strong-buy": 1.10,
        "buy": 1.05,
        "hold": 1.0,
        "sell": 0.94,
        "strong-sell": 0.87
      },
      news: {
        "contract-win": 1.08,
        "product-launch": 1.06,
        "ceo-resigns": 0.92,
        "regulatory-fine": 0.90
      },
      insider: {
        "promoter-buying": 1.07,
        "promoter-selling": 0.93
      },
      shock: {
        "financial-crisis": 0.65,
        "geopolitical": 0.75,
        "pandemic": 0.70
      }
    }
  },
  
  "consumer-staples": {
    baseVolatility: 1.8,
    sentimentMultipliers: {
      "strongly-bullish": 1.3,
      "bullish": 1.15,
      "neutral": 1.0,
      "bearish": 0.85,
      "strongly-bearish": 0.7
    },
    flowsImpact: {
      "strong-inflows": 1.2,
      "moderate-inflows": 1.1,
      "neutral": 1.0,
      "moderate-outflows": 0.9,
      "strong-outflows": 0.8
    },
    globalCuesImpact: {
      "strongly-positive": 1.15,
      "positive": 1.08,
      "neutral": 1.0,
      "negative": 0.92,
      "strongly-negative": 0.85
    },
    currencyImpact: {
      "rupee-appreciating": 1.03,
      "stable": 1.0,
      "rupee-depreciating": 0.95
    },
    oilImpact: {
      "sharply-up": 0.90,
      "up": 0.95,
      "stable": 1.0,
      "down": 1.05,
      "sharply-down": 1.10
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.08,
        "slight-beat": 1.03,
        "meets": 1.0,
        "slight-miss": 0.97,
        "sig-miss": 0.92
      },
      analyst: {
        "strong-buy": 1.06,
        "buy": 1.03,
        "hold": 1.0,
        "sell": 0.97,
        "strong-sell": 0.93
      },
      news: {
        "contract-win": 1.04,
        "product-launch": 1.05,
        "ceo-resigns": 0.96,
        "regulatory-fine": 0.93
      },
      insider: {
        "promoter-buying": 1.04,
        "promoter-selling": 0.96
      },
      shock: {
        "financial-crisis": 0.90,
        "geopolitical": 0.95,
        "pandemic": 1.10
      }
    }
  },
  
  "energy": {
    baseVolatility: 4.2,
    sentimentMultipliers: {
      "strongly-bullish": 2.3,
      "bullish": 1.5,
      "neutral": 1.0,
      "bearish": 0.5,
      "strongly-bearish": 0.2
    },
    flowsImpact: {
      "strong-inflows": 1.9,
      "moderate-inflows": 1.4,
      "neutral": 1.0,
      "moderate-outflows": 0.6,
      "strong-outflows": 0.3
    },
    globalCuesImpact: {
      "strongly-positive": 1.5,
      "positive": 1.25,
      "neutral": 1.0,
      "negative": 0.75,
      "strongly-negative": 0.5
    },
    currencyImpact: {
      "rupee-appreciating": 0.85,
      "stable": 1.0,
      "rupee-depreciating": 1.20
    },
    oilImpact: {
      "sharply-up": 1.35,
      "up": 1.15,
      "stable": 1.0,
      "down": 0.80,
      "sharply-down": 0.55
    },
    eventImpacts: {
      earnings: {
        "sig-beat": 1.18,
        "slight-beat": 1.08,
        "meets": 1.0,
        "slight-miss": 0.90,
        "sig-miss": 0.78
      },
      analyst: {
        "strong-buy": 1.15,
        "buy": 1.08,
        "hold": 1.0,
        "sell": 0.90,
        "strong-sell": 0.80
      },
      news: {
        "contract-win": 1.12,
        "product-launch": 1.06,
        "ceo-resigns": 0.88,
        "regulatory-fine": 0.82
      },
      insider: {
        "promoter-buying": 1.10,
        "promoter-selling": 0.90
      },
      shock: {
        "financial-crisis": 0.60,
        "geopolitical": 1.25,
        "pandemic": 0.70
      }
    }
  }
};

// Add models for remaining sectors with similar structure
export const getDefaultSectorModel = (): SectorImpactModel => ({
  baseVolatility: 2.5,
  sentimentMultipliers: {
    "strongly-bullish": 1.7,
    "bullish": 1.3,
    "neutral": 1.0,
    "bearish": 0.7,
    "strongly-bearish": 0.4
  },
  flowsImpact: {
    "strong-inflows": 1.5,
    "moderate-inflows": 1.2,
    "neutral": 1.0,
    "moderate-outflows": 0.8,
    "strong-outflows": 0.6
  },
  globalCuesImpact: {
    "strongly-positive": 1.4,
    "positive": 1.2,
    "neutral": 1.0,
    "negative": 0.8,
    "strongly-negative": 0.6
  },
  currencyImpact: {
    "rupee-appreciating": 1.0,
    "stable": 1.0,
    "rupee-depreciating": 1.0
  },
  oilImpact: {
    "sharply-up": 0.95,
    "up": 0.98,
    "stable": 1.0,
    "down": 1.02,
    "sharply-down": 1.05
  },
  eventImpacts: {
    earnings: {
      "sig-beat": 1.12,
      "slight-beat": 1.05,
      "meets": 1.0,
      "slight-miss": 0.94,
      "sig-miss": 0.86
    },
    analyst: {
      "strong-buy": 1.08,
      "buy": 1.04,
      "hold": 1.0,
      "sell": 0.96,
      "strong-sell": 0.91
    },
    news: {
      "contract-win": 1.07,
      "product-launch": 1.04,
      "ceo-resigns": 0.93,
      "regulatory-fine": 0.88
    },
    insider: {
      "promoter-buying": 1.06,
      "promoter-selling": 0.94
    },
    shock: {
      "financial-crisis": 0.75,
      "geopolitical": 0.82,
      "pandemic": 0.78
    }
  }
});