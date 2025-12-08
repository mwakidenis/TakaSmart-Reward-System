
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Target, Trophy, Users, Calendar, MapPin, Star, Award, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const CommunityChallenge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch active challenges
  const { data: challenges = [] } = useQuery({
    queryKey: ['community-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_challenges')
        .select(`
          *,
          participants:challenge_participants(
            id,
            points_contributed,
            profile:profiles(id, full_name, total_points)
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user's participation
  const { data: userParticipation = [] } = useQuery({
    queryKey: ['user-challenges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Join challenge
  const joinChallenge = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          points_contributed: 0
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Joined challenge successfully!');
      queryClient.invalidateQueries({ queryKey: ['community-challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenges'] });
    }
  });

  const calculateProgress = (challenge: any) => {
    const totalPoints = challenge.participants?.reduce((sum: number, p: any) => 
      sum + (p.points_contributed || 0), 0) || 0;
    return Math.min((totalPoints / challenge.goal_points) * 100, 100);
  };

  const isUserParticipating = (challengeId: string) => {
    return userParticipation.some(p => p.challenge_id === challengeId);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'city': return <MapPin className="w-5 h-5" />;
      case 'neighborhood': return <Users className="w-5 h-5" />;
      case 'weekly': return <Calendar className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'city': return 'from-blue-500 to-purple-500';
      case 'neighborhood': return 'from-green-500 to-blue-500';
      case 'weekly': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Community Challenges</h2>
        <p className="text-gray-600">Join forces with your community to achieve amazing goals!</p>
      </div>

      <div className="grid gap-6">
        {challenges.map((challenge: any) => {
          const progress = calculateProgress(challenge);
          const isParticipating = isUserParticipating(challenge.id);
          const daysLeft = Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
          
          return (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getChallengeColor(challenge.type)} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <p className="opacity-90">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/20 text-white mb-2">
                      {challenge.participants?.length || 0} participants
                    </Badge>
                    <div className="text-sm opacity-90">
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-sm text-gray-600">
                        {progress.toFixed(1)}% Complete
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>
                        {challenge.participants?.reduce((sum: number, p: any) => sum + (p.points_contributed || 0), 0).toLocaleString()} points
                      </span>
                      <span>Goal: {challenge.goal_points.toLocaleString()} points</span>
                    </div>
                  </div>

                  {/* Rewards */}
                  {challenge.rewards && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-700 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="font-medium">Rewards</span>
                      </div>
                      <p className="text-sm text-yellow-600">{challenge.rewards}</p>
                    </div>
                  )}

                  {/* Top Contributors */}
                  {challenge.participants && challenge.participants.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Top Contributors</h4>
                      <div className="space-y-2">
                        {challenge.participants
                          .sort((a: any, b: any) => (b.points_contributed || 0) - (a.points_contributed || 0))
                          .slice(0, 3)
                          .map((participant: any, index: number) => (
                            <div key={participant.id} className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                                {index === 1 && <Award className="w-4 h-4 text-gray-400" />}
                                {index === 2 && <Star className="w-4 h-4 text-orange-500" />}
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                                    {getInitials(participant.profile?.full_name || 'U')}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{participant.profile?.full_name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-600">{participant.points_contributed || 0} points contributed</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {isParticipating ? (
                      <Badge className="bg-green-100 text-green-700">
                        <Zap className="w-4 h-4 mr-1" />
                        Participating
                      </Badge>
                    ) : daysLeft > 0 ? (
                      <Button 
                        onClick={() => joinChallenge.mutate(challenge.id)}
                        disabled={joinChallenge.isPending}
                        className="w-full"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Join Challenge
                      </Button>
                    ) : (
                      <Badge variant="outline">Challenge Ended</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {challenges.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Target className="mx-auto mb-4 text-gray-300" size={48} />
            <p>No active challenges at the moment</p>
            <p className="text-sm">Check back later for new community challenges!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityChallenge;
