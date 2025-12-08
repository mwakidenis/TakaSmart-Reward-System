
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { 
  Recycle, 
  Trophy, 
  MapPin, 
  QrCode, 
  TrendingUp, 
  Calendar,
  Leaf,
  Globe,
  Route,
  Cloud,
  Crown
} from "lucide-react";
import EcoTips from "@/components/EcoTips";
import SustainabilityNews from "@/components/SustainabilityNews";
import WastePickupReminders from "@/components/WastePickupReminders";
import RouteOptimization from "@/components/RouteOptimization";
import WeatherIntegration from "@/components/WeatherIntegration";
import ImpactCalculator from "@/components/ImpactCalculator";
import Leaderboard from "@/components/Leaderboard";

interface Profile {
  id: string;
  total_points: number;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  email: string | null;
}

interface RecyclingSession {
  id: string;
  user_id: string;
  bin_id: string;
  waste_type: string;
  points_earned: number;
  verified: boolean;
  created_at: string;
  photo_url: string | null;
}

const Index = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: recyclingSessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['recyclingSessions'],
    queryFn: async (): Promise<RecyclingSession[]> => {
      const { data, error } = await supabase
        .from('recycling_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching recycling sessions:", error);
        throw new Error(error.message);
      }
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Get user's leaderboard position
  const { data: userRank } = useQuery({
    queryKey: ['user-rank', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, total_points')
        .order('total_points', { ascending: false });

      if (error) throw error;
      
      const userIndex = data.findIndex(p => p.id === user.id);
      return userIndex !== -1 ? userIndex + 1 : null;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="opacity-90">Ready to make a positive impact today?</p>
        {userRank && (
          <div className="flex items-center gap-2 mt-2">
            <Crown className="w-4 h-4" />
            <span className="text-sm">You're ranked #{userRank} on the leaderboard!</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">Rankings</TabsTrigger>
            <TabsTrigger value="eco-tips" className="text-xs">Eco Tips</TabsTrigger>
            <TabsTrigger value="smart" className="text-xs">Smart</TabsTrigger>
            <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{profile?.total_points || 0}</div>
                  <p className="text-gray-500 text-sm">Earned through recycling</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Recycling Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{recyclingSessions?.length || 0}</div>
                  <p className="text-gray-500 text-sm">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Leaderboard Rank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">#{userRank || '--'}</div>
                  <p className="text-gray-500 text-sm">Among all users</p>
                </CardContent>
              </Card>
            </div>

            {/* Add Impact Calculator */}
            <ImpactCalculator />

            {/* Quick Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Recyclers
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const tabTrigger = document.querySelector('[value="leaderboard"]') as HTMLElement;
                      tabTrigger?.click();
                    }}
                  >
                    View Full Rankings
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Leaderboard limit={5} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <p>Loading recycling sessions...</p>
                ) : sessionsError ? (
                  <p>Error: {sessionsError.message}</p>
                ) : (
                  <ul className="list-none space-y-2">
                    {recyclingSessions?.map((session) => (
                      <li key={session.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Recycle className="w-4 h-4 text-green-500" />
                          <span>Recycled {session.waste_type}</span>
                        </div>
                        <span className="text-sm text-gray-500">+{session.points_earned} points</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            {/* Add EcoTips to overview */}
            <EcoTips />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🏆 Leaderboard</h2>
              <p className="text-gray-600">See how you stack up against other eco-warriors!</p>
              {userRank && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Your Rank: #{userRank}
                </Badge>
              )}
            </div>
            <Leaderboard />
          </TabsContent>

          <TabsContent value="eco-tips" className="space-y-6">
            <EcoTips />
            <WeatherIntegration />
          </TabsContent>

          <TabsContent value="smart" className="space-y-6">
            <WastePickupReminders />
            <RouteOptimization />
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <SustainabilityNews />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
