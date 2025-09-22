# Simulation Configuration Guide

## Overview
The `simulationConfig.ts` file contains **all min/max values, ranges, and categorical options** for the Financial Trading Simulator. This is your centralized location for understanding and modifying simulation parameters.

## File Location
```
src/config/simulationConfig.ts
```

## Structure

### 🔢 NUMERIC_RANGES
Contains all slider controls with their exact min/max bounds:

| Control | Min Value | Max Value | Default | Unit | Description |
|---------|-----------|-----------|---------|------|-------------|
| **overall_market_sentiment** | -0.5296 | 0.5167 | 0 | - | Market confidence levels |
| **fii_flows** | -1798.11 | 1707.86 | 0 | Cr | Foreign institutional flows |
| **dii_flows** | -1580.36 | 1414.69 | 0 | Cr | Domestic institutional flows |
| **global_market_cues** | -0.7022 | 0.6776 | 0 | - | International market impact |
| **inr_usd_delta** | -0.0123 | 0.0112 | 0 | - | Currency exchange changes |
| **crude_oil_delta** | -0.0367 | 0.0430 | 0 | - | Oil price impact |
| **earnings_announcement** | 0 | 1 | 0.5 | - | Earnings event probability |
| **analyst_rating_change** | 0 | 1 | 0 | - | Rating change impact |

### 📋 CATEGORICAL_OPTIONS
Contains dropdown/button selections:

- **major_news**: `none`, `positive`, `negative`
- **insider_activity**: `none`, `buy`, `sell`  
- **predefined_global_shock**: `none`, `financial_crisis`, `geopolitical`, `pandemic`

### 🎯 COMPANY_EVENTS
Predefined company-specific events:
- 🏆 Major Contract Win (POSITIVE)
- 🚀 New Product Launch (POSITIVE)
- 😱 CEO Resigns (NEGATIVE)
- ⚖️ Regulatory Fine (NEGATIVE)

### 🏢 COMPANY_PROFILES
- **Market Cap**: `large_cap`, `mid_cap`, `small_cap`
- **Sectors**: IT Services, Banking, Pharmaceuticals, etc.
- **Company Size Range**: 10-98

### ⚙️ SIMULATION_LIMITS
- **Horizon**: 1-365 days (default: 30)
- **Modes**: Hold Mode, Trajectory Mode

## Usage Examples

### Import the Configuration
```typescript
import { SIMULATION_CONFIG, getNumericConfig, getAllDefaults } from '@/config/simulationConfig';
```

### Get Specific Control Ranges
```typescript
// Get FII flows configuration
const fiiConfig = getNumericConfig('fii_flows');
console.log(fiiConfig.min);    // -1798.11
console.log(fiiConfig.max);    // 1707.86
console.log(fiiConfig.unit);   // " Cr"
```

### Get All Default Values
```typescript
const defaults = getAllDefaults();
// Returns: { overall_market_sentiment: 0, fii_flows: 0, major_news: 'none', ... }
```

### Access Categorical Options
```typescript
const newsOptions = SIMULATION_CONFIG.CATEGORICAL_OPTIONS.major_news.options;
// Returns: [{ value: 'none', label: 'No News', impact: '...' }, ...]
```

## Key Benefits

✅ **Single Source of Truth**: All limits defined in one place  
✅ **Type Safety**: Full TypeScript support with proper interfaces  
✅ **Easy Maintenance**: Change ranges without hunting through components  
✅ **Validation**: Built-in functions to validate user inputs  
✅ **Documentation**: Each parameter includes description and impact explanation  

## Modifying Values

To change simulation ranges, edit the values in `SIMULATION_CONFIG.NUMERIC_RANGES`. For example:

```typescript
// To increase FII flows range:
fii_flows: {
  min: -2000,  // Changed from -1798.11
  max: 2000,   // Changed from 1707.86
  default: 0,
  step: 10,
  unit: ' Cr',
  description: 'Net foreign institutional investor money flows into Indian markets'
}
```

The changes will automatically apply across all components that use this configuration.