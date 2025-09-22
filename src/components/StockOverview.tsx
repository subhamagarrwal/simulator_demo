import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Building2, TrendingUp, Activity } from "lucide-react";
import { useSimulation } from "../contexts/SimulationContext";

interface CompanyProfile {
  companyName?: string;
  ticker?: string;
  size: string;
  sector: string;
}

interface StockOverviewProps {
  profile: CompanyProfile;
}

export function StockOverview({ profile }: StockOverviewProps) {
  const simulation = useSimulation();
  
  // Debug logging
  console.log('StockOverview received profile:', profile);
  
  const currentPrice = simulation.currentPrice;
  const priceChange = simulation.priceChange.absolute;
  const priceChangePercent = simulation.priceChange.percentage;
  
  const getSizeLabel = (size: string) => {
    switch (size) {
      case "small-cap":
        return "Small Cap";
      case "mid-cap":
        return "Mid Cap";
      case "large-cap":
        return "Large Cap";
      default:
        return size;
    }
  };

  const getSectorLabel = (sectorValue: string) => {
    const sectorLabels: Record<string, string> = {
      "financial-services": "Financial Services",
      "it": "Information Technology",
      "healthcare": "Healthcare",
      "consumer-discretionary": "Consumer Discretionary",
      "consumer-staples": "Consumer Staples (FMCG)",
      "industrials": "Industrials",
      "materials": "Materials",
      "chemicals": "Chemicals",
      "metals-mining": "Metals & Mining",
      "energy": "Energy",
      "utilities": "Utilities",
      "real-estate": "Real Estate",
      "telecom": "Telecom / Communication Services"
    };
    return sectorLabels[sectorValue] || sectorValue;
  };

  const getCompanyName = (sector: string) => {
    const companyNames: Record<string, string> = {
      "financial-services": "ABC Financial Ltd",
      "it": "TechCorp Solutions",
      "healthcare": "MediLife Industries",
      "consumer-discretionary": "RetailMax Group",
      "consumer-staples": "FastConsume Ltd",
      "industrials": "IndustrialTech Corp",
      "materials": "BuildMate Materials",
      "chemicals": "ChemTech Industries",
      "metals-mining": "SteelCorp Mining",
      "energy": "PowerGen Energy",
      "utilities": "UtilityMax Corp",
      "real-estate": "PropertyDev Ltd",
      "telecom": "ConnectTel Services"
    };
    return companyNames[sector] || "Your Company Ltd";
  };

  const getCompanyTicker = (sector: string) => {
    const tickerNames: Record<string, string> = {
      "financial-services": "ABCFIN",
      "it": "TECHCORP",
      "healthcare": "MEDLIFE",
      "consumer-discretionary": "RETAIL",
      "consumer-staples": "FASTCON",
      "industrials": "INDTECH",
      "materials": "BUILD",
      "chemicals": "CHEM",
      "metals-mining": "STEEL",
      "energy": "POWER",
      "utilities": "UTIL",
      "real-estate": "PROP",
      "telecom": "CONNECT"
    };
    return tickerNames[sector] || "STOCK";
  };

  // Use provided names or fallback to generic ones
  const displayCompanyName = profile.companyName || getCompanyName(profile.sector);
  const displayTicker = profile.ticker || getCompanyTicker(profile.sector);

  console.log('Display values:', {
    providedCompanyName: profile.companyName,
    displayCompanyName,
    providedTicker: profile.ticker,
    displayTicker
  });

  const isPositive = priceChange >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Stock Overview</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Company Info */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{displayCompanyName}</h3>
                <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {displayTicker}
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {getSizeLabel(profile.size)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{getSectorLabel(profile.sector)}</p>
          </div>

          {/* Price Info */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <div className="text-2xl font-bold">₹{currentPrice.toFixed(2)}</div>
              <div className="flex items-center space-x-2 text-sm">
                <Activity className="h-4 w-4" />
                <span className="text-muted-foreground">Current Price</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-semibold flex items-center space-x-1 ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                <TrendingUp className={`h-4 w-4 ${isPositive ? '' : 'rotate-180'}`} />
                <span>{isPositive ? '+' : ''}₹{priceChange.toFixed(2)}</span>
              </div>
              <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Market Status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Market Status</span>
            <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">
              Market Open
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}