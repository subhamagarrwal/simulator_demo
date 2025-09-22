import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { useState, useMemo } from "react";
import { useSimulation } from "../contexts/SimulationContext";

const CandlestickItem = ({ x, y, width, height, payload, candleWidth = 8 }: any) => {
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close > open;
  
  // Calculate positions
  const centerX = x + width / 2;
  const candleHeight = Math.abs(close - open) * height / (high - low);
  const candleY = y + ((high - Math.max(open, close)) * height / (high - low));
  
  // Wick positions
  const wickTop = y + ((high - high) * height / (high - low));
  const wickBottom = y + ((high - low) * height / (high - low));
  
  const color = isGreen ? '#22c55e' : '#ef4444';
  
  return (
    <g>
      {/* High-Low Wick Line */}
      <line
        x1={centerX}
        y1={wickTop}
        x2={centerX}  
        y2={wickBottom}
        stroke="#666"
        strokeWidth={1}
      />
      
      {/* Candle Body */}
      <rect
        x={centerX - candleWidth / 2}
        y={candleY}
        width={candleWidth}
        height={Math.max(candleHeight, 1)}
        fill={isGreen ? 'none' : color}
        stroke={color}
        strokeWidth={isGreen ? 2 : 0}
      />
    </g>
  );
};

const CustomCandlestickChart = ({ data, width, height }: any) => {
  const [hoveredCandle, setHoveredCandle] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    const allPrices = data.flatMap((d: any) => [d.high, d.low]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min;
    return {
      minPrice: min - range * 0.1,
      maxPrice: max + range * 0.1,
      priceRange: range * 1.2
    };
  }, [data]);
  
  const candleWidth = Math.max(6, (width - 80) / data.length * 0.7);
  const candleSpacing = (width - 80) / data.length;
  
  return (
    <div className="relative w-full h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Price Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const price = maxPrice - (priceRange * ratio);
          const y = height * 0.1 + (height * 0.8 * ratio);
          return (
            <g key={ratio}>
              <line 
                x1={40} 
                y1={y} 
                x2={width - 40} 
                y2={y} 
                stroke="var(--border)" 
                strokeWidth="0.5"
                opacity="0.5"
              />
              <text
                x={width - 35}
                y={y + 4}
                fill="var(--muted-foreground)"
                fontSize="10"
                textAnchor="start"
              >
                {price.toFixed(4)}
              </text>
            </g>
          );
        })}
        
        {/* Candlesticks */}
        {data.map((candle: any, index: number) => {
          const x = 50 + index * candleSpacing;
          const centerX = x + candleSpacing / 2;
          
          // Calculate positions relative to price range
          const highY = height * 0.1 + ((maxPrice - candle.high) / priceRange) * height * 0.8;
          const lowY = height * 0.1 + ((maxPrice - candle.low) / priceRange) * height * 0.8;
          const openY = height * 0.1 + ((maxPrice - candle.open) / priceRange) * height * 0.8;
          const closeY = height * 0.1 + ((maxPrice - candle.close) / priceRange) * height * 0.8;
          
          const isGreen = candle.close > candle.open;
          const color = isGreen ? '#22c55e' : '#ef4444';
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);
          
          return (
            <g 
              key={index}
              onMouseEnter={(e) => {
                setHoveredCandle(candle);
                const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
                if (rect) {
                  setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
                if (rect) {
                  setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }
              }}
              onMouseLeave={() => setHoveredCandle(null)}
              style={{ cursor: 'crosshair' }}
            >
              {/* High-Low Wick */}
              <line
                x1={centerX}
                y1={highY}
                x2={centerX}
                y2={lowY}
                stroke="#666"
                strokeWidth={1}
              />
              
              {/* Candle Body */}
              <rect
                x={centerX - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? 'transparent' : color}
                stroke={color}
                strokeWidth={isGreen ? 1.5 : 0}
                opacity={hoveredCandle?.index === candle.index ? 0.8 : 1}
              />
            </g>
          );
        })}
        
        {/* Time Labels */}
        {data.filter((_: any, i: number) => i % 10 === 0).map((candle: any, index: number) => {
          const actualIndex = data.indexOf(candle);
          const x = 50 + actualIndex * candleSpacing + candleSpacing / 2;
          return (
            <text
              key={actualIndex}
              x={x}
              y={height - 10}
              fill="var(--muted-foreground)"
              fontSize="10"
              textAnchor="middle"
            >
              {candle.time}
            </text>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hoveredCandle && (
        <div 
          className="absolute bg-card border border-border rounded-lg p-3 shadow-lg z-50 pointer-events-none min-w-[200px]"
          style={{
            left: mousePosition.x + 15 > width - 200 ? mousePosition.x - 215 : mousePosition.x + 15,
            top: mousePosition.y - 10 > height - 120 ? mousePosition.y - 130 : mousePosition.y - 10,
            transform: 'translate(0, 0)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">{hoveredCandle.time}</p>
            <div className={`w-2 h-2 rounded-full ${hoveredCandle.isGreen ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open:</span>
              <span className="text-foreground font-medium">{hoveredCandle.open.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">High:</span>
              <span className="text-green-500 font-medium">{hoveredCandle.high.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Low:</span>
              <span className="text-red-500 font-medium">{hoveredCandle.low.toFixed(5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Close:</span>
              <span className={`font-medium ${hoveredCandle.isGreen ? 'text-green-500' : 'text-red-500'}`}>
                {hoveredCandle.close.toFixed(5)}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-2 pt-2 border-t border-border">
            <span className="text-muted-foreground">Volume:</span>
            <span className="text-foreground font-medium">{hoveredCandle.volume.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">Change:</span>
            <span className={`font-medium ${hoveredCandle.isGreen ? 'text-green-500' : 'text-red-500'}`}>
              {hoveredCandle.isGreen ? '+' : ''}{(hoveredCandle.close - hoveredCandle.open).toFixed(5)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export function CandlestickChart() {
  const simulation = useSimulation();
  
  // Transform simulation data for chart display
  const candleData = useMemo(() => {
    return simulation.historicalData.map((candle, index) => ({
      index,
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      isGreen: candle.close > candle.open
    }));
  }, [simulation.historicalData]);

  const currentPrice = simulation.currentPrice;
  const priceChange = simulation.priceChange;
  const simulationDuration = simulation.simulationDuration;
  
  // Get company name for display
  const getCompanySymbol = (sector: string) => {
    const symbols: Record<string, string> = {
      "financial-services": "ABCFIN",
      "it": "TECHCORP", 
      "healthcare": "MEDLIFE",
      "consumer-discretionary": "RETAILMAX",
      "consumer-staples": "FASTCON",
      "industrials": "INDTECH",
      "materials": "BUILDMAT",
      "chemicals": "CHEMTECH",
      "metals-mining": "STEELCORP",
      "energy": "POWERGEN",
      "utilities": "UTILMAX",
      "real-estate": "PROPDEV",
      "telecom": "CONNECTEL"
    };
    return symbols[sector] || "COMPANY";
  };
  
  // Prioritize user-provided ticker, fallback to sector-based generic ticker
  const profile = simulation.engine?.getState().companyProfile;
  const companySymbol = profile?.ticker || 
    (profile?.sector ? getCompanySymbol(profile.sector) : "STOCK");
  
  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">{companySymbol}</h2>
          <div className="flex items-center space-x-4 mt-1">
            <span className={`text-xl ${priceChange.absolute >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{currentPrice.toFixed(2)}
            </span>
            <span className={`text-sm ${priceChange.absolute >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange.absolute >= 0 ? '+' : ''}₹{priceChange.absolute.toFixed(2)} ({priceChange.percentage >= 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-muted-foreground">Stock Simulation Running For</div>
          <div className="text-lg font-medium text-primary">
            {simulationDuration.days} Days {simulationDuration.hours}h {simulationDuration.minutes}m
          </div>
          <div className="text-xs text-muted-foreground">Started {simulationDuration.startDate}</div>
        </div>
      </div>
      
      <div className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <CustomCandlestickChart data={candleData} />
        </ResponsiveContainer>
      </div>
    </div>
  );
}