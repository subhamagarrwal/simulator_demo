import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PriceSimulationEngine, SimulationState, MarketConditions, CompanyEvent, CandlestickData } from '../engine/PriceSimulationEngine';
import { simulationAPI, SimulationRequest, CompanyMeta, SimulationControls, OHLCData } from '../services/simulationAPI';

export interface SessionCompanyProfile {
  companyName?: string;
  ticker?: string;
  size: string;
  sector: string;
}

interface SimulationContextType {
  // Session data
  sessionProfile: SessionCompanyProfile | null;
  isSessionActive: boolean;
  
  // Legacy engine (keeping for compatibility)
  engine: PriceSimulationEngine | null;
  currentPrice: number;
  priceChange: { absolute: number; percentage: number };
  historicalData: CandlestickData[];
  isRunning: boolean;
  currentDay: number;
  simulationDuration: { days: number; hours: number; minutes: number; startDate: string };
  
  // Backend simulation
  simulationResults: OHLCData[] | null;
  isSimulating: boolean;
  simulationError: string | null;
  
  // Actions
  initializeSession: (profile: SessionCompanyProfile) => void;
  clearSession: () => void;
  runBackendSimulation: (controls: Partial<SimulationControls>, horizon: number, mode: 'hold' | 'trajectory') => Promise<void>;
  
  // Legacy actions (keeping for compatibility)
  initializeSimulation: (profile: SessionCompanyProfile) => void;
  updateMarketConditions: (conditions: Partial<MarketConditions>) => void;
  triggerEvent: (event: CompanyEvent) => void;
  simulateNextDay: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

interface SimulationProviderProps {
  children: ReactNode;
}

export function SimulationProvider({ children }: SimulationProviderProps) {
  // Session state
  const [sessionProfile, setSessionProfile] = useState<SessionCompanyProfile | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // Backend simulation state
  const [simulationResults, setSimulationResults] = useState<OHLCData[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  
  // Legacy engine state (keeping for compatibility)
  const [engine, setEngine] = useState<PriceSimulationEngine | null>(null);
  const [currentPrice, setCurrentPrice] = useState(154.80);
  const [priceChange, setPriceChange] = useState({ absolute: 0, percentage: 0 });
  const [historicalData, setHistoricalData] = useState<CandlestickData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [simulationDuration, setSimulationDuration] = useState({ days: 0, hours: 0, minutes: 0, startDate: '' });
  
  // Function to get base price for company size
  const getBasePriceForSize = (size: string): number => {
    switch (size) {
      case 'small-cap':
        return 124.36;
      case 'mid-cap':
        return 154.80;
      case 'large-cap':
        return 179.52;
      default:
        return 154.80;
    }
  };

  // Map frontend profile to backend CompanyMeta
  const mapProfileToCompanyMeta = (profile: SessionCompanyProfile): CompanyMeta => {
    return {
      company_name: profile.companyName || `Sample ${profile.sector.toUpperCase()} Corp`,
      ticker: profile.ticker || 'SAMPLE',
      sector: profile.sector,
      market_cap_bucket: profile.size.replace('-', '_') as 'large_cap' | 'mid_cap' | 'small_cap',
      company_size: profile.size.replace('-', '_') as 'large_cap' | 'mid_cap' | 'small_cap',
      company_id: profile.ticker || 'SAMPLE001'
    };
  };

  // New session management
  const initializeSession = (profile: SessionCompanyProfile) => {
    console.log('Initializing simulation session with profile:', profile);
    setSessionProfile(profile);
    setIsSessionActive(true);
    
    // Also initialize legacy engine for compatibility
    initializeSimulation(profile);
  };

  const clearSession = () => {
    setSessionProfile(null);
    setIsSessionActive(false);
    setSimulationResults(null);
    setSimulationError(null);
    setIsSimulating(false);
  };

  // Backend simulation runner
  const runBackendSimulation = async (
    controls: Partial<SimulationControls>, 
    horizon: number, 
    mode: 'hold' | 'trajectory'
  ) => {
    if (!sessionProfile) {
      setSimulationError('No company profile set. Please set up your company profile first.');
      return;
    }

    setIsSimulating(true);
    setSimulationError(null);

    try {
      const companyMeta = mapProfileToCompanyMeta(sessionProfile);
      const startDate = new Date().toISOString().split('T')[0]; // Today's date
      const lastClose = getBasePriceForSize(sessionProfile.size);

      const request: SimulationRequest = {
        company_meta: companyMeta,
        last_close: lastClose,
        start_date: startDate,
        horizon: horizon,
        mode: mode,
        controls: controls,
        events: [] // Can be extended later for specific dated events
      };

      console.log('Running backend simulation with request:', request);
      const response = await simulationAPI.simulate(request);
      
      setSimulationResults(response.ohlc_data);
      console.log('Backend simulation completed successfully:', response);
      
    } catch (error) {
      console.error('Backend simulation failed:', error);
      setSimulationError(error instanceof Error ? error.message : 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };
  
  // Legacy simulation methods (keeping for compatibility)
  const initializeSimulation = (profile: SessionCompanyProfile) => {
    const basePrice = getBasePriceForSize(profile.size);
    
    const newEngine = new PriceSimulationEngine({
      companyProfile: { ...profile, companySizeValue: basePrice },
      basePrice: basePrice
    });
    
    setEngine(newEngine);
    setCurrentPrice(newEngine.getCurrentPrice());
    setPriceChange(newEngine.getPriceChange());
    setHistoricalData(newEngine.getHistoricalData());
    setCurrentDay(newEngine.getState().currentDay);
    setSimulationDuration(newEngine.getSimulationDuration());
  };
  
  const updateMarketConditions = (conditions: Partial<MarketConditions>) => {
    if (!engine) return;
    
    engine.updateMarketConditions(conditions);
    
    // Immediately simulate market impact
    if (isRunning) {
      const newCandle = engine.simulateNextCandle();
      setCurrentPrice(engine.getCurrentPrice());
      setPriceChange(engine.getPriceChange());
      setHistoricalData(engine.getHistoricalData());
      setCurrentDay(engine.getState().currentDay);
    }
  };
  
  const triggerEvent = (event: CompanyEvent) => {
    if (!engine) return;
    
    engine.addEvent(event);
    
    // Immediately simulate the event impact
    if (isRunning) {
      const newCandle = engine.simulateNextCandle();
      setCurrentPrice(engine.getCurrentPrice());
      setPriceChange(engine.getPriceChange());
      setHistoricalData(engine.getHistoricalData());
      setCurrentDay(engine.getState().currentDay);
      
      // Clear the event after applying its impact
      setTimeout(() => {
        engine.clearEvents();
      }, 100);
    }
  };
  
  const simulateNextDay = () => {
    if (!engine) return;
    
    // Debug: Log market impact breakdown
    const breakdown = engine.getMarketImpactBreakdown();
    console.log('Market Impact Debug:', breakdown);
    
    const newCandle = engine.simulateNextCandle();
    console.log('New candle generated:', newCandle);
    console.log('Price before:', currentPrice, 'Price after:', engine.getCurrentPrice());
    
    setCurrentPrice(engine.getCurrentPrice());
    setPriceChange(engine.getPriceChange());
    setHistoricalData(engine.getHistoricalData());
    setCurrentDay(engine.getState().currentDay);
    setSimulationDuration(engine.getSimulationDuration());
    
    return newCandle;
  };
  
  const startSimulation = () => {
    setIsRunning(true);
  };
  
  const stopSimulation = () => {
    setIsRunning(false);
  };
  
  const resetSimulation = () => {
    if (!engine) return;
    
    engine.reset();
    setCurrentPrice(engine.getCurrentPrice());
    setPriceChange(engine.getPriceChange());
    setHistoricalData(engine.getHistoricalData());
    setCurrentDay(engine.getState().currentDay);
    setSimulationDuration(engine.getSimulationDuration());
    setIsRunning(false);
  };

  // Auto-simulation effect (simulate every few seconds when running)
  useEffect(() => {
    if (!isRunning || !engine) return;
    
    const interval = setInterval(() => {
      simulateNextDay();
    }, 5000); // Simulate every 5 seconds
    
    return () => clearInterval(interval);
  }, [isRunning, engine]);

  // Update simulation duration every minute
  useEffect(() => {
    if (!engine) return;
    
    const updateDuration = () => {
      setSimulationDuration(engine.getSimulationDuration());
    };
    
    // Update immediately
    updateDuration();
    
    // Then update every minute
    const interval = setInterval(updateDuration, 60000);
    
    return () => clearInterval(interval);
  }, [engine]);
  
  const value: SimulationContextType = {
    // Session data
    sessionProfile,
    isSessionActive,
    
    // Backend simulation
    simulationResults,
    isSimulating,
    simulationError,
    runBackendSimulation,
    initializeSession,
    clearSession,
    
    // Legacy engine data
    engine,
    currentPrice,
    priceChange,
    historicalData,
    isRunning,
    currentDay,
    simulationDuration,
    
    // Legacy actions
    initializeSimulation,
    updateMarketConditions,
    triggerEvent,
    simulateNextDay,
    startSimulation,
    stopSimulation,
    resetSimulation
  };
  
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextType {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}