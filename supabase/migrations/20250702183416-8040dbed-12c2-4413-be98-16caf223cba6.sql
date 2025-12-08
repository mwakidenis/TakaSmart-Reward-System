
-- First, let's add some sample bins data
INSERT INTO public.bins (name, location, qr_code, latitude, longitude, accepted_waste_types, fill_level, status) VALUES
('Westlands Mall Bin #3', 'Westlands Shopping Centre', 'BIN001', -1.2641, 36.8078, ARRAY['plastic', 'metal', 'paper'], 30, 'active'),
('Sarit Centre Bin #1', 'Sarit Centre', 'BIN002', -1.2615, 36.8047, ARRAY['plastic', 'paper'], 95, 'active'),
('Village Market Bin #2', 'Village Market', 'BIN003', -1.2505, 36.8013, ARRAY['plastic', 'metal', 'paper', 'glass'], 45, 'active'),
('Junction Mall Bin #4', 'Junction Mall', 'BIN004', -1.2364, 36.8847, ARRAY['plastic'], 60, 'maintenance'),
('Yaya Centre Bin #1', 'Yaya Centre', 'BIN005', -1.2893, 36.7831, ARRAY['plastic', 'metal', 'paper'], 20, 'active'),
('Prestige Plaza Bin #2', 'Prestige Plaza', 'BIN006', -1.2701, 36.8103, ARRAY['plastic', 'glass'], 75, 'active');

-- Add sample rewards data
INSERT INTO public.rewards (title, description, type, value, points_required, provider, validity_days, active) VALUES
('Ksh 50 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 50', 500, 'Safaricom', 30, true),
('Ksh 100 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 100', 950, 'Safaricom', 30, true),
('Ksh 200 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 200', 1800, 'Safaricom', 30, true),
('Ksh 50 Airtel Airtime', 'Airtel airtime credit', 'airtime', 'Ksh 50', 500, 'Airtel', 30, true),
('Ksh 100 Airtel Airtime', 'Airtel airtime credit', 'airtime', 'Ksh 100', 950, 'Airtel', 30, true),
('1GB Data Bundle', 'Safaricom data bundle', 'data', '1GB', 800, 'Safaricom', 7, true),
('2GB Data Bundle', 'Safaricom data bundle', 'data', '2GB', 1500, 'Safaricom', 14, true),
('5GB Data Bundle', 'Safaricom data bundle', 'data', '5GB', 3500, 'Safaricom', 30, true),
('1GB Airtel Data', 'Airtel data bundle', 'data', '1GB', 800, 'Airtel', 7, true),
('10% off EcoFriendly Store', 'Discount voucher for eco products', 'discount', '10% off', 200, 'EcoKe', 30, true),
('Ksh 100 off Green Products', 'Discount on sustainable products', 'discount', 'Ksh 100 off', 400, 'Zuri Health', 14, true),
('Free delivery on orders', 'Free shipping voucher', 'discount', 'Free delivery', 300, 'Jumia', 7, true),
('20% off Organic Food', 'Organic food discount', 'discount', '20% off', 600, 'Zucchini', 30, true);

-- Create RLS policies for the tables
ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Bins policies (public read access)
CREATE POLICY "Anyone can view bins" ON public.bins FOR SELECT USING (true);

-- Rewards policies (public read access)
CREATE POLICY "Anyone can view active rewards" ON public.rewards FOR SELECT USING (active = true);

-- Recycling sessions policies (users can only see their own)
CREATE POLICY "Users can view their own sessions" ON public.recycling_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.recycling_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User rewards policies (users can only see their own)
CREATE POLICY "Users can view their own rewards" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reward redemptions" ON public.user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles policies (users can only see and update their own)
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to update the updated_at column for profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a trigger to update user points when recycling sessions are added
CREATE TRIGGER update_user_points_trigger
    AFTER INSERT ON public.recycling_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_points();
