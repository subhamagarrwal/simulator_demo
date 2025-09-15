import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, TrendingDown, Calculator, Target, StopCircle } from "lucide-react";

export function TradingControls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Trade Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
            <TabsTrigger value="stop">Stop</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Select defaultValue="eurusd">
                  <SelectTrigger>
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eurusd">EUR/USD</SelectItem>
                    <SelectItem value="gbpusd">GBP/USD</SelectItem>
                    <SelectItem value="usdjpy">USD/JPY</SelectItem>
                    <SelectItem value="usdchf">USD/CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="volume">Volume (Lots)</Label>
                <Input
                  id="volume"
                  type="number"
                  defaultValue="1.0"
                  step="0.01"
                  min="0.01"
                  className="bg-input-background"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="sl">Stop Loss</Label>
                  <Input
                    id="sl"
                    type="number"
                    placeholder="1.0800"
                    step="0.0001"
                    className="bg-input-background"
                  />
                </div>
                <div>
                  <Label htmlFor="tp">Take Profit</Label>
                  <Input
                    id="tp"
                    type="number"
                    placeholder="1.0900"
                    step="0.0001"
                    className="bg-input-background"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  BUY 1.0847
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  SELL 1.0845
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="limit" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="limit-price">Limit Price</Label>
                <Input
                  id="limit-price"
                  type="number"
                  placeholder="1.0820"
                  step="0.0001"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <Label htmlFor="limit-volume">Volume (Lots)</Label>
                <Input
                  id="limit-volume"
                  type="number"
                  defaultValue="1.0"
                  step="0.01"
                  min="0.01"
                  className="bg-input-background"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Buy Limit
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Sell Limit
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stop" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="stop-price">Stop Price</Label>
                <Input
                  id="stop-price"
                  type="number"
                  placeholder="1.0870"
                  step="0.0001"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <Label htmlFor="stop-volume">Volume (Lots)</Label>
                <Input
                  id="stop-volume"
                  type="number"
                  defaultValue="1.0"
                  step="0.01"
                  min="0.01"
                  className="bg-input-background"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  <StopCircle className="h-4 w-4 mr-2" />
                  Buy Stop
                </Button>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  <StopCircle className="h-4 w-4 mr-2" />
                  Sell Stop
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Spread:</span>
              <span>0.2 pips</span>
            </div>
            <div className="flex justify-between">
              <span>Margin Required:</span>
              <span>$541.75</span>
            </div>
            <div className="flex justify-between">
              <span>Pip Value:</span>
              <span>$10.00</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}