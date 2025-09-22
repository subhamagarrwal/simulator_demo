# Financial Trading Simulator - Copilot Instructions

## Project Architecture

This is a **full-stack financial trading simulation platform** with three main components:
1. **React/TypeScript frontend** (Vite + Radix UI components) - main trading UI
2. **Python ML simulation backend** (Flask + XGBoost model) - stock price predictions  
3. **Python ELI5 microservice** (FastAPI) - market explanation generator

## Development Workflow

### Quick Start
```bash
# Install frontend dependencies
npm i

# Start all services (frontend + both backends)
start-all.bat  # Opens terminals for each service

# Frontend only: npm run dev (port 3001)
# ML backend: python simulatorprogram.py (port 5000) 
# ELI5 service: cd eli5-service && start.bat (port 8000)
```

### Key Files & Patterns

**Frontend State Management**: Uses React Context (`SimulationContext.tsx`) - all simulation state flows through this single context, including both legacy engine and new backend integration.

**Dual Simulation System**: 
- Legacy: TypeScript `PriceSimulationEngine` for demo/offline mode
- Production: Python ML backend via `simulationAPI.ts` for real predictions

**Component Structure**: Components are highly coupled to simulation context. Most UI panels (`SimulatorControls`, `CandlestickChart`, `ELI5StoryPanel`) directly consume simulation state.

## Backend Integration Patterns

### Simulation Modes
- **HOLD**: Static market conditions over time horizon 
- **TRAJECTORY**: Dynamic conditions (arrays/time-series inputs)

### API Communication
Backend expects specific schema in `simulationAPI.ts`:
```typescript
// Always include company_meta with exact field names
company_meta: {
  company_name: string,
  sector: string, 
  market_cap_bucket: 'large_cap' | 'mid_cap' | 'small_cap',
  company_size: number // 10-98 range
}
```

### ML Model Integration
The Python backend (`simulatorprogram.py`) loads `model_and_pre_fin.pkl` on startup. Feature engineering follows exact column order defined in model training - see `sample.py` for reference implementation.

## Critical Dependencies

**Frontend**: Radix UI components with custom styling in `src/components/ui/` - always use these instead of creating new components.

**Python Backends**: XGBoost model requires specific feature columns. Missing features will cause prediction failures. Check model health at `/health` endpoint.

**Styling**: Uses Tailwind + CSS variables for theming. Dark/light mode handled by `next-themes`.

## Development Gotchas

- **CORS**: All backends have CORS enabled for `localhost:3001`
- **Date Formats**: Backend expects YYYY-MM-DD, frontend displays user-friendly formats
- **Business Days**: ML model trained on business days only - use `pd.bdate_range()` for date generation
- **State Sync**: Simulation results stored in React context, not persisted across sessions

## File Naming Conventions
- React components: PascalCase (`CandlestickChart.tsx`)
- Services/utilities: camelCase (`simulationAPI.ts`)  
- Python files: snake_case (`simulatorprogram.py`)
- UI components: kebab-case (`src/components/ui/`)

When modifying simulation logic, always update both the TypeScript interfaces in `simulationAPI.ts` and corresponding Python schemas in backend files to maintain API contract.