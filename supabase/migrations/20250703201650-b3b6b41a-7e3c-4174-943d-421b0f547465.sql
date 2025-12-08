
-- Create friendships table
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  goal_points INTEGER NOT NULL DEFAULT 1000,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create community challenges table
CREATE TABLE public.community_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('city', 'neighborhood', 'weekly', 'general')),
  goal_points INTEGER NOT NULL,
  rewards TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create challenge participants table
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES community_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points_contributed INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create social posts table for the social feed
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  activity_type TEXT,
  points_earned INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create post likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Add email column to profiles table for friend invitations
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Enable RLS on all new tables
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for friendships
CREATE POLICY "Users can view friendships they're part of" 
  ON public.friendships FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friendships" 
  ON public.friendships FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships they're part of" 
  ON public.friendships FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete friendships they're part of" 
  ON public.friendships FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS policies for teams
CREATE POLICY "Anyone can view public teams" 
  ON public.teams FOR SELECT 
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create teams" 
  ON public.teams FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their teams" 
  ON public.teams FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Team creators can delete their teams" 
  ON public.teams FOR DELETE 
  USING (auth.uid() = created_by);

-- RLS policies for team members
CREATE POLICY "Users can view team members" 
  ON public.team_members FOR SELECT 
  USING (true);

CREATE POLICY "Users can join teams" 
  ON public.team_members FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams" 
  ON public.team_members FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for community challenges
CREATE POLICY "Anyone can view active challenges" 
  ON public.community_challenges FOR SELECT 
  USING (is_active = true);

-- RLS policies for challenge participants
CREATE POLICY "Users can view challenge participants" 
  ON public.challenge_participants FOR SELECT 
  USING (true);

CREATE POLICY "Users can join challenges" 
  ON public.challenge_participants FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for social posts
CREATE POLICY "Users can view all posts" 
  ON public.social_posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own posts" 
  ON public.social_posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON public.social_posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.social_posts FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for post likes
CREATE POLICY "Users can view all likes" 
  ON public.post_likes FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own likes" 
  ON public.post_likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.post_likes FOR DELETE 
  USING (auth.uid() = user_id);

-- Update profiles table to make email accessible to friends
CREATE POLICY "Users can view friend profiles" 
  ON public.profiles FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE (user_id = auth.uid() AND friend_id = profiles.id AND status = 'accepted') OR
            (friend_id = auth.uid() AND user_id = profiles.id AND status = 'accepted')
    )
  );
