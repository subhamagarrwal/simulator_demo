import { Header } from "./components/Header";
import { CandlestickChart } from "./components/CandlestickChart";
import { SimulatorControls } from "./components/SimulatorControls";
import { EconomicCalendar } from "./components/EconomicCalendar";
import { SimulationSummary } from "./components/SimulationSummary";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(100vh-80px)]">
        {/* Left Sidebar - Simulator Controls */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto">
          <SimulatorControls />
        </div>
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
          <CandlestickChart />
        </div>
        
        {/* Right Sidebar - Economic Calendar */}
        <div className="lg:col-span-1 overflow-y-auto">
          <EconomicCalendar />
        </div>
      </div>
    </div>
  );
}