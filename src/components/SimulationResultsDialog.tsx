import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  TrendingUp,
  TrendingDown, 
  BarChart3,
  Calendar,
  Target,
  Info,
  Download,
  X
} from "lucide-react";
import { OHLCData } from "../services/simulationAPI";

interface SimulationResultsDialogProps {
  open: boolean;
  onClose: () => void;
  data: OHLCData[] | null;
  isLoading: boolean;
  error: string | null;
  companyInfo?: {
    name?: string;
    ticker?: string;
    mode: string;
    horizon: number;
  };
}

export function SimulationResultsDialog({
  open,
  onClose,
  data,
  isLoading,
  error,
  companyInfo
}: SimulationResultsDialogProps) {
  const [activeTab, setActiveTab] = useState("chart");

  // Calculate summary statistics
  const getSummaryStats = () => {
    if (!data || data.length === 0) return null;

    const firstPrice = data[0].close;
    const lastPrice = data[data.length - 1].close;
    const priceChange = lastPrice - firstPrice;
    const percentChange = (priceChange / firstPrice) * 100;
    
    const prices = data.map(d => d.close);
    const highPrice = Math.max(...prices);
    const lowPrice = Math.min(...prices);
    
    const dailyReturns = data.slice(1).map((day, index) => 
      ((day.close - data[index].close) / data[index].close) * 100
    );
    
    const volatility = Math.sqrt(
      dailyReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / dailyReturns.length
    );

    return {
      startPrice: firstPrice,
      endPrice: lastPrice,
      priceChange,
      percentChange,
      highPrice,
      lowPrice,
      volatility,
      totalDays: data.length,
      positiveDays: dailyReturns.filter(r => r > 0).length,
      negativeDays: dailyReturns.filter(r => r < 0).length
    };
  };

  const stats = getSummaryStats();

  // Simple candlestick chart component (text-based for now)
  const CandlestickChart = () => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.low, d.open, d.close)));
    const minPrice = Math.min(...data.map(d => Math.min(d.high, d.low, d.open, d.close)));
    const priceRange = maxPrice - minPrice;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium mb-4">Price Movement Over Time</div>
        <div className="bg-accent/10 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
            {data.slice(-30).map((day, index) => { // Show last 30 days
              const isGreen = day.close >= day.open;
              const bodyHeight = Math.abs(day.close - day.open);
              const wickTop = day.high - Math.max(day.open, day.close);
              const wickBottom = Math.min(day.open, day.close) - day.low;
              
              return (
                <div key={index} className="flex items-center text-xs space-x-2">
                  <div className="w-16 text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-1 h-4 ${isGreen ? 'bg-green-500' : 'bg-red-500'}`} 
                         title={`O: ${day.open.toFixed(2)}, H: ${day.high.toFixed(2)}, L: ${day.low.toFixed(2)}, C: ${day.close.toFixed(2)}`}>
                    </div>
                    <span className={`font-mono ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{day.close.toFixed(2)}
                    </span>
                    <span className={`text-xs ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
                      ({isGreen ? '+' : ''}{((day.close - day.open) / day.open * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {data.length > 30 && (
            <div className="text-xs text-muted-foreground mt-2 text-center">
              Showing last 30 days of {data.length} total days
            </div>
          )}
        </div>
      </div>
    );
  };

  // Data table view
  const DataTable = () => {
    if (!data || data.length === 0) return <div>No data available</div>;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">OHLC Data</div>
        <div className="max-h-64 overflow-y-auto border rounded">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-right">Open</th>
                <th className="p-2 text-right">High</th>
                <th className="p-2 text-right">Low</th>
                <th className="p-2 text-right">Close</th>
                <th className="p-2 text-right">Change %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day, index) => {
                const change = index > 0 ? ((day.close - data[index - 1].close) / data[index - 1].close * 100) : 0;
                const isPositive = change >= 0;
                
                return (
                  <tr key={index} className="border-t">
                    <td className="p-2">{new Date(day.date).toLocaleDateString('en-GB')}</td>
                    <td className="p-2 text-right font-mono">₹{day.open.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono">₹{day.high.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono">₹{day.low.toFixed(2)}</td>
                    <td className="p-2 text-right font-mono">₹{day.close.toFixed(2)}</td>
                    <td className={`p-2 text-right font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {index > 0 ? `${isPositive ? '+' : ''}${change.toFixed(2)}%` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Simulation Results</span>
              {companyInfo && (
                <Badge variant="outline" className="ml-2">
                  {companyInfo.ticker || 'SAMPLE'} | {companyInfo.mode.toUpperCase()}
                </Badge>
              )}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-center">
                <div className="font-medium">Running Simulation...</div>
                <div className="text-sm text-muted-foreground">
                  Generating {companyInfo?.horizon || 'multiple'} days of market data
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="text-red-500">
                <Info className="h-12 w-12" />
              </div>
              <div className="text-center">
                <div className="font-medium text-red-700">Simulation Failed</div>
                <div className="text-sm text-red-600 max-w-md">{error}</div>
              </div>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && data && stats && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <div className="text-xs text-muted-foreground">Final Price</div>
                    </div>
                    <div className="text-lg font-bold">₹{stats.endPrice.toFixed(2)}</div>
                    <div className={`text-xs ${stats.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.percentChange >= 0 ? '+' : ''}{stats.percentChange.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      {stats.percentChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <div className="text-xs text-muted-foreground">Total Return</div>
                    </div>
                    <div className={`text-lg font-bold ${stats.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.percentChange >= 0 ? '+' : ''}₹{stats.priceChange.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Over {stats.totalDays} days
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                      <div className="text-xs text-muted-foreground">Volatility</div>
                    </div>
                    <div className="text-lg font-bold">{stats.volatility.toFixed(2)}%</div>
                    <div className="text-xs text-muted-foreground">Daily std dev</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-lg font-bold">
                      {((stats.positiveDays / stats.totalDays) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.positiveDays} up days
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for different views */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                  <TabsTrigger value="data">Data Table</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chart" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <CandlestickChart />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <DataTable />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    if (data) {
                      const csvContent = [
                        'Date,Open,High,Low,Close',
                        ...data.map(d => `${d.date},${d.open},${d.high},${d.low},${d.close}`)
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `simulation_results_${companyInfo?.ticker || 'sample'}_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}