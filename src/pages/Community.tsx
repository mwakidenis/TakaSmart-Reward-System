
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Trophy, Heart, BarChart3, UserPlus, Target } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SocialFeed from "@/components/SocialFeed";
import AchievementBadges from "@/components/AchievementBadges";
import ImpactCalculator from "@/components/ImpactCalculator";
import Leaderboard from "@/components/Leaderboard";
import Friends from "@/components/Friends";
import Teams from "@/components/Teams";
import CommunityChallenge from "@/components/CommunityChallenge";

const Community = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Community</h1>
              <p className="opacity-90">Connect, compete, and make a difference together</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="feed" className="flex items-center gap-1">
              <Heart size={14} />
              <span className="hidden sm:inline">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-1">
              <UserPlus size={14} />
              <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-1">
              <Users size={14} />
              <span className="hidden sm:inline">Teams</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Target size={14} />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-1">
              <Trophy size={14} />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-1">
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <SocialFeed />
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            <Friends />
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <Teams />
          </TabsContent>

          <TabsContent value="challenges" className="mt-6">
            <CommunityChallenge />
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <AchievementBadges />
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <ImpactCalculator />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default Community;
