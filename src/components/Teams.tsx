
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Trophy, Target, Calendar, Crown, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Teams = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    goal_points: 1000
  });

  // Fetch user's teams
  const { data: teams = [] } = useQuery({
    queryKey: ['teams', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          team:teams(
            *,
            members:team_members(
              id,
              role,
              profile:profiles(id, full_name, total_points)
            )
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(tm => tm.team) || [];
    },
    enabled: !!user?.id
  });

  // Fetch available teams to join
  const { data: availableTeams = [] } = useQuery({
    queryKey: ['available-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(count)
        `)
        .eq('is_public', true)
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create team
  const createTeam = useMutation({
    mutationFn: async (teamData: typeof teamForm) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          description: teamData.description,
          goal_points: teamData.goal_points,
          created_by: user.id
        })
        .select()
        .single();
      
      if (teamError) throw teamError;
      
      // Add creator as admin
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'admin'
        });
      
      if (memberError) throw memberError;
      return team;
    },
    onSuccess: () => {
      toast.success('Team created successfully!');
      setIsCreateDialogOpen(false);
      setTeamForm({ name: '', description: '', goal_points: 1000 });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    }
  });

  // Join team
  const joinTeam = useMutation({
    mutationFn: async (teamId: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'member'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Joined team successfully!');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['available-teams'] });
    }
  });

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T';
  };

  const calculateTeamProgress = (team: any) => {
    const totalPoints = team.members?.reduce((sum: number, member: any) => 
      sum + (member.profile?.total_points || 0), 0) || 0;
    return Math.min((totalPoints / team.goal_points) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Teams</h2>
          <p className="text-gray-600">Compete together and achieve more</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Team name"
                value={teamForm.name}
                onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
              />
              <Textarea
                placeholder="Team description"
                value={teamForm.description}
                onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Goal points"
                value={teamForm.goal_points}
                onChange={(e) => setTeamForm({...teamForm, goal_points: Number(e.target.value)})}
              />
              <Button 
                onClick={() => createTeam.mutate(teamForm)}
                disabled={!teamForm.name || createTeam.isPending}
                className="w-full"
              >
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User's Teams */}
      <div className="grid gap-4">
        {teams.map((team: any) => (
          <Card key={team.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{team.name}</CardTitle>
                    <p className="opacity-90">{team.description}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white">
                  {team.members?.length || 0} members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Team Progress</span>
                    <span>{calculateTeamProgress(team).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculateTeamProgress(team)} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    Goal: {team.goal_points.toLocaleString()} points
                  </div>
                </div>

                {/* Members */}
                <div>
                  <h4 className="font-medium mb-2">Team Members</h4>
                  <div className="flex -space-x-2">
                    {team.members?.slice(0, 5).map((member: any) => (
                      <Avatar key={member.id} className="border-2 border-white">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {getInitials(member.profile?.full_name || 'U')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members?.length > 5 && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 border-white text-xs font-medium">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Trophy className="w-4 h-4 mr-2" />
                    Challenges
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Teams to Join */}
      {availableTeams.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Discover Teams</h3>
          <div className="grid gap-4">
            {availableTeams.map((team: any) => (
              <Card key={team.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(team.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-sm text-gray-600">{team.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{team.members?.[0]?.count || 0} members</Badge>
                          <Badge variant="outline">{team.goal_points.toLocaleString()} points goal</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => joinTeam.mutate(team.id)}
                      disabled={joinTeam.isPending}
                    >
                      Join Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
