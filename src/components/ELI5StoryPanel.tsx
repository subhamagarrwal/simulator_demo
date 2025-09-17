import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, BookOpen } from "lucide-react";
import { useSimulation } from "../contexts/SimulationContext";

interface SimpleStory {
  title: string;
  explanation: string;
  key_points: string[];
  analogy: string;
  prediction: string;
  market_mood: string;
}

export function ELI5StoryPanel() {
  const simulation = useSimulation();
  const [story, setStory] = useState<SimpleStory | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Simple story generator that ALWAYS works
  const generateStory = (priceChange: number, sector: string, day: number): SimpleStory => {
    const absChange = Math.abs(priceChange);
    const isUp = priceChange > 0;
    const isStrong = absChange > 2;

    console.log(`� Generating story: ${priceChange.toFixed(2)}% change, Day ${day}`);

    let title: string;
    let explanation: string;
    let analogy: string;
    let prediction: string;
    let mood: string;

    if (isStrong && isUp) {
      title = `🚀 Day ${day}: Stock is Soaring!`;
      explanation = `Wow! Our stock jumped ${absChange.toFixed(1)}% today! This is like when your favorite ice cream shop suddenly becomes the most popular place in town. Everyone wants to buy ${sector.replace('-', ' ')} stocks because they think they're going to make money!

When lots of people want to buy the same thing, the price goes up - just like concert tickets for a famous singer. Our company is probably doing something really good that makes investors excited!`;
      analogy = "It's like having the best lemonade recipe on the hottest day of summer - everyone wants what you're selling!";
      prediction = "If people stay excited about our company, the price might keep going up!";
      mood = "Super Excited! 🤩";
    } else if (isStrong && !isUp) {
      title = `📉 Day ${day}: Stock Having Trouble`;
      explanation = `Ouch! Our stock dropped ${absChange.toFixed(1)}% today. This is like when it suddenly starts raining during a beach party - people aren't as interested in buying ${sector.replace('-', ' ')} stocks right now.

Maybe some bad news came out, or people are just being more careful with their money. It's like when kids save their allowance instead of spending it on toys.`;
      analogy = "It's like trying to sell ice cream during a snowstorm - nobody wants to come outside.";
      prediction = "Stocks go down sometimes, but they often bounce back when things get better!";
      mood = "A bit worried 😟";
    } else if (isUp) {
      title = `📈 Day ${day}: Nice Steady Growth`;
      explanation = `Good news! Our stock went up ${absChange.toFixed(1)}% today. This is like climbing stairs - steady and safe progress. People are feeling okay about ${sector.replace('-', ' ')} companies, but they're not going crazy buying them.

It's like when you get a good grade on a test - not the best grade ever, but definitely something to smile about!`;
      analogy = "Like a balloon slowly floating up on a calm, sunny day.";
      prediction = "Steady growth like this is actually really good for long-term success!";
      mood = "Cautiously optimistic 😊";
    } else if (priceChange < 0) {
      title = `📊 Day ${day}: Small Stumble`;
      explanation = `Our stock went down ${absChange.toFixed(1)}% today, but it's not a big deal. Think of it like tripping while walking - you get back up and keep going. This happens all the time with ${sector.replace('-', ' ')} stocks.

Sometimes people sell their shares just to be safe, like keeping some money in a piggy bank instead of spending it all.`;
      analogy = "Like a basketball bouncing - it has to go down before it can bounce back up.";
      prediction = "Small dips like this are totally normal. Tomorrow could be completely different!";
      mood = "Not worried 🤷‍♂️";
    } else {
      title = `😐 Day ${day}: Boring Day`;
      explanation = `Nothing exciting happened with our stock today - the price stayed almost exactly the same. This is like a quiet day at school when nothing special happens.

Sometimes ${sector.replace('-', ' ')} stocks just take a break. Investors are probably waiting to see what happens next before they decide to buy or sell.`;
      analogy = "Like a lazy cat sleeping in the sunshine - just chilling and not moving much.";
      prediction = "Calm days like this often happen before something more exciting!";
      mood = "Just chilling 😴";
    }

    return {
      title,
      explanation,
      key_points: [
        `Price moved ${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}% today`,
        `This is day ${day} of our simulation`,
        `Company works in ${sector.replace('-', ' ')} industry`,
        absChange > 5 ? "This was a BIG move!" : absChange > 2 ? "Pretty noticeable change" : "Small, normal movement",
        isUp ? "Investors are buying more" : priceChange < 0 ? "Some investors are selling" : "Not much trading activity"
      ],
      analogy,
      prediction,
      market_mood: mood
    };
  };

  // Update story EVERY time price changes
  useEffect(() => {
    if (!simulation.engine) {
      console.log('⏳ Waiting for simulation to start...');
      return;
    }

    const priceChange = simulation.priceChange.percentage;
    const sector = simulation.engine.getState().companyProfile.sector;
    const day = simulation.currentDay;

    console.log(`🔄 Price changed to ${priceChange}%, updating story...`);

    // Generate new story immediately
    const newStory = generateStory(priceChange, sector, day);
    setStory(newStory);
    setLastUpdate(new Date().toLocaleTimeString());

  }, [simulation.priceChange.percentage, simulation.currentDay, simulation.engine]);

  if (!story) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Today's Market Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Start the simulation to see what's happening with your stock!</p>
        </CardContent>
      </Card>
    );
  }

  const getPriceIcon = () => {
    if (simulation.priceChange.percentage > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (simulation.priceChange.percentage < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-blue-500" />
          {story.title}
          {getPriceIcon()}
        </CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            Day {simulation.currentDay}
          </Badge>
          <Badge variant={simulation.priceChange.percentage >= 0 ? "default" : "destructive"} className="text-xs">
            {simulation.priceChange.percentage >= 0 ? '+' : ''}{simulation.priceChange.percentage.toFixed(2)}%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Updated: {lastUpdate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Explanation */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            What's Happening?
          </h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed whitespace-pre-line">
            {story.explanation}
          </p>
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Quick Facts:</h4>
          <div className="grid gap-2">
            {story.key_points.map((point, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analogy */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-3">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2 text-sm">
            Think of it this way:
          </h4>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm italic">
            {story.analogy}
          </p>
        </div>

        {/* Prediction */}
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 text-sm">
            What might happen next:
          </h4>
          <p className="text-purple-800 dark:text-purple-200 text-sm">
            {story.prediction}
          </p>
        </div>

        {/* Market Mood */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Current Mood:</span>
            <span className="font-medium">{story.market_mood}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

