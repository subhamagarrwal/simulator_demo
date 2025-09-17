import { Bell, Settings, User, Search, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSimulation } from "../contexts/SimulationContext";

export function Header() {
  const simulation = useSimulation();
  
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Fintellect</h1>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Simulator</span>
                {simulation.isRunning ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">Running</span>
                ) : simulation.engine ? (
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Ready</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Idle</span>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              className="w-64 pl-10 bg-input-background"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Market Status:</span>
            <span className="text-green-500 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Open
            </span>
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}