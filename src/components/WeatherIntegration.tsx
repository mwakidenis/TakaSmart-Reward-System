
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Eye } from "lucide-react";

const WeatherIntegration = () => {
  const [weather, setWeather] = useState({
    current: {
      temperature: 72,
      condition: "partly-cloudy",
      humidity: 65,
      windSpeed: 8,
      visibility: "Good"
    },
    forecast: [
      { day: "Today", condition: "partly-cloudy", high: 75, low: 65, rain: 10 },
      { day: "Tomorrow", condition: "rainy", high: 68, low: 58, rain: 80 },
      { day: "Wednesday", condition: "sunny", high: 78, low: 68, rain: 0 }
    ]
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny": return <Sun className="w-5 h-5 text-yellow-500" />;
      case "rainy": return <CloudRain className="w-5 h-5 text-blue-500" />;
      case "partly-cloudy": return <Cloud className="w-5 h-5 text-gray-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getWeatherTips = () => {
    const condition = weather.current.condition;
    const humidity = weather.current.humidity;
    const windSpeed = weather.current.windSpeed;

    const tips = [];

    if (condition === "rainy" || humidity > 70) {
      tips.push({
        icon: "☔",
        title: "Protect Paper Materials",
        tip: "Cover cardboard and paper recycling to prevent contamination",
        priority: "high"
      });
    }

    if (windSpeed > 10) {
      tips.push({
        icon: "💨",
        title: "Secure Light Materials",
        tip: "Use weights or covers for plastic bags and lightweight items",
        priority: "medium"
      });
    }

    if (condition === "sunny" && weather.current.temperature > 75) {
      tips.push({
        icon: "🌞",
        title: "Early Morning Collection",
        tip: "Empty bins early to prevent odors in hot weather",
        priority: "medium"
      });
    }

    if (condition === "partly-cloudy") {
      tips.push({
        icon: "⭐",
        title: "Perfect Recycling Day",
        tip: "Great conditions for all types of recycling activities",
        priority: "low"
      });
    }

    return tips;
  };

  const getTipColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-700";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default: return "bg-green-50 border-green-200 text-green-700";
    }
  };

  const weatherTips = getWeatherTips();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getWeatherIcon(weather.current.condition)}
            Weather Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{weather.current.temperature}°F</div>
              <div className="text-sm text-gray-600 capitalize">
                {weather.current.condition.replace('-', ' ')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Wind size={14} />
                <span>{weather.current.windSpeed} mph</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye size={14} />
                <span>{weather.current.humidity}% humidity</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">3-Day Forecast</h4>
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.condition)}
                  <span className="font-medium">{day.day}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span>{day.high}°/{day.low}°</span>
                  <Badge variant="outline" className="text-xs">
                    {day.rain}% rain
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            Weather-Based Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weatherTips.map((tip, index) => (
            <div key={index} className={`p-3 border rounded-lg ${getTipColor(tip.priority)}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{tip.icon}</span>
                <div>
                  <h4 className="font-medium mb-1">{tip.title}</h4>
                  <p className="text-sm">{tip.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherIntegration;
