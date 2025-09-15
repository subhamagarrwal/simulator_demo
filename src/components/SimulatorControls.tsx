import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
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
  const [companyProfile, setCompanyProfile] = useState({
    size: "",
    sector: ""
  });
  
  const [marketEnvironment, setMarketEnvironment] = useState({
    sentiment: "neutral",
    flows: "neutral", 
    globalCues: "neutral",
    exchangeRate: "stable",
    crudeOil: "stable"
  });
  
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [selectedEventOption, setSelectedEventOption] = useState<string | null>(null);

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
    <div className="space-y-6">
      {/* Company Profile Setup */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Company Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              Company Size
              <InfoTooltip content={tooltips.companySize} />
            </Label>
            <Select 
              value={companyProfile.size} 
              onValueChange={(value) => setCompanyProfile(prev => ({ ...prev, size: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small-cap">Small-Cap</SelectItem>
                <SelectItem value="mid-cap">Mid-Cap</SelectItem>
                <SelectItem value="large-cap">Large-Cap</SelectItem>
              </SelectContent>
            </Select>
            {companyProfile.size && <ImpactInfo value={companyProfile.size} />}
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              Sector
              <InfoTooltip content={tooltips.sector} />
            </Label>
            <Select 
              value={companyProfile.sector} 
              onValueChange={(value) => setCompanyProfile(prev => ({ ...prev, sector: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial-services">Financial Services (banks, NBFCs, insurance, asset management)</SelectItem>
                <SelectItem value="it">Information Technology (IT Services & Software)</SelectItem>
                <SelectItem value="healthcare">Healthcare (pharma, hospitals, biotech)</SelectItem>
                <SelectItem value="consumer-discretionary">Consumer Discretionary (auto, retail, apparel, leisure, etc.)</SelectItem>
                <SelectItem value="consumer-staples">Consumer Staples / FMCG (food, beverages, household, personal products)</SelectItem>
                <SelectItem value="industrials">Industrials (manufacturing, logistics, defense, infrastructure)</SelectItem>
                <SelectItem value="materials">Materials (construction materials, paper, packaging)</SelectItem>
                <SelectItem value="chemicals">Chemicals (specialty chemicals, agrochemicals)</SelectItem>
                <SelectItem value="metals-mining">Metals & Mining (steel, aluminum, copper, coal, etc.)</SelectItem>
                <SelectItem value="energy">Energy (oil, gas, renewable energy)</SelectItem>
                <SelectItem value="utilities">Utilities (power generation, water, gas distribution)</SelectItem>
                <SelectItem value="real-estate">Real Estate (REITs, developers, property management)</SelectItem>
                <SelectItem value="telecom">Telecom / Communication Services (telecom operators, media, internet)</SelectItem>
              </SelectContent>
            </Select>
            {companyProfile.sector && <ImpactInfo value={companyProfile.sector} />}
          </div>
          
          {companyProfile.size && companyProfile.sector && (
            <div className="pt-2">
              <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Profile Ready - Initialize Company
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              Market Sentiment
              <InfoTooltip content={tooltips.marketSentiment} />
            </Label>
            <Select 
              value={marketEnvironment.sentiment} 
              onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, sentiment: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strongly-bullish">🚀 Strongly Bullish</SelectItem>
                <SelectItem value="bullish">📈 Bullish</SelectItem>
                <SelectItem value="neutral">➖ Neutral</SelectItem>
                <SelectItem value="bearish">📉 Bearish</SelectItem>
                <SelectItem value="strongly-bearish">💥 Strongly Bearish</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.sentiment} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              <Briefcase className="h-4 w-4 mr-1" />
              Investor Flows (FII & DII)
              <InfoTooltip content={tooltips.investorFlows} />
            </Label>
            <Select 
              value={marketEnvironment.flows} 
              onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, flows: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strong-inflows">💰 Strong Inflows</SelectItem>
                <SelectItem value="moderate-inflows">💵 Moderate Inflows</SelectItem>
                <SelectItem value="neutral">➖ Neutral</SelectItem>
                <SelectItem value="moderate-outflows">💸 Moderate Outflows</SelectItem>
                <SelectItem value="strong-outflows">🏃 Strong Outflows</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.flows} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              <Globe className="h-4 w-4 mr-1" />
              Global Market Cues
              <InfoTooltip content={tooltips.globalCues} />
            </Label>
            <Select 
              value={marketEnvironment.globalCues} 
              onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, globalCues: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strongly-positive">🌟 Strongly Positive</SelectItem>
                <SelectItem value="positive">✅ Positive</SelectItem>
                <SelectItem value="neutral">➖ Neutral</SelectItem>
                <SelectItem value="negative">❌ Negative</SelectItem>
                <SelectItem value="strongly-negative">💀 Strongly Negative</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.globalCues} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-1" />
              INR-USD Exchange Rate
              <InfoTooltip content={tooltips.exchangeRate} />
            </Label>
            <Select 
              value={marketEnvironment.exchangeRate} 
              onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, exchangeRate: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rupee-appreciating">💪 Rupee Appreciating</SelectItem>
                <SelectItem value="stable">➖ Stable</SelectItem>
                <SelectItem value="rupee-depreciating">📉 Rupee Depreciating</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.exchangeRate} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm">
              <Fuel className="h-4 w-4 mr-1" />
              Crude Oil Prices
              <InfoTooltip content={tooltips.crudeOil} />
            </Label>
            <Select 
              value={marketEnvironment.crudeOil} 
              onValueChange={(value) => setMarketEnvironment(prev => ({ ...prev, crudeOil: value }))}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sharply-up">🚀 Sharply Up</SelectItem>
                <SelectItem value="up">📈 Up</SelectItem>
                <SelectItem value="stable">➖ Stable</SelectItem>
                <SelectItem value="down">📉 Down</SelectItem>
                <SelectItem value="sharply-down">💥 Sharply Down</SelectItem>
              </SelectContent>
            </Select>
            <ImpactInfo value={marketEnvironment.crudeOil} />
          </div>
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
                  { key: "sig-beat", label: "🚀 Significant Beat", impact: "Stock surge +8-15%, High volume, Bullish momentum" },
                  { key: "slight-beat", label: "📈 Slight Beat", impact: "Moderate gain +3-7%, Positive sentiment" },
                  { key: "meets", label: "➖ Meets Expectations", impact: "Neutral reaction ±2%, Normal trading" },
                  { key: "slight-miss", label: "📉 Slight Miss", impact: "Price decline -3-7%, Disappointment" },
                  { key: "sig-miss", label: "💥 Significant Miss", impact: "Major drop -8-15%, Panic selling" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      {option.label}
                    </Button>
                    {selectedEventOption === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        {option.impact}
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
                  { key: "major-upgrade", label: "🌟 Major Upgrade", impact: "Strong rally +5-12%, Institutional buying" },
                  { key: "upgrade", label: "⬆️ Upgrade", impact: "Price boost +2-6%, Positive momentum" },
                  { key: "downgrade", label: "⬇️ Downgrade", impact: "Price pressure -2-6%, Selling interest" },
                  { key: "major-downgrade", label: "💀 Major Downgrade", impact: "Sharp fall -5-12%, Heavy selling" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      {option.label}
                    </Button>
                    {selectedEventOption === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        {option.impact}
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
                  { key: "contract-win", label: "🏆 Major Contract Win", impact: "Rally +4-10%, Growth prospects boost" },
                  { key: "product-launch", label: "🚀 New Product Launch", impact: "Innovation premium +2-8%, Future potential" },
                  { key: "ceo-resigns", label: "😱 CEO Resigns", impact: "Uncertainty decline -3-8%, Leadership concerns" },
                  { key: "regulatory-fine", label: "⚖️ Regulatory Fine", impact: "Compliance hit -2-6%, Reputation damage" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      {option.label}
                    </Button>
                    {selectedEventOption === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        {option.impact}
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
                  { key: "promoter-buying", label: "💰 Heavy Promoter Buying", impact: "Confidence signal +3-8%, Bullish sentiment" },
                  { key: "promoter-selling", label: "📤 Heavy Promoter Selling", impact: "Concern signal -3-8%, Bearish sentiment" }
                ].map((option) => (
                  <div key={option.key}>
                    <Button 
                      variant={selectedEventOption === option.key ? "default" : "outline"} 
                      size="sm" 
                      className="w-full text-xs justify-start"
                      onClick={() => setSelectedEventOption(selectedEventOption === option.key ? null : option.key)}
                    >
                      {option.label}
                    </Button>
                    {selectedEventOption === option.key && (
                      <div className="mt-1 p-2 bg-accent/50 rounded text-xs text-muted-foreground">
                        <Info className="inline h-3 w-3 mr-1 text-primary" />
                        {option.impact}
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
      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white" size="lg">
        <Play className="h-4 w-4 mr-2" />
        🚀 Apply Changes & Run Simulation Day
      </Button>
    </div>
  );
}