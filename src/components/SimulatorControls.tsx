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
import { useState, useEffect } from "react";

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
  const [companyProfile, setCompanyProfile] = useState<{size: string; sector: string} | null>(null);
  
  const [marketEnvironment, setMarketEnvironment] = useState({
    sentiment: "neutral",
    overall_market_sentiment: 0, // Range: -0.5295806094652642 to 0.5166648458286379
    fii_flows: 0, // Range: -1798.114816925352 to 1707.8646737801212
    dii_flows: 0, // Range: -1580.3580671687012 to 1414.6913915950788
    globalCues: "neutral",
    global_market_cues: 0, // Range: -0.7021572639830562 to 0.6776104425671782
    exchangeRate: "stable",
    inr_usd_delta: 0, // Range: -0.0123434874854614 to 0.0111704830210777
    crudeOil: "stable",
    crude_oil_delta: 0 // Range: -0.0367144071644758 to 0.0429880748555434
  });
  
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [selectedEventOption, setSelectedEventOption] = useState<string | null>(null);

  const handleProfileSet = (profile: {size: string; sector: string}) => {
    setCompanyProfile(profile);
    setShowProfileDialog(false);
    simulation.initializeSimulation(profile);
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
      
      <div className="space-y-6">
        {/* Stock Overview - Shows after profile is set */}
        {companyProfile && (
          <StockOverview profile={companyProfile} />
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
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, overall_market_sentiment: value }))}
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
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, fii_flows: value }))}
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
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, dii_flows: value }))}
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
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, global_market_cues: value }))}
            min={-0.7021572639830562}
            max={0.6776104425671782}
            step={0.01}
            label="� Global Market Cues Impact"
            description="Impact of international market movements on domestic stock performance"
            positiveImpact="Positive global markets lift domestic stocks through risk-on sentiment"
            negativeImpact="Global market weakness drags down domestic stocks via risk-off flows"
          />

          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              {/* Crude Oil Prices Removed */}
            </Label>
            <Select 
              value={marketEnvironment.crudeOil} 
              onValueChange={(value: string) => setMarketEnvironment(prev => ({ ...prev, crudeOil: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sharply-up">🚀 Sharply Up</SelectItem>
                <SelectItem value="up">� Up</SelectItem>
                <SelectItem value="stable">➖ Stable</SelectItem>
                <SelectItem value="down">📉 Down</SelectItem>
                <SelectItem value="sharply-down">💥 Sharply Down</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.crudeOil} />
          </div>

          {/* INR-USD Exchange Delta */}
          <MarketSlider
            value={marketEnvironment.inr_usd_delta}
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, inr_usd_delta: value }))}
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
            onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, crude_oil_delta: value }))}
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
              variant={activeEvent === "earnings" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveEvent(activeEvent === "earnings" ? null : "earnings")}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Earnings
            </Button>
            <Button 
              variant={activeEvent === "analyst" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveEvent(activeEvent === "analyst" ? null : "analyst")}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Analyst
            </Button>
            <Button 
              variant={activeEvent === "news" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setActiveEvent(activeEvent === "news" ? null : "news")}
              className="text-xs"
            >
              <Megaphone className="h-3 w-3 mr-1" />
              News
            </Button>
            <Button 
              variant={activeEvent === "insider" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveEvent(activeEvent === "insider" ? null : "insider")}
              className="text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Insider
            </Button>
          </div>
          
          <Button 
            variant={activeEvent === "shock" ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => setActiveEvent(activeEvent === "shock" ? null : "shock")}
            className="w-full text-xs"
          >
            <AlertTriangle className="h-3 w-3 mr-1" />
            🌍 Global Shock Event
          </Button>

          {activeEvent === "earnings" && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                📊 Earnings Announcement
                <InfoTooltip content={tooltips.earnings} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "sig-beat", label: "🚀 Significant Beat (0.9)", impact: "Stock surge +8-15%, High volume, Bullish momentum", value: 0.9 },
                  { key: "slight-beat", label: "📈 Slight Beat (0.7)", impact: "Moderate gain +3-7%, Positive sentiment", value: 0.7 },
                  { key: "meets", label: "➖ Meets Expectations (0.5)", impact: "Neutral reaction ±2%, Normal trading", value: 0.5 },
                  { key: "slight-miss", label: "📉 Slight Miss (0.3)", impact: "Price decline -3-7%, Disappointment", value: 0.3 },
                  { key: "sig-miss", label: "💥 Significant Miss (0.1)", impact: "Major drop -8-15%, Panic selling", value: 0.1 }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      <span className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">({option.value})</span>
                      </span>
                    </Button>
                    {selectedEventOption === option.key && (
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

          {activeEvent === "analyst" && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                ⭐ Analyst Rating Change
                <InfoTooltip content={tooltips.analystRating} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "major-upgrade", label: "🌟 Major Upgrade (+1.8)", impact: "Strong rally +5-12%, Institutional buying", value: 1.8 },
                  { key: "upgrade", label: "⬆️ Upgrade (+0.8)", impact: "Price boost +2-6%, Positive momentum", value: 0.8 },
                  { key: "downgrade", label: "⬇️ Downgrade (-0.8)", impact: "Price pressure -2-6%, Selling interest", value: -0.8 },
                  { key: "major-downgrade", label: "💀 Major Downgrade (-1.8)", impact: "Sharp fall -5-12%, Heavy selling", value: -1.8 }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      <span className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className={`text-xs font-medium ${option.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {option.value > 0 ? '+' : ''}{option.value}
                        </span>
                      </span>
                    </Button>
                    {selectedEventOption === option.key && (
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

          {activeEvent === "news" && (
            <div className="space-y-2 p-3 bg-accent/20 rounded-lg">
              <Label className="flex items-center text-xs">
                📢 Major News Announcement
                <InfoTooltip content={tooltips.majorNews} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "contract-win", label: "🏆 Major Contract Win", impact: "Rally +4-10%, Growth prospects boost", type: "POSITIVE" },
                  { key: "product-launch", label: "🚀 New Product Launch", impact: "Innovation premium +2-8%, Future potential", type: "POSITIVE" },
                  { key: "ceo-resigns", label: "😱 CEO Resigns", impact: "Uncertainty decline -3-8%, Leadership concerns", type: "NEGATIVE" },
                  { key: "regulatory-fine", label: "⚖️ Regulatory Fine", impact: "Compliance hit -2-6%, Reputation damage", type: "NEGATIVE" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
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
                    {selectedEventOption === option.key && (
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

          {activeEvent === "insider" && (
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
                    impact: "Confidence signal +3-8%, Bullish sentiment",
                    type: "POSITIVE"
                  },
                  { 
                    key: "promoter-selling", 
                    label: "📤 Heavy Promoter Selling", 
                    buttonText: "Sell",
                    impact: "Concern signal -3-8%, Bearish sentiment",
                    type: "NEGATIVE"
                  }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
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
                    {selectedEventOption === option.key && (
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

          {activeEvent === "shock" && (
            <div className="space-y-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <Label className="flex items-center text-xs text-destructive">
                🌍 Global Shock Events
                <InfoTooltip content={tooltips.globalShock} />
              </Label>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { key: "financial-crisis", label: "💸 Financial Crisis", impact: "Market crash -15-30%, Panic selling, Flight to safety" },
                  { key: "geopolitical", label: "⚔️ Geopolitical Conflict", impact: "Risk-off sentiment -10-25%, Volatility spike" },
                  { key: "pandemic", label: "🦠 Pandemic News", impact: "Economic shutdown fears -20-35%, Sector rotation" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "destructive" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      {option.label}
                    </Button>
                    {selectedEventOption === option.key && (
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

      {/* Apply Changes Button */}
      <Button 
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white" 
        size="lg"
        onClick={() => {
          if (selectedEventOption && activeEvent) {
            simulation.triggerEvent({
              type: activeEvent as any,
              subtype: selectedEventOption,
              impact: 1.0
            });
            setSelectedEventOption(null);
            setActiveEvent(null);
          } else {
            simulation.simulateNextDay();
          }
        }}
      >
        <Play className="h-4 w-4 mr-2" />
        {selectedEventOption && activeEvent 
          ? `🎯 Trigger ${selectedEventOption.replace('-', ' ').toUpperCase()} Event`
          : '🚀 Apply Changes & Run Simulation Day'
        }
      </Button>
      
      {/* Simulation Control Buttons */}
      {companyProfile && (
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={() => simulation.isRunning ? simulation.stopSimulation() : simulation.startSimulation()}
            className="w-full"
          >
            {simulation.isRunning ? 'Pause' : 'Auto Run'} (Day {simulation.currentDay})
          </Button>
          <Button 
            variant="outline" 
            onClick={() => simulation.resetSimulation()}
            className="w-full"
          >
            Reset Simulation
          </Button>
        </div>
      )}
      </div>
    </>
  );
}