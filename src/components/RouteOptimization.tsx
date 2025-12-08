
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Clock, Fuel, Route } from "lucide-react";

const RouteOptimization = () => {
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const nearbyBins = [
    { id: 1, name: "Downtown Plaza", distance: "0.3 mi", fillLevel: 85, type: "Mixed" },
    { id: 2, name: "Central Park", distance: "0.5 mi", fillLevel: 60, type: "Recycling" },
    { id: 3, name: "Mall Entrance", distance: "0.8 mi", fillLevel: 90, type: "General" },
    { id: 4, name: "School Gate", distance: "1.2 mi", fillLevel: 45, type: "Organic" },
    { id: 5, name: "Community Center", distance: "1.5 mi", fillLevel: 70, type: "Mixed" }
  ];

  const optimizeRoute = () => {
    setIsOptimizing(true);
    
    // Simulate route optimization
    setTimeout(() => {
      const route = {
        totalDistance: "2.8 mi",
        estimatedTime: "12 min",
        fuelSaved: "0.3 gal",
        co2Reduced: "2.8 lbs",
        stops: [
          { bin: "Mall Entrance", order: 1, reason: "Highest fill level (90%)" },
          { bin: "Downtown Plaza", order: 2, reason: "Closest to Mall (0.4 mi)" },
          { bin: "Community Center", order: 3, reason: "High priority area" },
          { bin: "Central Park", order: 4, reason: "On route back" }
        ]
      };
      setOptimizedRoute(route);
      setIsOptimizing(false);
    }, 2000);
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 80) return "bg-red-100 text-red-700";
    if (level >= 60) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-purple-600" />
            Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <MapPin size={16} />
                <span className="text-sm font-medium">Available Bins</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{nearbyBins.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Fuel size={16} />
                <span className="text-sm font-medium">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold text-green-800">30%</p>
            </div>
          </div>

          <Button 
            onClick={optimizeRoute} 
            disabled={isOptimizing}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isOptimizing ? "Optimizing Route..." : "Optimize My Route"}
          </Button>
        </CardContent>
      </Card>

      {optimizedRoute && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-700">Optimized Route Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <p className="text-sm text-purple-600">Total Time</p>
                <p className="font-bold">{optimizedRoute.estimatedTime}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Fuel className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-sm text-green-600">Fuel Saved</p>
                <p className="font-bold">{optimizedRoute.fuelSaved}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recommended Route Order:</h4>
              <div className="space-y-2">
                {optimizedRoute.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded">
                    <Badge className="bg-purple-100 text-purple-700">
                      {stop.order}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{stop.bin}</p>
                      <p className="text-xs text-gray-600">{stop.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                🌱 Environmental Impact: Save {optimizedRoute.co2Reduced} CO₂ emissions
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Nearby Bins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nearbyBins.map((bin) => (
              <div key={bin.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{bin.name}</p>
                  <p className="text-sm text-gray-600">{bin.distance} • {bin.type}</p>
                </div>
                <Badge className={getFillLevelColor(bin.fillLevel)} variant="outline">
                  {bin.fillLevel}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteOptimization;
