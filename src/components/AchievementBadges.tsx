
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Zap, Target, Crown, Leaf, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AchievementBadges = () => {
  const { user } = useAuth();

  // Fetch user stats for badge calculations
  const { data: userStats } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const [profileRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('total_points').eq('id', user.id).single(),
        supabase.from('recycling_sessions').select('*').eq('user_id', user.id)
      ]);
      
      const totalPoints = profileRes.data?.total_points || 0;
      const totalSessions = sessionsRes.data?.length || 0;
      const wasteTypes = new Set(sessionsRes.data?.map(s => s.waste_type)).size;
      
      // Calculate streaks (simplified)
      const recentSessions = sessionsRes.data?.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) || [];
      
      return {
        totalPoints,
        totalSessions,
        wasteTypes,
        recentSessions: recentSessions.slice(0, 7)
      };
    },
    enabled: !!user?.id
  });

  const badges = [
    {
      id: 'first_recycle',
      name: 'First Steps',
      description: 'Complete your first recycling session',
      icon: <Leaf className="w-6 h-6" />,
      unlocked: (userStats?.totalSessions || 0) >= 1,
      color: 'bg-green-100 text-green-700 border-green-300'
    },
    {
      id: 'point_collector',
      name: 'Point Collector',
      description: 'Earn 500 points',
      icon: <Star className="w-6 h-6" />,
      unlocked: (userStats?.totalPoints || 0) >= 500,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    },
    {
      id: 'eco_warrior',
      name: 'Eco Warrior',
      description: 'Recycle 20 items',
      icon: <Award className="w-6 h-6" />,
      unlocked: (userStats?.totalSessions || 0) >= 20,
      color: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    {
      id: 'variety_master',
      name: 'Variety Master',
      description: 'Recycle all 5 waste types',
      icon: <Target className="w-6 h-6" />,
      unlocked: (userStats?.wasteTypes || 0) >= 5,
      color: 'bg-purple-100 text-purple-700 border-purple-300'
    },
    {
      id: 'point_master',
      name: 'Point Master',
      description: 'Earn 2000 points',
      icon: <Zap className="w-6 h-6" />,
      unlocked: (userStats?.totalPoints || 0) >= 2000,
      color: 'bg-orange-100 text-orange-700 border-orange-300'
    },
    {
      id: 'recycling_champion',
      name: 'Recycling Champion',
      description: 'Recycle 50 items',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: (userStats?.totalSessions || 0) >= 50,
      color: 'bg-amber-100 text-amber-700 border-amber-300'
    },
    {
      id: 'sustainability_king',
      name: 'Sustainability King',
      description: 'Earn 5000 points',
      icon: <Crown className="w-6 h-6" />,
      unlocked: (userStats?.totalPoints || 0) >= 5000,
      color: 'bg-red-100 text-red-700 border-red-300'
    },
    {
      id: 'eco_legend',
      name: 'Eco Legend',
      description: 'Recycle 100 items',
      icon: <Recycle className="w-6 h-6" />,
      unlocked: (userStats?.totalSessions || 0) >= 100,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    }
  ];

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  return (
    <div className="space-y-6">
      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Earned Badges ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-lg border-2 ${badge.color} transition-all hover:scale-105`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {badge.icon}
                    <span className="font-semibold text-sm">{badge.name}</span>
                  </div>
                  <p className="text-xs opacity-80">{badge.description}</p>
                  <Badge className="mt-2 bg-green-600 text-white text-xs">
                    ✓ Unlocked
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-500" />
              Locked Badges ({lockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-lg border-2 bg-gray-100 text-gray-500 border-gray-300"
                >
                  <div className="flex items-center gap-2 mb-2 opacity-60">
                    {badge.icon}
                    <span className="font-semibold text-sm">{badge.name}</span>
                  </div>
                  <p className="text-xs opacity-60">{badge.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    🔒 Locked
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementBadges;
