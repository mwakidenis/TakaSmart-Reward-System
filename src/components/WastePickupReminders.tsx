
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, MapPin, Truck, Calendar } from "lucide-react";

const WastePickupReminders = () => {
  const [notifications, setNotifications] = useState(true);

  const pickupSchedule = [
    {
      type: "General Waste",
      day: "Monday",
      time: "7:00 AM",
      nextPickup: "Tomorrow",
      icon: "🗑️",
      color: "bg-gray-100 text-gray-700"
    },
    {
      type: "Recycling",
      day: "Wednesday",
      time: "7:00 AM", 
      nextPickup: "In 2 days",
      icon: "♻️",
      color: "bg-green-100 text-green-700"
    },
    {
      type: "Organic Waste",
      day: "Friday",
      time: "7:00 AM",
      nextPickup: "In 4 days",
      icon: "🌱",
      color: "bg-brown-100 text-brown-700"
    }
  ];

  const optimalTimes = [
    {
      binType: "Plastic",
      currentFill: 75,
      recommendation: "Empty today",
      reason: "High fill level detected",
      urgency: "high"
    },
    {
      binType: "Paper",
      currentFill: 45,
      recommendation: "Empty in 2 days",
      reason: "Weather forecast shows rain",
      urgency: "medium"
    },
    {
      binType: "Glass",
      currentFill: 30,
      recommendation: "Empty next week",
      reason: "Low fill level",
      urgency: "low"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Pickup Schedule
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotifications(!notifications)}
              className={notifications ? "bg-blue-50" : ""}
            >
              <Bell size={16} className={notifications ? "text-blue-600" : "text-gray-400"} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pickupSchedule.map((schedule, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{schedule.icon}</span>
                <div>
                  <p className="font-medium">{schedule.type}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar size={12} />
                    {schedule.day} at {schedule.time}
                  </p>
                </div>
              </div>
              <Badge className={schedule.color} variant="outline">
                {schedule.nextPickup}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Optimal Recycling Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {optimalTimes.map((item, index) => (
            <div key={index} className={`p-3 border rounded-lg ${getUrgencyColor(item.urgency)}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{item.binType} Bin</h4>
                <Badge variant="outline" className="bg-white">
                  {item.currentFill}% full
                </Badge>
              </div>
              <p className="text-sm font-medium mb-1">{item.recommendation}</p>
              <p className="text-xs">{item.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WastePickupReminders;
