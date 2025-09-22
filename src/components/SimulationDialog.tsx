import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Play } from "lucide-react";

interface SimulationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (horizon: number) => void;
  isLoading?: boolean;
}

export function SimulationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: SimulationDialogProps) {
  const [horizon, setHorizon] = useState<number>(30);
  const [error, setError] = useState<string>("");

  // Debug logging when dialog opens
  if (open) {
    console.log('🚀 SimulationDialog opened with:', { horizon, isLoading, error });
  }

  const validateHorizon = (value: number): boolean => {
    if (value < 1) {
      setError("Must be at least 1 day");
      return false;
    }
    if (value > 365) {
      setError("Cannot exceed 365 days");
      return false;
    }
    if (value > 90) {
      setError("Warning: Simulations over 90 days may take longer");
    } else {
      setError("");
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('📝 Input changed to:', inputValue);
    
    // Handle empty input properly
    if (inputValue === '') {
      setHorizon(0);  // Set to 0 instead of NaN
      setError("Must be at least 1 day");
      return;
    }
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setHorizon(0);
      setError("Please enter a valid number");
      return;
    }
    
    setHorizon(value);
    validateHorizon(value);
    console.log('✅ Horizon set to:', value);
  };

  const handleConfirm = () => {
    if (validateHorizon(horizon) && horizon >= 1) {
      console.log(`🚀 Preparing to run simulation with ${horizon} trading days...`);
      console.log('📊 Full simulation parameters will be displayed below:');
      onConfirm(horizon);
    }
  };

  const getEstimatedDuration = (): string => {
    if (horizon <= 30) return "< 30 seconds";
    if (horizon <= 90) return "30-60 seconds";
    return "1-2 minutes";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[450px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Run Market Simulation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="horizon">Trading Days to Simulate</Label>
            <Input
              id="horizon"
              type="number"
              min={1}
              max={365}
              value={horizon === 0 ? "" : horizon}
              onChange={handleInputChange}
              placeholder="Enter days (1-365)"
              className={error && !error.startsWith('Warning') ? "border-red-500" : ""}
              autoFocus
            />
            {error && (
              <p className={`text-xs ${error.startsWith('Warning') ? 'text-yellow-600' : 'text-red-500'}`}>
                {error}
              </p>
            )}
          </div>

          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Time:</span>
              <span className="font-medium">{getEstimatedDuration()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data Points:</span>
              <span className="font-medium">{horizon} candlesticks</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t pt-2 mt-2">
              <span className="text-muted-foreground">Debug Output:</span>
              <span className="font-medium text-blue-600">Console JSON ✓</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end space-x-2 pt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              console.log('🎯 Run Simulation button clicked in dialog!');
              console.log('Current horizon value:', horizon);
              handleConfirm();
            }} 
            disabled={isLoading || horizon < 1}
            className="min-w-[140px]"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}