import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Building2, TrendingUp } from "lucide-react";

interface CompanyProfile {
  size: string;
  sector: string;
}

interface CompanyProfileDialogProps {
  open: boolean;
  onProfileSet: (profile: CompanyProfile) => void;
}

export function CompanyProfileDialog({ open, onProfileSet }: CompanyProfileDialogProps) {
  const [companySize, setCompanySize] = useState("");
  const [sector, setSector] = useState("");

  const handleSubmit = () => {
    if (companySize && sector) {
      onProfileSet({ size: companySize, sector });
    }
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
              <Label className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Company Size
              </Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="bg-card">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large-cap">Large Cap (₹10,000Cr+)</SelectItem>
                  <SelectItem value="mid-cap">Mid Cap (₹2,000Cr - ₹10,000Cr)</SelectItem>
                  <SelectItem value="small-cap">Small Cap (₹500Cr - ₹2,000Cr)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center text-sm">
                <Building2 className="h-4 w-4 mr-1" />
                Sector
              </Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="bg-card">
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