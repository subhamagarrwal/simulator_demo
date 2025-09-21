import { Header } from "./components/Header";
import { CandlestickChart } from "./components/CandlestickChart";
import { SimulatorControls } from "./components/SimulatorControls";
import { EconomicCalendar } from "./components/EconomicCalendar";
import { SimulationSummary } from "./components/SimulationSummary";
import { ELI5StoryPanel } from "./components/ELI5StoryPanel";
import { SimulationProvider } from "./contexts/SimulationContext";

export default function App() {
  return (
    <SimulationProvider>
      <div className="h-screen bg-background text-foreground dark overflow-hidden">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(100vh-80px)]">
          {/* Left Sidebar - Simulator Controls */}
          <div className="lg:col-span-1 space-y-6 overflow-y-auto">
            <SimulatorControls />
          </div>
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 overflow-hidden">
            <CandlestickChart />
          </div>
          
          {/* Right Sidebar - ELI5 Story */}
          <div className="lg:col-span-1 overflow-y-auto">
            <ELI5StoryPanel />
          </div>
        </div>
      </div>
    </SimulationProvider>
  );
}