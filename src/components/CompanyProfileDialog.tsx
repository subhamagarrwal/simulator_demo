import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building2, TrendingUp } from "lucide-react";

interface CompanyProfile {
  companyName?: string;
  ticker?: string;
  size: string;
  sector: string;
}

interface CompanyProfileDialogProps {
  open: boolean;
  onProfileSet: (profile: CompanyProfile) => void;
}

export function CompanyProfileDialog({ open, onProfileSet }: CompanyProfileDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [sector, setSector] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Company name is optional, but if provided, should not be empty
    if (companyName.trim() === "" && companyName.length > 0) {
      newErrors.companyName = 'Company name cannot be empty if provided';
    }
    
    // Ticker is optional, but if provided, should follow format
    if (ticker.trim() !== "" && !/^[A-Z]{2,6}$/.test(ticker.trim().toUpperCase())) {
      newErrors.ticker = 'Ticker should be 2-6 uppercase letters (e.g., RELIANCE, TCS)';
    }
    
    if (!sector) {
      newErrors.sector = 'Please select a sector';
    }
    
    if (!companySize) {
      newErrors.companySize = 'Please select company size';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const profile: CompanyProfile = { 
        size: companySize, 
        sector 
      };
      
      // Only add companyName and ticker if they are provided and not empty
      if (companyName.trim()) {
        profile.companyName = companyName.trim();
      }
      if (ticker.trim()) {
        profile.ticker = ticker.trim().toUpperCase();
      }
      
      console.log('CompanyProfileDialog submitting profile:', profile);
      onProfileSet(profile);
    }
  };

  const handleTickerChange = (value: string) => {
    // Auto-uppercase and limit to 6 characters
    const formatted = value.toUpperCase().slice(0, 6);
    setTicker(formatted);
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case "small-cap":
        return "Small Cap (₹500Cr - ₹2,000Cr)";
      case "mid-cap":
        return "Mid Cap (₹2,000Cr - ₹10,000Cr)";
      case "large-cap":
        return "Large Cap (₹10,000Cr+)";
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

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Setup Your Company Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-sm text-muted-foreground">
            Let's set up your company profile to begin the trading simulation. This will determine how market events affect your stock price.
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                placeholder="e.g., Reliance Industries Ltd (leave empty for generic name)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={errors.companyName ? "border-red-500" : ""}
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticker">Stock Ticker (Optional)</Label>
              <Input
                id="ticker"
                placeholder="e.g., RELIANCE, TCS, INFY (leave empty for generic ticker)"
                value={ticker}
                onChange={(e) => handleTickerChange(e.target.value)}
                className={errors.ticker ? "border-red-500" : ""}
                maxLength={6}
              />
              {errors.ticker && (
                <p className="text-sm text-red-500">{errors.ticker}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Stock symbol as listed on NSE/BSE
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Company Size *
              </Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className={`bg-card ${errors.companySize ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large-cap">Large Cap (Starting Price: ₹179.52)</SelectItem>
                  <SelectItem value="mid-cap">Medium Cap  (Starting Price: ₹154.80)</SelectItem>
                  <SelectItem value="small-cap">Small Cap (Starting Price: ₹124.36)</SelectItem>
                </SelectContent>
              </Select>
              {errors.companySize && (
                <p className="text-sm text-red-500">{errors.companySize}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-1" />
                Sector *
              </Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className={`bg-card ${errors.sector ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial-services">Financial Services</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="consumer-discretionary">Consumer Discretionary</SelectItem>
                  <SelectItem value="consumer-staples">Consumer Staples (FMCG)</SelectItem>
                  <SelectItem value="industrials">Industrials</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="chemicals">Chemicals</SelectItem>
                  <SelectItem value="metals-mining">Metals & Mining</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="telecom">Telecom / Communication Services</SelectItem>
                </SelectContent>
              </Select>
              {errors.sector && (
                <p className="text-sm text-red-500">{errors.sector}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!companySize || !sector}
            className="w-full"
          >
            Start Trading Simulation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}