
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, Mail, MapPin, Trophy, Recycle, Calendar, Settings, Edit2, Save, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    location: ''
  });

  // Fetch user profile
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

  // Fetch monthly stats
  const { data: monthlyStats } = useQuery({
    queryKey: ['monthly-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('recycling_sessions')
        .select('created_at, points_earned')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Group by month
      const monthlyData: { [key: string]: { points: number; sessions: number } } = {};
      
      data?.forEach(session => {
        const date = new Date(session.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { points: 0, sessions: 0 };
        }
        
        monthlyData[monthKey].points += session.points_earned;
        monthlyData[monthKey].sessions += 1;
      });

      return Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .slice(0, 4);
    },
    enabled: !!user?.id
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: typeof editForm) => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    }
  });

  const handleEditClick = () => {
    setEditForm({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      location: profile?.location || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ full_name: '', phone: '', location: '' });
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Profile Info */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-16 h-16 bg-white text-green-600">
            <AvatarFallback className="text-lg font-bold">
              {getInitials(profile.full_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name || 'User'}</h1>
            <p className="opacity-90">Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.total_points?.toLocaleString() || 0}</div>
            <div className="text-xs opacity-90">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{monthlyStats?.reduce((sum, stat) => sum + stat.sessions, 0) || 0}</div>
            <div className="text-xs opacity-90">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">#--</div>
            <div className="text-xs opacity-90">Current Rank</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={20} />
                Contact Information
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEditClick}>
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isEditing ? (
              <>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <Input
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                    placeholder="Full Name"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="Phone Number"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-500" />
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Location"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-500" />
                  <span>{profile.full_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <span>{profile.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-500" />
                  <span>{profile.location || 'Not provided'}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Monthly History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyStats && monthlyStats.length > 0 ? (
                monthlyStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{stat.month}</p>
                      <p className="text-sm text-gray-600">{stat.sessions} sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{stat.points} pts</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>No activity yet</p>
                  <p className="text-sm">Start recycling to see your history!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Profile;
