
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Wifi, Gift, Clock, Zap, Utensils, GraduationCap, Car } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Rewards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user profile to get current points
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch available rewards
  const { data: rewards = [] } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's redemption history
  const { data: redemptions = [] } = useQuery({
    queryKey: ['user-redemptions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          rewards (title, points_required)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Redeem reward mutation
  const redeemMutation = useMutation({
    mutationFn: async ({ rewardId, pointsRequired }: { rewardId: string, pointsRequired: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Generate redemption code
      const redemptionCode = Math.random().toString(36).substring(2, 15).toUpperCase();
      
      const { data, error } = await supabase
        .from('user_rewards')
        .insert({
          user_id: user.id,
          reward_id: rewardId,
          points_spent: pointsRequired,
          redemption_code: redemptionCode,
          status: 'processed'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update user points
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          total_points: (profile?.total_points || 0) - pointsRequired 
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      return { ...data, redemption_code: redemptionCode };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-redemptions'] });
      toast.success(`Reward redeemed! Code: ${data.redemption_code}`);
    },
    onError: (error) => {
      toast.error('Failed to redeem reward: ' + error.message);
    }
  });

  const userPoints = profile?.total_points || 0;

  const handleRedeem = (reward: any) => {
    if (userPoints >= reward.points_required) {
      redeemMutation.mutate({ 
        rewardId: reward.id, 
        pointsRequired: reward.points_required 
      });
    } else {
      toast.error(`Not enough points. You need ${reward.points_required - userPoints} more points.`);
    }
  };

  // Group rewards by type
  const airtimeRewards = rewards.filter(r => r.type === 'airtime');
  const dataRewards = rewards.filter(r => r.type === 'data');
  const discountRewards = rewards.filter(r => r.type === 'discount');
  const electronicsRewards = rewards.filter(r => r.type === 'electronics');
  const ecoRewards = rewards.filter(r => r.type === 'eco');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  };

  const RewardCard = ({ reward }: { reward: any }) => (
    <Card key={reward.id} className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">{reward.title}</h3>
            <p className="text-sm text-gray-600">{reward.provider}</p>
            {reward.validity_days && (
              <p className="text-xs text-gray-500">Valid for {reward.validity_days} days</p>
            )}
            {reward.description && (
              <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
            )}
            <Badge variant="outline" className="mt-2">
              {reward.points_required.toLocaleString()} points
            </Badge>
          </div>
          <Button
            onClick={() => handleRedeem(reward)}
            disabled={userPoints < reward.points_required || redeemMutation.isPending}
            variant={userPoints >= reward.points_required ? "default" : "secondary"}
            className={userPoints >= reward.points_required ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {redeemMutation.isPending ? "Redeeming..." :
             userPoints >= reward.points_required ? "Redeem" : "Not Enough Points"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
        <h1 className="text-2xl font-bold">🎁 Rewards Store</h1>
        <div className="flex items-center gap-2 mt-2">
          <span>Available Points:</span>
          <Badge className="bg-white text-green-600 text-lg px-3 py-1">
            {userPoints.toLocaleString()}
          </Badge>
        </div>
        <p className="text-sm opacity-90 mt-1">
          {electronicsRewards.length + ecoRewards.length + discountRewards.length + airtimeRewards.length + dataRewards.length} rewards available!
        </p>
      </div>

      <div className="p-6">
        <Tabs defaultValue="airtime" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="airtime" className="flex flex-col items-center gap-1 text-xs">
              <Smartphone size={16} />
              Airtime
            </TabsTrigger>
            <TabsTrigger value="data" className="flex flex-col items-center gap-1 text-xs">
              <Wifi size={16} />
              Data
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex flex-col items-center gap-1 text-xs">
              <Gift size={16} />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="electronics" className="flex flex-col items-center gap-1 text-xs">
              <Zap size={16} />
              Electronics
            </TabsTrigger>
            <TabsTrigger value="eco" className="flex flex-col items-center gap-1 text-xs">
              <Utensils size={16} />
              Eco
            </TabsTrigger>
          </TabsList>

          <TabsContent value="airtime" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {airtimeRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {dataRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {discountRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="electronics" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {electronicsRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="eco" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {ecoRewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Redemptions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Recent Redemptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redemptions.length > 0 ? (
                redemptions.map((redemption) => (
                  <div key={redemption.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{redemption.rewards?.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(redemption.created_at)}</p>
                      {redemption.redemption_code && (
                        <p className="text-xs text-green-600 font-mono">Code: {redemption.redemption_code}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        -{redemption.points_spent.toLocaleString()} points
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{redemption.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No redemptions yet</p>
                  <p className="text-sm">Start redeeming rewards to see your history!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Rewards;
