import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  Settings,
  Info,
  Play,
  AlertCircle
} from "lucide-react";

export interface SimulationSummaryData {
  companyProfile: {
    companyName?: string;
    ticker?: string;
    size: string;
    sector: string;
  };
  mode: 'HOLD' | 'TRAJECTORY';
  changedControls: Record<string, any>;
  selectedEvents: {
    activeEvents?: string[];
    eventOption?: string;
  };
}

interface SimulationSummaryDialogProps {
  open: boolean;
  data: SimulationSummaryData;
  onClose: () => void;
  onConfirm: (horizon: number) => void;
  isLoading?: boolean;
}

export function SimulationSummaryDialog({ 
  open, 
  data, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: SimulationSummaryDialogProps) {
  const [horizon, setHorizon] = useState(30);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!horizon || horizon < 1 || horizon > 365) {
      newErrors.horizon = 'Horizon must be between 1 and 365 days';
    }
    
    if (horizon > 90) {
      newErrors.horizon = 'Warning: Simulations over 90 days may take longer to process';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => !newErrors[key].startsWith('Warning')).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(horizon);
    }
  };

  const formatControlName = (key: string): string => {
    const formatMap: Record<string, string> = {
      overall_market_sentiment: 'Market Sentiment',
      fii_flows: 'FII Flows',
      dii_flows: 'DII Flows',
      global_market_cues: 'Global Market Cues',
      inr_usd_delta: 'INR-USD Exchange',
      crude_oil_delta: 'Crude Oil Prices',
      earnings_announcement: 'Earnings Event',
      analyst_rating_change: 'Analyst Rating',
      major_news: 'Major News',
      insider_activity: 'Insider Activity',
      predefined_global_shock: 'Global Shock'
    };
    return formatMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatControlValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      if (key.includes('flows')) {
        return `₹${value.toFixed(0)} Cr`;
      }
      if (key.includes('delta')) {
        return `${(value * 100).toFixed(2)}%`;
      }
      if (key.includes('sentiment') || key.includes('cues')) {
        return value.toFixed(3);
      }
      return value.toString();
    }
    return value.toString().replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const getControlImpact = (key: string, value: any): { type: 'positive' | 'negative' | 'neutral', label: string } => {
    if (typeof value === 'number') {
      if (value > 0.1) return { type: 'positive', label: 'Positive Impact' };
      if (value < -0.1) return { type: 'negative', label: 'Negative Impact' };
      return { type: 'neutral', label: 'Minimal Impact' };
    }
    if (value === 'positive') return { type: 'positive', label: 'Positive Event' };
    if (value === 'negative') return { type: 'negative', label: 'Negative Event' };
    return { type: 'neutral', label: 'Neutral' };
  };

  const getEstimatedDuration = (horizon: number): string => {
    if (horizon <= 30) return "< 30 seconds";
    if (horizon <= 90) return "30-60 seconds";
    return "1-2 minutes";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[500px] h-[350px] flex flex-col p-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Simulation Summary</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Fixed Company Profile Section */}
        <div className="flex-shrink-0 px-6 pb-4">
          <div className="bg-accent/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Company Profile</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Company:</span>
                <p className="font-medium">{data.companyProfile.companyName || "Generic Company"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ticker:</span>
                <p className="font-medium">{data.companyProfile.ticker || "SAMPLE"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <Badge variant="outline" className="text-xs">{data.companyProfile.size.replace('-', ' ').toUpperCase()}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Sector:</span>
                <Badge variant="secondary" className="text-xs">{data.companyProfile.sector.replace('-', ' ').toUpperCase()}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0 space-y-4">
          {/* Simulation Mode */}
          <div className="bg-accent/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              {data.mode === 'HOLD' ? <CheckCircle className="h-4 w-4 text-green-500" /> : <TrendingUp className="h-4 w-4 text-blue-500" />}
              <span className="font-medium text-sm">Mode: {data.mode}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {data.mode === 'HOLD' 
                ? "Market conditions remain constant throughout simulation"
                : "Market conditions evolve dynamically over time"
              }
            </p>
          </div>

          {/* Changed Controls */}
          {Object.keys(data.changedControls).length > 0 && (
            <div className="bg-accent/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-sm">Modified Controls ({Object.keys(data.changedControls).length})</span>
              </div>
              <div className="space-y-2">
                {Object.entries(data.changedControls).map(([key, value], index) => {
                  const impact = getControlImpact(key, value);
                  return (
                    <div key={key} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{formatControlName(key)}</span>
                        <Badge
                          variant={impact.type === 'positive' ? 'default' : impact.type === 'negative' ? 'destructive' : 'secondary'}
                          className="text-xs px-1 py-0"
                        >
                          {impact.label}
                        </Badge>
                      </div>
                      <div className="text-xs font-mono bg-background px-2 py-1 rounded">
                        {formatControlValue(key, value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Events */}
          {data.selectedEvents.activeEvents && data.selectedEvents.activeEvents.length > 0 && (
            <div className="bg-accent/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm">Selected Events ({data.selectedEvents.activeEvents.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.selectedEvents.activeEvents.map(eventType => (
                  <Badge key={eventType} variant="outline" className="text-xs">
                    {eventType.toUpperCase()}
                  </Badge>
                ))}
              </div>
              {data.selectedEvents.eventOption && (
                <div className="mt-2 text-xs">
                  <span className="font-medium">Selection:</span> {data.selectedEvents.eventOption}
                </div>
              )}
            </div>
          )}

          {/* Simulation Parameters */}
          <div className="bg-accent/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Simulation Parameters</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="horizon" className="text-xs">Simulation Horizon (Trading Days) *</Label>
              <Input
                id="horizon"
                type="number"
                min={1}
                max={365}
                value={horizon}
                onChange={(e) => setHorizon(parseInt(e.target.value) || 30)}
                className={`text-sm ${errors.horizon && !errors.horizon.startsWith('Warning') ? "border-red-500" : ""}`}
              />
              {errors.horizon && (
                <p className={`text-xs ${errors.horizon.startsWith('Warning') ? 'text-yellow-600' : 'text-red-500'}`}>
                  {errors.horizon}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Business days to simulate (1-365). Recommended: 30-90 days.
              </p>
              <div className="flex justify-between text-xs bg-background/50 p-2 rounded">
                <span><strong>Duration:</strong> {getEstimatedDuration(horizon)}</span>
                <span><strong>Data Points:</strong> {horizon} candlesticks</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t bg-background px-6 py-4 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (!horizon || horizon < 1)}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Running Simulation...</span>
              </div>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run {horizon}-Day Simulation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}