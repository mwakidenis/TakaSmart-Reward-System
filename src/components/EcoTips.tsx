
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, Leaf, Recycle, TreePine, Droplets } from "lucide-react";

const EcoTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const ecoTips = [
    {
      category: "Recycling",
      icon: <Recycle className="w-5 h-5" />,
      title: "Clean Before You Recycle",
      tip: "Always rinse containers before recycling. Food residue can contaminate entire batches of recyclables!",
      impact: "Increases recycling efficiency by 40%",
      color: "bg-green-100 text-green-700"
    },
    {
      category: "Energy",
      icon: <Lightbulb className="w-5 h-5" />,
      title: "LED Light Switch",
      tip: "Replace incandescent bulbs with LED lights. They use 75% less energy and last 25 times longer.",
      impact: "Save $75/year on electricity bills",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      category: "Water",
      icon: <Droplets className="w-5 h-5" />,
      title: "Smart Water Usage",
      tip: "Turn off the tap while brushing teeth. You can save up to 8 gallons of water per day!",
      impact: "Save 2,920 gallons annually",
      color: "bg-blue-100 text-blue-700"
    },
    {
      category: "Waste",
      icon: <TreePine className="w-5 h-5" />,
      title: "Composting Magic",
      tip: "Start composting kitchen scraps. 30% of household waste can be composted instead of thrown away.",
      impact: "Reduce household waste by 30%",
      color: "bg-brown-100 text-brown-700"
    },
    {
      category: "Recycling",
      icon: <Recycle className="w-5 h-5" />,
      title: "Plastic Number Know-How",
      tip: "Learn plastic recycling numbers! Types 1, 2, and 5 are most commonly recycled.",
      impact: "Improve recycling accuracy",
      color: "bg-green-100 text-green-700"
    },
    {
      category: "Energy",
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Unplug Electronics",
      tip: "Electronics in standby mode still consume power. Unplug devices when not in use.",
      impact: "Reduce energy consumption by 10%",
      color: "bg-yellow-100 text-yellow-700"
    },
    {
      category: "Reuse",
      icon: <Leaf className="w-5 h-5" />,
      title: "Glass Jar Second Life",
      tip: "Reuse glass jars for food storage, organization, or planters. They're endlessly reusable!",
      impact: "Extend product lifecycle 10x",
      color: "bg-purple-100 text-purple-700"
    },
    {
      category: "Water",
      icon: <Droplets className="w-5 h-5" />,
      title: "Collect Rainwater",
      tip: "Set up a rain barrel to collect water for your garden. It's free and reduces runoff pollution.",
      impact: "Save 1,300 gallons during rainy season",
      color: "bg-blue-100 text-blue-700"
    }
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % ecoTips.length);
  };

  // Auto-rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(nextTip, 10000);
    return () => clearInterval(interval);
  }, []);

  const tip = ecoTips[currentTip];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Daily Eco Tip
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextTip}
            className="text-green-600 hover:text-green-700"
          >
            <RefreshCw size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={tip.color} variant="outline">
            {tip.icon}
            {tip.category}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
          <p className="text-gray-700 mb-3">{tip.tip}</p>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-green-600 text-white">💚 Impact</Badge>
            <span className="text-gray-600">{tip.impact}</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Tip {currentTip + 1} of {ecoTips.length}</span>
          <span>Next tip in 10s</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcoTips;
