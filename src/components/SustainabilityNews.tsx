
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, TrendingUp, Globe, Zap } from "lucide-react";

const SustainabilityNews = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const newsItems = [
    {
      id: 1,
      category: "renewable",
      title: "Solar Power Reaches Record Low Costs",
      summary: "New solar installations are now cheaper than fossil fuels in most regions worldwide.",
      source: "Clean Energy Report",
      date: "2 hours ago",
      trend: "up",
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 2,
      category: "recycling",
      title: "Ocean Plastic Recycling Breakthrough",
      summary: "Scientists develop new method to convert ocean plastic waste into valuable materials.",
      source: "Marine Research Journal",
      date: "4 hours ago",
      trend: "up",
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 3,
      category: "policy",
      title: "EU Announces Circular Economy Package",
      summary: "New regulations aim to reduce waste and promote sustainable manufacturing practices.",
      source: "Environmental Policy News",
      date: "6 hours ago",
      trend: "stable",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 4,
      category: "technology",
      title: "AI Optimizes Waste Collection Routes",
      summary: "Machine learning algorithms reduce fuel consumption by 30% in smart cities.",
      source: "Tech for Good",
      date: "8 hours ago",
      trend: "up",
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 5,
      category: "renewable",
      title: "Wind Energy Breaks Generation Records",
      summary: "Offshore wind farms generated 15% more energy than expected this quarter.",
      source: "Renewable Energy Today",
      date: "12 hours ago",
      trend: "up",
      icon: <Zap className="w-4 h-4" />
    }
  ];

  const categories = [
    { id: "all", label: "All News", color: "bg-gray-100 text-gray-700" },
    { id: "renewable", label: "Renewable Energy", color: "bg-yellow-100 text-yellow-700" },
    { id: "recycling", label: "Recycling", color: "bg-green-100 text-green-700" },
    { id: "policy", label: "Policy", color: "bg-blue-100 text-blue-700" },
    { id: "technology", label: "Technology", color: "bg-purple-100 text-purple-700" }
  ];

  const filteredNews = selectedCategory === "all" 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      default: return "➡️";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-600" />
          Sustainability News
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`text-xs ${
                selectedCategory === category.id 
                  ? "bg-green-600 text-white" 
                  : "hover:bg-green-50"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {filteredNews.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.icon}
                <Badge 
                  variant="outline" 
                  className={categories.find(c => c.id === item.category)?.color}
                >
                  {categories.find(c => c.id === item.category)?.label}
                </Badge>
                <span className="text-lg">{getTrendIcon(item.trend)}</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <ExternalLink size={14} />
              </Button>
            </div>
            
            <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
            <p className="text-gray-600 text-sm mb-2">{item.summary}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {item.date}
              </span>
              <span>{item.source}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SustainabilityNews;
