
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Leaderboard = () => {
  const { user } = useAuth();

  // Fetch top users by points
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, total_points')
        .order('total_points', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data.map((profile, index) => ({
        ...profile,
        rank: index + 1
      }));
    }
  });

  // Find current user's rank
  const userRank = leaderboard.find(entry => entry.id === user?.id)?.rank;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Trophy className="text-gray-400" size={20} />;
      case 3:
        return <Medal className="text-amber-600" size={20} />;
      default:
        return <Award className="text-gray-300" size={16} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current User Position (if not in top 10) */}
      {userRank && userRank > 10 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(userRank)}`}>
                  #{userRank}
                </div>
                <div>
                  <p className="font-medium">Your Position</p>
                  <p className="text-sm text-gray-600">Keep recycling to climb higher!</p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                {leaderboard.find(entry => entry.id === user?.id)?.total_points || 0} pts
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Users */}
      {leaderboard.slice(0, 10).map((entry) => (
        <Card 
          key={entry.id} 
          className={`shadow-sm transition-all hover:shadow-md ${
            entry.id === user?.id ? 'border-green-200 bg-green-50' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(entry.rank)}`}>
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : `#${entry.rank}`}
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {getInitials(entry.full_name || 'User')}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium">
                    {entry.full_name || 'Anonymous User'}
                    {entry.id === user?.id && (
                      <span className="text-green-600 text-sm ml-2">(You)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Rank #{entry.rank}
                    </span>
                    {entry.rank <= 3 && (
                      <Badge variant="outline" className={
                        entry.rank === 1 ? "border-yellow-400 text-yellow-600" :
                        entry.rank === 2 ? "border-gray-400 text-gray-600" :
                        "border-amber-400 text-amber-600"
                      }>
                        {entry.rank === 1 ? "Champion" : 
                         entry.rank === 2 ? "Runner-up" : "3rd Place"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {entry.total_points?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {leaderboard.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Trophy className="mx-auto mb-4 text-gray-300" size={48} />
            <p>No users on the leaderboard yet.</p>
            <p className="text-sm">Be the first to start recycling and earn points!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
