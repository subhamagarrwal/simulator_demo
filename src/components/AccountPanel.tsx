import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

export function AccountPanel() {
  const accountData = {
    balance: 125420.50,
    equity: 127834.25,
    unrealizedPL: 2413.75,
    realizedPL: 1847.30,
    margin: 15420.00,
    freeMargin: 112414.25,
    marginLevel: 829.2
  };

  const openPositions = [
    { pair: "EUR/USD", type: "BUY", lots: 1.5, openPrice: 1.0824, currentPrice: 1.0847, pl: 345.00 },
    { pair: "GBP/USD", type: "SELL", lots: 1.0, openPrice: 1.2654, currentPrice: 1.2631, pl: 230.00 },
    { pair: "USD/JPY", type: "BUY", lots: 2.0, openPrice: 149.85, currentPrice: 150.12, pl: 540.00 },
  ];

  return (
    <div className="space-y-4">
      {/* Account Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Account Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Balance</span>
            <span className="font-medium">${accountData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Equity</span>
            <span className="font-medium">${accountData.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Free Margin</span>
            <span className="font-medium">${accountData.freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin Level</span>
            <span className="font-medium text-green-500">{accountData.marginLevel}%</span>
          </div>
        </CardContent>
      </Card>

      {/* P&L Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>P&L Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Unrealized P&L</span>
            <span className="font-medium text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +${accountData.unrealizedPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Realized P&L</span>
            <span className="font-medium text-green-500 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +${accountData.realizedPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total P&L</span>
            <span className="font-medium text-green-500">
              +${(accountData.unrealizedPL + accountData.realizedPL).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Open Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Open Positions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {openPositions.map((position, index) => (
              <div key={index} className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{position.pair}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.type} {position.lots} lots
                    </div>
                  </div>
                  <div className={`font-medium ${position.pl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {position.pl > 0 ? '+' : ''}${position.pl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Open: {position.openPrice}</span>
                  <span>Current: {position.currentPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}