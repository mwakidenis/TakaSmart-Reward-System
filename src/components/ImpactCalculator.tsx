
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, TreePine, Droplets, Zap, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ImpactCalculator = () => {
  const { user } = useAuth();

  // Fetch user recycling sessions for impact calculation
  const { data: sessions = [] } = useQuery({
    queryKey: ['user-impact', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('recycling_sessions')
        .select('waste_type, points_earned')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Calculate environmental impact based on waste types
  const calculateImpact = () => {
    const impactFactors = {
      plastic: { co2: 0.5, water: 2.1, energy: 0.8 }, // kg CO2, liters water, kWh energy saved per item
      paper: { co2: 0.3, water: 1.5, energy: 0.4 },
      metal: { co2: 1.2, water: 0.8, energy: 1.5 },
      glass: { co2: 0.2, water: 0.5, energy: 0.3 },
      organic: { co2: 0.1, water: 0.3, energy: 0.1 }
    };

    let totalCO2 = 0;
    let totalWater = 0;
    let totalEnergy = 0;

    const wasteCounts: Record<string, number> = {};
    
    sessions.forEach(session => {
      const wasteType = session.waste_type;
      wasteCounts[wasteType] = (wasteCounts[wasteType] || 0) + 1;
      
      if (impactFactors[wasteType as keyof typeof impactFactors]) {
        const factors = impactFactors[wasteType as keyof typeof impactFactors];
        totalCO2 += factors.co2;
        totalWater += factors.water;
        totalEnergy += factors.energy;
      }
    });

    return {
      co2Saved: totalCO2,
      waterSaved: totalWater,
      energySaved: totalEnergy,
      totalItems: sessions.length,
      wasteCounts,
      treesEquivalent: Math.floor(totalCO2 / 21.8) // Average CO2 absorbed by a tree per year
    };
  };

  const impact = calculateImpact();

  const impactMetrics = [
    {
      icon: <Globe className="w-6 h-6 text-green-600" />,
      title: "CO₂ Prevented",
      value: `${impact.co2Saved.toFixed(1)} kg`,
      description: "Carbon emissions prevented",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Droplets className="w-6 h-6 text-blue-600" />,
      title: "Water Conserved",
      value: `${impact.waterSaved.toFixed(1)} L`,
      description: "Water resources saved",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Energy Saved",
      value: `${impact.energySaved.toFixed(1)} kWh`,
      description: "Energy consumption reduced",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <TreePine className="w-6 h-6 text-emerald-600" />,
      title: "Trees Equivalent",
      value: `${impact.treesEquivalent}`,
      description: "Trees worth of CO₂ absorption",
      color: "bg-emerald-50 border-emerald-200"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Leaf className="w-6 h-6" />
            Your Environmental Impact
          </CardTitle>
          <p className="text-sm text-gray-600">
            See the positive impact of your recycling efforts on the environment
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {impactMetrics.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${metric.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {metric.icon}
                  <span className="font-semibold text-sm">{metric.title}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.description}</div>
              </div>
            ))}
          </div>

          {/* Waste Type Breakdown */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3 text-gray-700">Recycling Breakdown</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(impact.wasteCounts).map(([type, count]) => (
                <Badge key={type} variant="outline" className="capitalize">
                  {type}: {count as number} items
                </Badge>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-semibold mb-2 text-gray-700">🌍 Impact Facts</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• You've recycled {impact.totalItems} items total</p>
              <p>• That's equivalent to planting {impact.treesEquivalent} trees for a year</p>
              <p>• You've saved enough energy to power a home for {(impact.energySaved / 30).toFixed(1)} days</p>
              <p>• The water you've saved could fill {Math.floor(impact.waterSaved / 500)} bathtubs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactCalculator;
