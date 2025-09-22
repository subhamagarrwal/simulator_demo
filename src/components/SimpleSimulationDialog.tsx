import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, Play } from "lucide-react";

interface SimpleSimulationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (horizon: number) => void;
  isLoading?: boolean;
}

export function SimpleSimulationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: SimpleSimulationDialogProps) {
  const [horizon, setHorizon] = useState<number | ''>(30);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const horizonNum = typeof horizon === 'number' ? horizon : parseInt(horizon as string);
    
    if (!horizon || isNaN(horizonNum) || horizonNum < 1 || horizonNum > 365) {
      newErrors.horizon = 'Horizon must be between 1 and 365 days';
    }
    
    if (horizonNum > 90) {
      newErrors.horizon = 'Warning: Simulations over 90 days may take longer to process';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).filter(key => !newErrors[key].startsWith('Warning')).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      const horizonNum = typeof horizon === 'number' ? horizon : parseInt(horizon as string);
      onConfirm(horizonNum);
    }
  };

  const getEstimatedDuration = (horizon: number): string => {
    if (horizon <= 30) return "< 30 seconds";
    if (horizon <= 90) return "30-60 seconds";
    return "1-2 minutes";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[400px] max-w-[90vw] p-0 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Run Simulation</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="horizon" className="text-sm font-medium">
              Simulation Horizon (Trading Days) *
            </Label>
            <Input
              id="horizon"
              type="number"
              min={1}
              max={365}
              value={horizon}
              onChange={(e) => {
                const val = e.target.value;
                setHorizon(val === '' ? '' : parseInt(val));
              }}
              className={`text-sm ${errors.horizon && !errors.horizon.startsWith('Warning') ? "border-red-500" : ""}`}
              placeholder="Enter number of days (1-365)"
            />
            {errors.horizon && (
              <p className={`text-xs ${errors.horizon.startsWith('Warning') ? 'text-yellow-600' : 'text-red-500'}`}>
                {errors.horizon}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Business days to simulate. Recommended: 30-90 days for optimal performance.
            </p>
          </div>

          <div className="bg-accent/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Estimated Duration:</span>
                <p className="font-medium">{getEstimatedDuration(typeof horizon === 'number' ? horizon : parseInt(horizon as string) || 1)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Data Points:</span>
                <p className="font-medium">{typeof horizon === 'number' ? horizon : parseInt(horizon as string) || 1} candlesticks</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-background px-6 py-4 gap-3">
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
            disabled={isLoading || (!horizon || (typeof horizon === 'number' ? horizon : parseInt(horizon as string) || 0) < 1)}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Running...</span>
              </div>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run {typeof horizon === 'number' ? horizon : parseInt(horizon as string) || 1}-Day Simulation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}