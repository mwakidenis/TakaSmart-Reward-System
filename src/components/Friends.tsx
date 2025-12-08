
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, MessageCircle, Trophy, Search, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Friends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchEmail, setSearchEmail] = useState("");

  // Fetch friends
  const { data: friends = [] } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:profiles!friendships_friend_id_fkey(id, full_name, total_points)
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch friend requests
  const { data: friendRequests = [] } = useQuery({
    queryKey: ['friend-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:profiles!friendships_user_id_fkey(id, full_name, total_points)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });

  // Send friend request
  const sendFriendRequest = useMutation({
    mutationFn: async (email: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Find user by email
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError) throw new Error('User not found');
      
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: targetUser.id,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request sent!');
      setSearchEmail('');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send friend request');
    }
  });

  // Accept friend request
  const acceptFriendRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request accepted!');
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    }
  });

  // Reject friend request
  const rejectFriendRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Friend request rejected');
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
    }
  });

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Add Friends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter friend's email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => sendFriendRequest.mutate(searchEmail)}
              disabled={!searchEmail || sendFriendRequest.isPending}
            >
              <Search className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">
            My Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({friendRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          {friends.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Users className="mx-auto mb-4 text-gray-300" size={48} />
                <p>No friends yet</p>
                <p className="text-sm">Start by adding some friends above!</p>
              </CardContent>
            </Card>
          ) : (
            friends.map((friendship: any) => (
              <Card key={friendship.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {getInitials(friendship.friend.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{friendship.friend.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          {friendship.friend.total_points} points
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trophy className="w-4 h-4 mr-2" />
                        Challenge
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {friendRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Users className="mx-auto mb-4 text-gray-300" size={48} />
                <p>No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            friendRequests.map((request: any) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(request.requester.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{request.requester.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          {request.requester.total_points} points
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => acceptFriendRequest.mutate(request.id)}
                        disabled={acceptFriendRequest.isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => rejectFriendRequest.mutate(request.id)}
                        disabled={rejectFriendRequest.isPending}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Friends;
