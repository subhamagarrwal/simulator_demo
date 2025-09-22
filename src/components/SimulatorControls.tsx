import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { CompanyProfileDialog } from "./CompanyProfileDialog";
import { StockOverview } from "./StockOverview";
import { SimulationDialog } from "./SimulationDialog";
import { useSimulation } from "../contexts/SimulationContext";
import { 
  Building2, 
  TrendingUp, 
  Globe, 
  DollarSign, 
  Fuel, 
  FileText, 
  Star, 
  Megaphone, 
  Users, 
  AlertTriangle,
  Info,
  Factory,
  Briefcase,
  CheckCircle,
  Play
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

// Enhanced slider component with impact information
const MarketSlider = ({ 
  value, 
  onValueChange, 
  min, 
  max, 
  step = 0.01, 
  label, 
  description, 
  positiveImpact, 
  negativeImpact,
  unit = ""
}: {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  description: string;
  positiveImpact: string;
  negativeImpact: string;
  unit?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getImpactColor = () => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getImpactText = () => {
    if (value > Math.abs(max - min) * 0.1) return positiveImpact;
    if (value < -Math.abs(max - min) * 0.1) return negativeImpact;
    return "Neutral impact on stock price";
  };
  
  return (
    <div className="space-y-3">
      <Label className="flex items-center text-sm font-medium">
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2 text-xs">
              <p className="font-medium">{description}</p>
              <div className="space-y-1">
                <p><span className="font-medium text-green-500">Positive values:</span> {positiveImpact}</p>
                <p><span className="font-medium text-red-500">Negative values:</span> {negativeImpact}</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </Label>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(values: number[]) => onValueChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        />
        {showTooltip && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {value.toFixed(3)}{unit}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{min.toFixed(2)}</span>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            {getImpactText()}
          </div>
        </div>
        <span className="text-muted-foreground">{max.toFixed(2)}</span>
      </div>
    </div>
  );
};

const tooltips = {
  // Company Profile
  companySize: "The market capitalization category of your company. Large-cap companies are typically more stable with lower volatility, while small-cap companies tend to be more volatile with higher growth potential.",
  sector: "The industry sector your company operates in. Each sector responds differently to market conditions and economic factors.",
  
  // Market Environment
  marketSentiment: "The overall mood and confidence level of market participants. Bullish sentiment drives buying activity while bearish sentiment increases selling pressure.",
  investorFlows: "The net flow of institutional money (Foreign and Domestic Institutional Investors) into or out of the market. Strong inflows typically push prices higher.",
  globalCues: "The performance of major international markets like S&P 500, which often influences domestic market opening and sentiment.",
  exchangeRate: "The movement of Indian Rupee against US Dollar. A depreciating rupee can negatively impact companies with high import costs.",
  crudeOil: "The change in global crude oil prices. Affects energy costs, inflation expectations, and sector-specific impacts (positive for oil companies, negative for airlines).",
  
  // Company Events
  earnings: "Quarterly financial results announcement. Companies beating analyst expectations typically see stock price increases.",
  analystRating: "Investment analysts' recommendations to buy, hold, or sell the stock based on their research and valuation models.",
  majorNews: "Significant company announcements that can materially impact business prospects and investor perception.",
  insiderActivity: "Buying or selling of company shares by promoters/management, often viewed as a signal of confidence in company prospects.",
  globalShock: "Major crisis events that affect entire markets and economies, typically causing widespread volatility and risk-off sentiment."
};

const impactExplanations = {
  // Company Profile impacts
  "small-cap": "Higher volatility (+25%), Increased beta (1.8), Lower liquidity, Greater growth potential",
  "mid-cap": "Moderate volatility (+10%), Balanced beta (1.2), Steady growth patterns",
  "large-cap": "Lower volatility (-15%), Stable beta (0.8), Higher dividend yields, Market stability",
  
  "it": "High P/E ratios, Sensitive to global tech trends, Currency fluctuation impact",
  "banking": "Interest rate sensitive, Regulatory compliance costs, Credit cycle dependency", 
  "fmcg": "Stable demand, Low volatility, Rural market exposure, Commodity price impact",
  "manufacturing": "Raw material cost sensitivity, Export dependency, Economic cycle correlation",
  "pharma": "R&D intensive, Regulatory approval risks, Global market potential",
  "energy": "Commodity price correlation, Environmental regulations, Global demand shifts",
  "auto": "Economic cycle sensitive, Raw material costs, Consumer sentiment dependent",
  
  // Market Environment impacts
  "strongly-bullish": "Stock price boost (+8-12%), Increased trading volume, Positive momentum",
  "bullish": "Moderate price increase (+3-7%), Higher investor confidence",
  "neutral": "Minimal market impact (±2%), Regular trading patterns",
  "bearish": "Price pressure (-3-7%), Increased selling, Risk aversion",
  "strongly-bearish": "Significant decline (-8-12%), High volatility, Market fear",
  
  "strong-inflows": "Price support (+4-8%), Liquidity increase, Bullish momentum",
  "moderate-inflows": "Steady support (+1-3%), Stable trading",
  "moderate-outflows": "Mild pressure (-1-3%), Cautious sentiment",
  "strong-outflows": "Selling pressure (-4-8%), Bearish momentum",
  
  "strongly-positive": "Opening gap up (+2-4%), Positive sentiment spillover",
  "positive": "Moderate boost (+0.5-2%), Risk-on appetite",
  "negative": "Opening pressure (-0.5-2%), Risk-off sentiment",
  "strongly-negative": "Gap down opening (-2-4%), Fear contagion",
  
  "rupee-appreciating": "IT/Export stocks benefit, Import-heavy sectors gain",
  "stable": "Currency neutral impact, Normal trading",
  "rupee-depreciating": "Export boost for some sectors, Import cost inflation",
  
  "sharply-up": "Energy stocks surge (+5-10%), Airlines/Auto pressure (-2-5%)",
  "up": "Energy sector gains (+2-4%), Transport costs rise",
  "down": "Energy stocks decline (-2-4%), Consumer stocks benefit",
  "sharply-down": "Energy crash (-5-10%), Broad market relief (+1-3%)"
};

export function SimulatorControls() {
  const simulation = useSimulation();
  const [showProfileDialog, setShowProfileDialog] = useState(true);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [currentSimulationInfo, setCurrentSimulationInfo] = useState<{
    name?: string;
    ticker?: string;
    mode: string;
    horizon: number;
  } | null>(null);
  const [companyProfile, setCompanyProfile] = useState<{companyName?: string; ticker?: string; size: string; sector: string} | null>(null);
  const [controlMode, setControlMode] = useState<'TRAJECTORY' | 'HOLD'>('HOLD');
  
  // Debug wrapper for setControlMode
  const handleControlModeChange = (mode: 'TRAJECTORY' | 'HOLD') => {
    console.log(`Changing control mode from ${controlMode} to ${mode}`);
    setControlMode(mode);
  };
  
  // Define neutral/default values based on backend constraints
  const NEUTRAL_DEFAULTS = {
    // Numeric controls with their neutral (middle) values
    overall_market_sentiment: 0, // Range: -0.5295806094652642 to 0.5166648458286379
    fii_flows: 0, // Range: -1798.114816925352 to 1707.8646737801212  
    dii_flows: 0, // Range: -1580.3580671687012 to 1414.6913915950788
    global_market_cues: 0, // Range: -0.7021572639830562 to 0.6776104425671782
    inr_usd_delta: 0, // Range: -0.0123434874854614 to 0.0111704830210777
    crude_oil_delta: 0, // Range: -0.0367144071644758 to 0.0429880748555434
    earnings_announcement: 0.5, // Range: 0-1, neutral expectation
    analyst_rating_change: 0, // Range: 0-1, no change
    
    // Categorical controls with neutral defaults
    major_news: "none" as const,
    insider_activity: "none" as const,
    predefined_global_shock: "none" as const,
  };

  const [marketEnvironment, setMarketEnvironment] = useState({
    sentiment: "neutral",
    overall_market_sentiment: NEUTRAL_DEFAULTS.overall_market_sentiment,
    fii_flows: NEUTRAL_DEFAULTS.fii_flows,
    dii_flows: NEUTRAL_DEFAULTS.dii_flows,
    globalCues: "neutral",
    global_market_cues: NEUTRAL_DEFAULTS.global_market_cues,
    exchangeRate: "stable",
    inr_usd_delta: NEUTRAL_DEFAULTS.inr_usd_delta,
    crude_oil_delta: NEUTRAL_DEFAULTS.crude_oil_delta
  });

  // State for categorical events (keeping existing structure)
  const [activeEvents, setActiveEvents] = useState<Set<string>>(new Set());
  const [selectedEvents, setSelectedEvents] = useState({
    earnings: null as string | null,
    analyst: null as string | null,
    majorNews: null as string | null,
    insiderActivity: null as string | null,
    globalShock: null as string | null
  });
  
  // State to track what user has changed (for summary dialog)
  const [changedControls, setChangedControls] = useState<Record<string, any>>({});

  // Track changes from neutral values
  const handleControlChange = (controlName: string, value: any) => {
    const newChangedControls = { ...changedControls };
    
    if (NEUTRAL_DEFAULTS.hasOwnProperty(controlName)) {
      const neutralValue = (NEUTRAL_DEFAULTS as any)[controlName];
      if (value === neutralValue) {
        // If value is back to neutral, remove from changed controls
        delete newChangedControls[controlName];
      } else {
        // Track the change
        newChangedControls[controlName] = value;
      }
      setChangedControls(newChangedControls);
    }
  };

  // Watch for simulation completion
  useEffect(() => {
    if (simulation.simulationResults && !simulation.isSimulating && currentSimulationInfo) {
      setShowSummaryDialog(false);
    }
  }, [simulation.simulationResults, simulation.isSimulating, currentSimulationInfo]);

  // Helper function to handle event switching
  const handleEventSwitch = (eventType: string) => {
    setActiveEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventType)) {
        // Remove event if already active
        newSet.delete(eventType);
        
        // Reset the corresponding control to neutral
        if (eventType === 'earnings') {
          handleControlChange('earnings_announcement', NEUTRAL_DEFAULTS.earnings_announcement);
        } else if (eventType === 'analyst') {
          handleControlChange('analyst_rating_change', NEUTRAL_DEFAULTS.analyst_rating_change);
        } else if (eventType === 'news') {
          handleControlChange('major_news', NEUTRAL_DEFAULTS.major_news);
        } else if (eventType === 'insider') {
          handleControlChange('insider_activity', NEUTRAL_DEFAULTS.insider_activity);
        } else if (eventType === 'shock') {
          handleControlChange('predefined_global_shock', NEUTRAL_DEFAULTS.predefined_global_shock);
        }
        // Reset the specific event selection
        if (eventType === 'earnings') {
          setSelectedEvents(prev => ({...prev, earnings: null}));
        } else if (eventType === 'analyst') {
          setSelectedEvents(prev => ({...prev, analyst: null}));
        } else if (eventType === 'major_news') {
          setSelectedEvents(prev => ({...prev, majorNews: null}));
        } else if (eventType === 'insider') {
          setSelectedEvents(prev => ({...prev, insiderActivity: null}));
        } else if (eventType === 'shock') {
          setSelectedEvents(prev => ({...prev, globalShock: null}));
        }
      } else {
        // Add event if not active
        newSet.add(eventType);
      }
      
      return newSet;
    });
  };

  // Reset all controls to neutral
  const resetToNeutral = () => {
    setMarketEnvironment({
      sentiment: "neutral",
      overall_market_sentiment: NEUTRAL_DEFAULTS.overall_market_sentiment,
      fii_flows: NEUTRAL_DEFAULTS.fii_flows,
      dii_flows: NEUTRAL_DEFAULTS.dii_flows,
      globalCues: "neutral",
      global_market_cues: NEUTRAL_DEFAULTS.global_market_cues,
      exchangeRate: "stable",
      inr_usd_delta: NEUTRAL_DEFAULTS.inr_usd_delta,
      crude_oil_delta: NEUTRAL_DEFAULTS.crude_oil_delta
    });
    setActiveEvents(new Set());
    setSelectedEvents({
      earnings: null,
      analyst: null,
      majorNews: null,
      insiderActivity: null,
      globalShock: null
    });
    setChangedControls({});
  };

  // Handle simulation confirmation
  const handleSimulationConfirm = async (horizon: number) => {
    if (!companyProfile) return;
    
    // Convert frontend data to backend format
    const controls = {
      overall_market_sentiment: marketEnvironment.overall_market_sentiment,
      fii_flows: marketEnvironment.fii_flows,
      dii_flows: marketEnvironment.dii_flows,
      global_market_cues: marketEnvironment.global_market_cues,
      inr_usd_delta: marketEnvironment.inr_usd_delta,
      crude_oil_delta: marketEnvironment.crude_oil_delta,
      earnings_announcement: changedControls.earnings_announcement || NEUTRAL_DEFAULTS.earnings_announcement,
      analyst_rating_change: changedControls.analyst_rating_change || NEUTRAL_DEFAULTS.analyst_rating_change,
      major_news: changedControls.major_news || NEUTRAL_DEFAULTS.major_news,
      insider_activity: changedControls.insider_activity || NEUTRAL_DEFAULTS.insider_activity,
      predefined_global_shock: changedControls.predefined_global_shock || NEUTRAL_DEFAULTS.predefined_global_shock,
    };

    // Create complete simulation parameters JSON
    const simulationParams = {
      company_profile: {
        name: companyProfile.companyName,
        ticker: companyProfile.ticker,
        sector: companyProfile.sector,
        size: companyProfile.size,
      },
      simulation_settings: {
        horizon: horizon,
        mode: controlMode.toLowerCase(),
        date_created: new Date().toISOString()
      },
      market_controls: controls,
      changed_from_neutral: Object.keys(changedControls).length > 0 ? changedControls : "none",
      active_events: Array.from(activeEvents).length > 0 ? Array.from(activeEvents) : "none"
    };

    // Log detailed JSON to terminal
    console.log('\n=== FINANCIAL SIMULATION PARAMETERS ===');
    console.log(JSON.stringify(simulationParams, null, 2));
    console.log('==========================================\n');
    
    try {
      // Set simulation info for results display
      setCurrentSimulationInfo({
        name: companyProfile.companyName,
        ticker: companyProfile.ticker,
        mode: controlMode,
        horizon: horizon
      });
      
      await simulation.runBackendSimulation(
        marketEnvironment,
        selectedEvents,
        horizon,
        controlMode.toLowerCase() as 'hold' | 'trajectory'
      );
      // Note: Results dialog will open automatically via useEffect when simulation completes
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setShowSummaryDialog(false);
    }
  };

  const handleProfileSet = (profile: {companyName?: string; ticker?: string; size: string; sector: string}) => {
    console.log('SimulatorControls handleProfileSet received:', profile);
    setCompanyProfile(profile);
    setShowProfileDialog(false);
    simulation.initializeSession(profile);
  };

  // Update market conditions in simulation when they change
  useEffect(() => {
    if (simulation.engine) {
      simulation.updateMarketConditions(marketEnvironment);
    }
  }, [marketEnvironment, simulation.engine]);

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="inline h-4 w-4 ml-1 text-muted-foreground cursor-help hover:text-primary transition-colors" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const ImpactInfo = ({ value }: { value: string }) => {
    const impact = impactExplanations[value as keyof typeof impactExplanations];
    if (!impact) return null;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center mt-2 p-2 bg-accent/50 rounded-md">
              <Info className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{impact}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <p className="text-sm">{impact}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      <CompanyProfileDialog 
        open={showProfileDialog} 
        onProfileSet={handleProfileSet}
      />
      
      <SimulationDialog
        open={showSummaryDialog}
        onClose={() => setShowSummaryDialog(false)}
        onConfirm={handleSimulationConfirm}
        isLoading={simulation.isSimulating}
      />
      
      <div className="space-y-6">
        {/* Stock Overview - Shows after profile is set */}
        {companyProfile && (
          <StockOverview profile={companyProfile} />
        )}

        {/* Current Mode Indicator */}
        <Card className={`border-2 ${controlMode === 'HOLD' ? 'border-green-500/40 bg-green-50/10' : 'border-blue-500/40 bg-blue-50/10'}`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${controlMode === 'HOLD' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {controlMode === 'HOLD' ? 
                    <CheckCircle className="h-4 w-4 text-white" /> : 
                    <TrendingUp className="h-4 w-4 text-white" />
                  }
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    Current Mode: <span className={controlMode === 'HOLD' ? 'text-green-700' : 'text-blue-700'}>{controlMode}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {controlMode === 'HOLD' ? 
                      'Market conditions stay constant (scalar values)' : 
                      'Market conditions can change over time (array values)'
                    }
                  </div>
                </div>
              </div>
              <Badge variant={controlMode === 'HOLD' ? 'default' : 'secondary'} className="text-xs">
                {controlMode === 'HOLD' ? 'Static' : 'Dynamic'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Changed Controls Indicator */}
        {Object.keys(changedControls).length > 0 && (
          <Card className="border-yellow-500/20 bg-yellow-50/10">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {Object.keys(changedControls).length} control{Object.keys(changedControls).length !== 1 ? 's' : ''} modified from neutral
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToNeutral}
                  className="text-xs"
                >
                  Reset to Neutral
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Market Environment */}
      <Card className="border-blue-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Globe className="h-5 w-5 text-blue-500" />
            <span>Market Environment</span>
            <Badge variant="secondary" className="ml-auto text-xs">Daily</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Market Sentiment Slider */}
          <MarketSlider
            value={marketEnvironment.overall_market_sentiment}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, overall_market_sentiment: value }));
              handleControlChange('overall_market_sentiment', value);
            }}
            min={-0.5295806094652642}
            max={0.5166648458286379}
            step={0.01}
            label="🎭 Overall Market Sentiment"
            description="Overall market sentiment and investor confidence levels"
            positiveImpact="Strong bullish sentiment drives buying interest and higher prices"
            negativeImpact="Bearish sentiment increases selling pressure and lowers prices"
          />

          {/* FII Flows */}
          <MarketSlider
            value={marketEnvironment.fii_flows}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, fii_flows: value }));
              handleControlChange('fii_flows', value);
            }}
            min={-1798.114816925352}
            max={1707.8646737801212}
            step={10}
            label="🌍 FII Flows (Foreign Institutional Investors)"
            description="Net foreign institutional investor money flows into Indian markets"
            positiveImpact="Foreign buying creates strong upward price pressure"
            negativeImpact="Foreign selling leads to significant downward pressure"
            unit=" Cr"
          />

          {/* DII Flows */}
          <MarketSlider
            value={marketEnvironment.dii_flows}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, dii_flows: value }));
              handleControlChange('dii_flows', value);
            }}
            min={-1580.3580671687012}
            max={1414.6913915950788}
            step={10}
            label="🏦 DII Flows (Domestic Institutional Investors)"
            description="Net domestic institutional investor flows (mutual funds, insurance companies)"
            positiveImpact="Domestic buying provides strong local support and price appreciation"
            negativeImpact="Domestic selling creates sustained downward pressure"
            unit=" Cr"
          />

          {/* Global Market Cues Slider */}
          <MarketSlider
            value={marketEnvironment.global_market_cues}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, global_market_cues: value }));
              handleControlChange('global_market_cues', value);
            }}
            min={-0.7021572639830562}
            max={0.6776104425671782}
            step={0.01}
            label="� Global Market Cues Impact"
            description="Impact of international market movements on domestic stock performance"
            positiveImpact="Positive global markets lift domestic stocks through risk-on sentiment"
            negativeImpact="Global market weakness drags down domestic stocks via risk-off flows"
          />

          {/* INR-USD Exchange Delta */}
          <MarketSlider
            value={marketEnvironment.inr_usd_delta}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, inr_usd_delta: value }));
              handleControlChange('inr_usd_delta', value);
            }}
            min={-0.0123434874854614}
            max={0.0111704830210777}
            step={0.001}
            label="💱 INR-USD Exchange Delta"
            description="Change in INR-USD exchange rate affecting stock valuations"
            positiveImpact="Rupee appreciation benefits import-heavy companies and reduces costs"
            negativeImpact="Rupee depreciation helps exporters but hurts importers and increases costs"
          />

          {/* Crude Oil Delta */}
          <MarketSlider
            value={marketEnvironment.crude_oil_delta}
            onValueChange={(value) => {
              setMarketEnvironment(prev => ({ ...prev, crude_oil_delta: value }));
              handleControlChange('crude_oil_delta', value);
            }}
            min={-0.0367144071644758}
            max={0.0429880748555434}
            step={0.001}
            label="🛢️ Crude Oil Delta"
            description="Change in crude oil prices impacting various sectors differently"
            positiveImpact="Rising oil prices benefit energy sector but increase costs for others"
            negativeImpact="Falling oil prices reduce input costs but hurt energy companies"
          />
        </CardContent>
      </Card>

      {/* Daily Company Events */}
      <Card className="border-orange-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <FileText className="h-5 w-5 text-orange-500" />
            <span>Company Events</span>
            <Badge variant="outline" className="ml-auto text-xs">One Per Day</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-muted-foreground p-2 bg-accent/30 rounded">
            ⚡ Trigger one event per day for maximum market impact
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={activeEvents.has("earnings") ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleEventSwitch("earnings")}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Earnings
            </Button>
            <Button 
              variant={activeEvents.has("analyst") ? "default" : "outline"} 
              size="sm"
              onClick={() => handleEventSwitch("analyst")}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Analyst
            </Button>
            <Button 
              variant={activeEvents.has("news") ? "default" : "outline"} 
              size="sm" 
              onClick={() => handleEventSwitch("news")}
              className="text-xs"
            >
              <Megaphone className="h-3 w-3 mr-1" />
              News
            </Button>
            <Button 
              variant={activeEvents.has("insider") ? "default" : "outline"} 
              size="sm"
              onClick={() => handleEventSwitch("insider")}
              className="text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Insider
            </Button>
          </div>
          
          <Button 
            variant={activeEvents.has("shock") ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => handleEventSwitch("shock")}
            className="w-full text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            🌍 Global Shock Event
          </Button>

          {activeEvents.has("earnings") && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                📊 Earnings Announcement
                <InfoTooltip content={tooltips.earnings} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "sig-beat", label: "🚀 Significant Beat (0.9)", impact: "Strong stock surge, high volume, bullish momentum", value: 0.9 },
                  { key: "slight-beat", label: "📈 Slight Beat (0.7)", impact: "Moderate gain, positive market sentiment", value: 0.7 },
                  { key: "meets", label: "➖ Meets Expectations (0.5)", impact: "Neutral market reaction, normal trading volume", value: 0.5 },
                  { key: "slight-miss", label: "📉 Slight Miss (0.3)", impact: "Price decline, investor disappointment", value: 0.3 },
                  { key: "sig-miss", label: "💥 Significant Miss (0.1)", impact: "Major drop, potential panic selling", value: 0.1 }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEvents.earnings && option.key === selectedEvents.earnings ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const isCurrentlySelected = selectedEvents.earnings === option.key;
                        if (isCurrentlySelected) {
                          // Deselect - reset to neutral
                          setSelectedEvents(prev => ({...prev, earnings: null}));
                          handleControlChange('earnings_announcement', NEUTRAL_DEFAULTS.earnings_announcement);
                        } else {
                          // Select this option
                          setSelectedEvents(prev => ({...prev, earnings: option.key}));
                          handleControlChange('earnings_announcement', option.value);
                        }
                      }}
                    >
                      <span className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">({option.value})</span>
                      </span>
                    </Button>
                    {selectedEvents.earnings === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        <div className="space-y-1">
                          <div><strong>Impact Value:</strong> {option.value} (Range: 0.0 - 1.0)</div>
                          <div><strong>Market Effect:</strong> {option.impact}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents.has("analyst") && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                ⭐ Analyst Rating Change
                <InfoTooltip content={tooltips.analystRating} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "major-upgrade", label: "🌟 Major Upgrade (+1.8)", impact: "Strong rally, significant institutional buying interest", value: 1.8 },
                  { key: "upgrade", label: "⬆️ Upgrade (+0.8)", impact: "Price boost, positive market momentum", value: 0.8 },
                  { key: "downgrade", label: "⬇️ Downgrade (-0.8)", impact: "Price pressure, increased selling interest", value: -0.8 },
                  { key: "major-downgrade", label: "💀 Major Downgrade (-1.8)", impact: "Sharp decline, heavy selling pressure", value: -1.8 }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEvents.analyst === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const isCurrentlySelected = selectedEvents.analyst === option.key;
                        if (isCurrentlySelected) {
                          // Deselect - reset to neutral
                          setSelectedEvents(prev => ({...prev, analyst: null}));
                          handleControlChange('analyst_rating_change', NEUTRAL_DEFAULTS.analyst_rating_change);
                        } else {
                          // Select this option
                          setSelectedEvents(prev => ({...prev, analyst: option.key}));
                          // Convert to 0-1 range for backend
                          const backendValue = (option.value + 2) / 4; // Convert -2 to +2 range to 0-1
                          handleControlChange('analyst_rating_change', backendValue);
                        }
                      }}
                    >
                      <span className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className={`text-xs font-medium ${option.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {option.value > 0 ? '+' : ''}{option.value}
                        </span>
                      </span>
                    </Button>
                    {selectedEvents.analyst === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        <div className="space-y-1">
                          <div><strong>Analyst Impact Value:</strong> {option.value} (Range: -2.0 to +2.0)</div>
                          <div><strong>Market Effect:</strong> {option.impact}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.value > 0 ? 'Positive analyst sentiment drives buying' : 'Negative analyst sentiment triggers selling'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents.has("news") && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                📢 Major News Announcement
                <InfoTooltip content={tooltips.majorNews} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "contract-win", label: "🏆 Major Contract Win", impact: "Market rally, significant growth prospects boost", type: "POSITIVE" },
                  { key: "product-launch", label: "🚀 New Product Launch", impact: "Innovation premium, enhanced future growth potential", type: "POSITIVE" },
                  { key: "ceo-resigns", label: "😱 CEO Resigns", impact: "Uncertainty-driven decline, leadership transition concerns", type: "NEGATIVE" },
                  { key: "regulatory-fine", label: "⚖️ Regulatory Fine", impact: "Compliance impact, reputation and operational concerns", type: "NEGATIVE" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEvents.majorNews === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const isCurrentlySelected = selectedEvents.majorNews === option.key;
                        if (isCurrentlySelected) {
                          // Deselect - reset to neutral
                          setSelectedEvents(prev => ({...prev, majorNews: null}));
                          handleControlChange('major_news', NEUTRAL_DEFAULTS.major_news);
                        } else {
                          // Select this option
                          setSelectedEvents(prev => ({...prev, majorNews: option.key}));
                          const newsType = option.type === 'POSITIVE' ? 'positive' : 'negative';
                          handleControlChange('major_news', newsType);
                        }
                      }}
                    >
                      <span className="flex justify-between w-full items-center">
                        <span>{option.label}</span>
                        <span className={`text-xs px-1 py-0.5 rounded text-white font-medium ${
                          option.type === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {option.type}
                        </span>
                      </span>
                    </Button>
                    {selectedEvents.majorNews === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong>News Type:</strong> 
                            <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                              option.type === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {option.type} NEWS
                            </span>
                          </div>
                          <div><strong>Market Effect:</strong> {option.impact}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.type === 'POSITIVE' 
                              ? 'Positive news drives investor optimism and buying interest' 
                              : 'Negative news creates uncertainty and selling pressure'
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents.has("insider") && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                👥 Insider Activity Report
                <InfoTooltip content={tooltips.insiderActivity} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { 
                    key: "promoter-buying", 
                    label: "💰 Heavy Promoter Buying", 
                    buttonText: "Buy",
                    impact: "Strong confidence signal, increased bullish market sentiment",
                    type: "POSITIVE"
                  },
                  { 
                    key: "promoter-selling", 
                    label: "📤 Heavy Promoter Selling", 
                    buttonText: "Sell",
                    impact: "Concern signal, heightened bearish market sentiment",
                    type: "NEGATIVE"
                  }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEvents.insiderActivity === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const isCurrentlySelected = selectedEvents.insiderActivity === option.key;
                        if (isCurrentlySelected) {
                          // Deselect - reset to neutral
                          setSelectedEvents(prev => ({...prev, insiderActivity: null}));
                          handleControlChange('insider_activity', NEUTRAL_DEFAULTS.insider_activity);
                        } else {
                          // Select this option
                          setSelectedEvents(prev => ({...prev, insiderActivity: option.key}));
                          const activityType = option.type === 'POSITIVE' ? 'buy' : 'sell';
                          handleControlChange('insider_activity', activityType);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{option.label}</span>
                        <span className={`text-xs px-1 py-0.5 rounded ${
                          option.type === "POSITIVE" 
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {option.type}
                        </span>
                      </div>
                    </Button>
                    {selectedEvents.insiderActivity === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        <div className="space-y-1">
                          <div>{option.impact}</div>
                          <div className="text-xs opacity-75">
                            {option.type === "POSITIVE" 
                              ? "Insider buying typically signals management confidence in company prospects" 
                              : "Insider selling may indicate concerns about future performance or valuation"
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeEvents.has("shock") && (
            <div className="space-y-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <Label className="flex items-center text-xs text-destructive">
                🌍 Global Shock Events
                <InfoTooltip content={tooltips.globalShock} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "geopolitical", label: "⚔️ Geopolitical Event", impact: "Risk-off sentiment, increased volatility and uncertainty", backend: "geo_political" },
                  { key: "pandemic", label: "🦠 Pandemic Wave", impact: "Economic shutdown concerns, sector rotation to defensive assets", backend: "pandemic_wave" },
                  { key: "inflation", label: "📈 Inflation Shock", impact: "Rising input costs pressure, commodity price surge effects", backend: "commodity_spike" },
                  { key: "budget-news", label: "📊 Sudden News (Budget)", impact: "Policy uncertainty, market volatility from unexpected announcements", backend: "policy_rate_shock" },
                  { key: "credit-event", label: "🏦 Credit Market Event", impact: "Liquidity concerns, credit spread widening and funding stress", backend: "credit_event" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEvents.globalShock === option.key ? "destructive" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => {
                        const isCurrentlySelected = selectedEvents.globalShock === option.key;
                        if (isCurrentlySelected) {
                          // Deselect - reset to neutral
                          setSelectedEvents(prev => ({...prev, globalShock: null}));
                          handleControlChange('predefined_global_shock', NEUTRAL_DEFAULTS.predefined_global_shock);
                        } else {
                          // Select this option
                          setSelectedEvents(prev => ({...prev, globalShock: option.key}));
                          handleControlChange('predefined_global_shock', option.backend);
                        }
                      }}
                    >
                      {option.label}
                    </Button>
                    {selectedEvents.globalShock === option.key && (
                      <div className="mt-1 p-2 bg-destructive/20 rounded text-xs text-destructive-foreground">
                        <AlertTriangle className="inline h-3 w-3 mr-1" />
                        {option.impact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Control Mode Selection */}
      <Card className="border-purple-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <span>Simulation Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-xs text-muted-foreground p-3 bg-accent/20 rounded-lg">
            <Info className="inline h-3 w-3 mr-1 text-primary" />
            Choose how market conditions behave during your simulation period.
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* HOLD Mode */}
            <div className={`border rounded-lg p-3 cursor-pointer transition-all ${
              controlMode === 'HOLD' 
                ? 'border-green-500 bg-green-50/20 ring-2 ring-green-200' 
                : 'border-border hover:border-green-300'
            }`}
            onClick={() => {
              console.log('HOLD clicked');
              handleControlModeChange('HOLD');
            }}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  controlMode === 'HOLD' ? 'bg-green-500 text-white' : 'bg-muted'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">HOLD Mode</span>
                    <Badge variant={controlMode === 'HOLD' ? 'default' : 'outline'} className="text-xs">
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Set constant market conditions for the entire simulation period.
                  </p>
                  <div className="text-xs bg-accent/30 p-2 rounded">
                    <div className="font-medium mb-1">Best for:</div>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Testing specific market scenarios</li>
                      <li>• Understanding impact of single events</li>
                      <li>• Stable environment analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* TRAJECTORY Mode */}
            <div className={`border rounded-lg p-3 cursor-pointer transition-all ${
              controlMode === 'TRAJECTORY' 
                ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-200' 
                : 'border-border hover:border-blue-300'
            }`}
            onClick={() => {
              console.log('TRAJECTORY clicked');
              handleControlModeChange('TRAJECTORY');
            }}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  controlMode === 'TRAJECTORY' ? 'bg-blue-500 text-white' : 'bg-muted'
                }`}>
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">TRAJECTORY Mode</span>
                    <Badge variant="secondary" className="text-xs">Advanced</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Create time-varying market conditions with dynamic changes over time.
                  </p>
                  <div className="text-xs bg-accent/30 p-2 rounded">
                    <div className="font-medium mb-1">Best for:</div>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Complex market evolution scenarios</li>
                      <li>• Simulating gradual changes</li>
                      <li>• Advanced strategy testing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode specific explanation */}
          <div className="p-3 bg-accent/10 rounded-lg">
            {controlMode === 'HOLD' && (
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="text-xs">
                  <div className="font-medium text-green-700 mb-1">HOLD Mode Selected</div>
                  <div className="text-muted-foreground">
                    Your current control settings will remain constant throughout the entire simulation period. 
                    This provides predictable conditions for analysis.
                  </div>
                </div>
              </div>
            )}
            
            {controlMode === 'TRAJECTORY' && (
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs">
                  <div className="font-medium text-blue-700 mb-1">TRAJECTORY Mode Selected</div>
                  <div className="text-muted-foreground">
                    Market conditions will evolve over time based on generated trajectories. 
                    This creates more realistic but complex market scenarios.
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Apply Changes Button */}
      <Button 
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white" 
        size="lg"
        onClick={() => {
          if (!companyProfile) {
            setShowProfileDialog(true);
            return;
          }
          setShowSummaryDialog(true);
        }}
        disabled={!companyProfile}
      >
        <Play className="h-4 w-4 mr-2" />
        {!companyProfile 
          ? 'Set Company Profile First'
          : controlMode === 'TRAJECTORY' 
            ? 'Setup & Run Trajectory Simulation' 
            : 'Setup & Run HOLD Simulation'
        }
      </Button>
      
      {/* Simulation Control Buttons */}
      {companyProfile && (
        <div className="grid grid-cols-1 gap-2">
          <Button 
            variant="outline" 
            onClick={() => simulation.resetSimulation()}
            className="w-full"
          >
            Reset Simulation
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              // Check if any events are selected across all categories
              const hasSelectedEvents = Object.values(selectedEvents).some(event => event !== null);
              
              if (hasSelectedEvents && activeEvents.size > 0) {
                // Trigger events for all active event types with their selected subtypes
                activeEvents.forEach(eventType => {
                  let subtype = null;
                  
                  // Map event types to their selected subtypes
                  switch(eventType) {
                    case 'earnings':
                      subtype = selectedEvents.earnings;
                      break;
                    case 'analyst':
                      subtype = selectedEvents.analyst;
                      break;
                    case 'news':
                      subtype = selectedEvents.majorNews;
                      break;
                    case 'insider':
                      subtype = selectedEvents.insiderActivity;
                      break;
                    case 'shock':
                      subtype = selectedEvents.globalShock;
                      break;
                  }
                  
                  if (subtype) {
                    simulation.triggerEvent({
                      type: eventType as any,
                      subtype: subtype,
                      impact: 1.0
                    });
                  }
                });
                
                // Reset all selections
                setSelectedEvents({
                  earnings: null,
                  analyst: null,
                  majorNews: null,
                  insiderActivity: null,
                  globalShock: null
                });
                setActiveEvents(new Set());
              } else {
                simulation.simulateNextDay();
              }
            }}
            className="w-full text-xs"
          >
            {Object.values(selectedEvents).some(event => event !== null) && activeEvents.size > 0
              ? `🎯 Trigger Selected Events (Multi-Select)`
              : 'Simulate Next Day '
            }
          </Button>
        </div>
      )}
      </div>
    </>
  );
}