
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create bins table
CREATE TABLE public.bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  qr_code TEXT UNIQUE NOT NULL,
  fill_level INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 100,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'maintenance', 'offline')),
  accepted_waste_types TEXT[] DEFAULT ARRAY['plastic', 'metal', 'paper'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waste types table
CREATE TYPE public.waste_type AS ENUM ('plastic', 'metal', 'paper', 'glass', 'organic');

-- Create recycling sessions table
CREATE TABLE public.recycling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bin_id UUID REFERENCES public.bins(id) ON DELETE CASCADE NOT NULL,
  waste_type public.waste_type NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  photo_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('airtime', 'data', 'discount')),
  value TEXT NOT NULL, -- e.g., "Ksh 50", "1GB", "10% off"
  points_required INTEGER NOT NULL,
  provider TEXT, -- e.g., "Safaricom", "Airtel"
  validity_days INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user rewards (redemptions) table
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  redemption_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for bins
CREATE POLICY "Anyone can view bins" ON public.bins
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage bins" ON public.bins
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for recycling_sessions
CREATE POLICY "Users can view own sessions" ON public.recycling_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.recycling_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.recycling_sessions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for rewards
CREATE POLICY "Anyone can view active rewards" ON public.rewards
  FOR SELECT TO authenticated USING (active = true);

CREATE POLICY "Admins can manage rewards" ON public.rewards
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for user_rewards
CREATE POLICY "Users can view own redemptions" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own redemptions" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions" ON public.user_rewards
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update points when recycling session is created
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET total_points = total_points + NEW.points_earned,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update points on recycling
CREATE TRIGGER on_recycling_session_created
  AFTER INSERT ON public.recycling_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- Insert sample data for bins
INSERT INTO public.bins (name, location, qr_code, latitude, longitude, fill_level, accepted_waste_types) VALUES
('Westlands Mall', 'Westlands Shopping Centre, Nairobi', 'BIN001', -1.2641, 36.8078, 30, ARRAY['plastic', 'metal', 'paper']),
('Sarit Centre', 'Sarit Centre, Westlands', 'BIN002', -1.2615, 36.8047, 95, ARRAY['plastic', 'paper']),
('Village Market', 'Village Market, Gigiri', 'BIN003', -1.2505, 36.8013, 45, ARRAY['plastic', 'metal', 'paper', 'glass']),
('Junction Mall', 'Junction Mall, Ngong Road', 'BIN004', -1.2364, 36.8847, 60, ARRAY['plastic']);

-- Update bin statuses based on fill levels
UPDATE public.bins SET status = 'full' WHERE fill_level > 90;
UPDATE public.bins SET status = 'maintenance' WHERE name = 'Junction Mall';

-- Insert sample rewards
INSERT INTO public.rewards (title, description, type, value, points_required, provider) VALUES
('Ksh 50 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 50', 500, 'Safaricom'),
('Ksh 100 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 100', 950, 'Safaricom'),
('Ksh 200 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 200', 1800, 'Safaricom'),
('Ksh 50 Airtel Airtime', 'Airtel airtime credit', 'airtime', 'Ksh 50', 500, 'Airtel'),
('1GB Data Bundle', 'Safaricom data bundle', 'data', '1GB', 800, 'Safaricom'),
('2GB Data Bundle', 'Safaricom data bundle', 'data', '2GB', 1500, 'Safaricom'),
('5GB Data Bundle', 'Safaricom data bundle', 'data', '5GB', 3500, 'Safaricom'),
('10% off EcoFriendly Store', 'Discount at eco-friendly stores', 'discount', '10% off', 200, 'EcoKe'),
('Ksh 100 off Green Products', 'Discount on green products', 'discount', 'Ksh 100 off', 400, 'Zuri Health');
