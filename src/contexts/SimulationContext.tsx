import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PriceSimulationEngine, SimulationState, MarketConditions, CompanyEvent, CandlestickData } from '../engine/PriceSimulationEngine';

interface SimulationContextType {
  engine: PriceSimulationEngine | null;
  currentPrice: number;
  priceChange: { absolute: number; percentage: number };
  historicalData: CandlestickData[];
  isRunning: boolean;
  currentDay: number;
  simulationDuration: { days: number; hours: number; minutes: number; startDate: string };
  
  // Actions
  initializeSimulation: (profile: { size: string; sector: string }) => void;
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
  const [engine, setEngine] = useState<PriceSimulationEngine | null>(null);
  const [currentPrice, setCurrentPrice] = useState(154.80); // default to mid-cap price
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
  
  const initializeSimulation = (profile: { size: string; sector: string }) => {
    const basePrice = getBasePriceForSize(profile.size);
    
    const newEngine = new PriceSimulationEngine({
      companyProfile: profile,
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
    engine,
    currentPrice,
    priceChange,
    historicalData,
    isRunning,
    currentDay,
    simulationDuration,
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