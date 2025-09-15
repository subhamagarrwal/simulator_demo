import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

export function EconomicCalendar() {
  const marketSentiment = {
    overall: "Bullish",
    vix: 18.2
  };

  const simulationEvents = [
    {
      time: "09:30",
      event: "Market opened with strong bullish sentiment",
      impact: "positive",
      explanation: "Think of the market like a big store opening - everyone was excited to buy, which pushed prices up! 📈",
      priceChange: "+2.3%"
    },
    {
      time: "11:15", 
      event: "Your IT company announced earnings beat",
      impact: "very-positive",
      explanation: "Your company made more money than expected - like getting an A+ on a test when you thought you'd get a B! 🎉",
      priceChange: "+5.8%"
    },
    {
      time: "14:30",
      event: "US inflation data came in higher than expected",
      impact: "negative", 
      explanation: "Prices of everyday things went up more than people thought they would - this makes investors nervous like when your favorite candy gets more expensive 😟",
      priceChange: "-1.2%"
    },
    {
      time: "16:45",
      event: "Heavy institutional buying detected",
      impact: "positive",
      explanation: "Big investment companies started buying lots of stocks - imagine if all the popular kids at school suddenly wanted the same toy! 🚀",
      priceChange: "+3.1%"
    }
  ];

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "very-positive":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "very-negative":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "very-positive":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "positive":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "negative":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "very-negative":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Market Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Market Sentiment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Overall Market</span>
            <Badge variant="secondary" className="text-green-500 bg-green-500/10">
              {marketSentiment.overall}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VIX Index</span>
            <span className="font-medium">{marketSentiment.vix}</span>
          </div>
        </CardContent>
      </Card>



      {/* Today's Story */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Today's Story</span>
            <Badge className="ml-auto bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
              ELI5 📚
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {simulationEvents.map((event, index) => (
              <div key={index} className="relative">
                {/* Timeline line */}
                {index < simulationEvents.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-8 bg-border"></div>
                )}
                
                <div className="flex space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getImpactIcon(event.impact)}
                  </div>
                  
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{event.time}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(event.impact)}`}
                      >
                        {event.priceChange}
                      </Badge>
                    </div>
                    
                    <div className="text-sm font-medium text-foreground">
                      {event.event}
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-accent/20 p-2 rounded italic">
                      💡 {event.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}